const serverChecks = require('@medic/server-checks'),environment = require('./src/environment'),
logger = require('./src/logger');
serverChecks.check(environment.serverUrl).then(() => {
        config = require('./src/config'),
        migrations = require('./src/migrations'),
        ddocExtraction = require('./src/ddoc-extraction'),
        resourceExtraction = require('./src/resource-extraction'),
        translations = require('./src/translations');
    Promise.resolve()
        .then(() => logger.info('Extracting ddoc…'))
        .then(ddocExtraction.run)
        .then(() => logger.info('DDoc extraction completed successfully'))

        .then(() => logger.info('Extracting resources…'))
        .then(resourceExtraction.run)
        .then(() => logger.info('Extracting resources completed successfully'))

        .then(() => logger.info('Loading configuration…'))
        .then(config.load)
        .then(() => logger.info('Configuration loaded successfully'))
        .then(config.listen)

        .then(() => logger.info('Merging translations…'))
        .then(translations.run)
        .then(() => logger.info('Translations merged successfully'))

        .then(() => logger.info('Running db migrations…'))
        .then(migrations.run)
        .then(() => logger.info('Database migrations completed successfully'))

        .catch(err => {
            logger.error('Fatal error initialising medic-api');
            logger.error('%o', err);
            process.exit(1);
        })

        .then(() => {
           process.exit(0);
        })
});


