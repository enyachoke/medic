const environment = require('./src/environment'),
  serverChecks = require('@medic/server-checks'),
  logger = require('./src/logger');
const cluster = require('cluster');
const os = require('os')
const workers = [];
const setupWorkerProcesses = () => {
  // to read number of cores on system
  let numCores = require('os').cpus().length;
  logger.info('Master cluster setting up ' + numCores + ' workers');

  // iterate on number of cores need to be utilized by an application
  // current example will utilize all of them
  for (let i = 0; i < numCores; i++) {
    // creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());

    // to receive messages from worker process
    workers[i].on('message', function (message) {
      logger.info(message);
    });
  }

  // process is clustered on a core and process id is assigned
  cluster.on('online', function (worker) {
    logger.info('Worker ' + worker.process.pid + ' is listening');
  });

  // if any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function (worker, code, signal) {
    logger.info('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    logger.info('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[workers.length - 1].on('message', function (message) {
      logger.info(message);
    });
  });
};
process
  .on('unhandledRejection', reason => {
    logger.error('UNHANDLED REJECTION!');
    logger.error('  Reason: %o', reason);
  })
  .on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION!');
    logger.error('  Error: %o', err);
    process.exit(1);
  });

serverChecks.check(environment.serverUrl).then(() => {
  const app = require('./src/routing'),
    serverUtils = require('./src/server-utils'),
    apiPort = process.env.API_PORT || 5988;
  app.use((err, req, res, next) => {
    // jshint ignore:line
    if (res.headersSent) {
      // If we've already started a response (eg streaming), pass on to express to abort it
      // rather than attempt to resend headers for a 5xx response
      return next(err);
    }
    serverUtils.serverError(err, req, res);
  });
  if (cluster.isMaster) {
    setupWorkerProcesses();
  }
  else {
    app.listen(apiPort, () => {
      logger.info('Medic API listening on port ' + apiPort);
    })

  }
  cluster.on('exit', (worker) => {
    logger.info('mayday! mayday! worker' + worker.id + ' is no more!')
    cluster.fork()
  });
});
