const db = require('../../db'),
      search = require('@medic/search')(Promise, db.medic),
      lineage = require('@medic/lineage')(Promise, db.medic);

module.exports = {
<<<<<<< HEAD
=======
  getDocs: ids => {
    return db.medic.allDocs({ keys: ids, include_docs: true })
      .then(result => result.rows.map(row => row.doc))
      .then(lineage.hydrateDocs);
  },
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41
  getDocIds: (options, filters) => {
    return search('contacts', filters, options).then(results => results.docIds);
  },
  map: () => Promise.resolve({
    header: ['id', 'rev', 'name', 'patient_id', 'type'],
    getRows: record => [[record._id, record._rev, record.name, record.patient_id, record.type]]
  })
};
