function(doc) {
  if (doc.type === 'data_record' &&
      doc.form &&
      doc.fields &&
      doc.fields.visited_contact_uuid) {

<<<<<<< HEAD
    // Is a visit report about a family
    emit(doc.reported_date, doc.fields.visited_contact_uuid);
=======
    var visited_date = doc.fields.visited_date ? Date.parse(doc.fields.visited_date) : doc.reported_date;

    // Is a visit report about a family
    emit(visited_date, doc.fields.visited_contact_uuid);
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41
  }
}
