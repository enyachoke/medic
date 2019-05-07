function(doc) {
  var types = [ 'district_hospital', 'health_center', 'clinic', 'person' ];
  var idx;
  if (doc.type === 'contact') {
    idx = types.indexOf(doc.contact_type);
    if (idx === -1) {
      idx = doc.contact_type;
    }
  } else {
    idx = types.indexOf(doc.type);
  }
  if (idx !== -1) {
    var dead = !!doc.date_of_death;
    var name = doc.name && doc.name.toLowerCase();
    var order = dead + ' ' + idx + ' ' + name;
    emit([ order ], name);
  }
}
