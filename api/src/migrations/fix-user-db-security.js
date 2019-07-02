const db = require('../db'),
      {promisify} = require('util'),
      userDb = require('../services/user-db');

module.exports = {
  name: 'fix-user-db-security',
  created: new Date(2018, 4, 12),
  run: promisify(callback => {
    db.users.allDocs()
      .then(docs => {
        const usernames = docs.rows
          .map(row => row.id)
          .filter(id => id.indexOf('org.couchdb.user:') === 0)
          .map(id => id.split(':')[1]);

        return usernames.reduce((p, username) => {
          return p.then(() => {
<<<<<<< HEAD
            return new Promise((resolve, reject) => {
              userDb.setSecurity(userDb.getDbName(username), username, err => {
                if (err && err.statusCode !== 404) { // db not found is ok
                  return reject(err);
=======
            return userDb.setSecurity(userDb.getDbName(username), username)
              .catch(err => {
                if (err.statusCode !== 404) {
                  throw err;
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41
                }
                // db not found is ok
              });
<<<<<<< HEAD
            });
=======
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41
          });
        }, Promise.resolve());
      })
      .then(() => callback())
      .catch(callback);
  })
};
