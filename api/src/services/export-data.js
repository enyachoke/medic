const { Readable } = require('stream');

const BATCH = 100;

const MAPPERS = {
  reports: require('./export/report-mapper'),
  contacts: require('./export/contact-mapper'),
  messages: require('./export/message-mapper'),
  feedback: require('./export/feedback-mapper'),
};

<<<<<<< HEAD
var exportTypes = {
  feedback: {
    ddoc: 'medic-admin',
    view: 'feedback',
    generate: function(rows, options) {
      options.columns = createColumnModels(
        ['_id', 'reported_date', 'User', 'App Version', 'URL', 'Info'],
        options
      );
      var model = {
        name: config.translate('Feedback', options.locale),
        columns: options.columns,
      };
      model.data = _.map(rows, function(row) {
        return [
          row.doc._id,
          formatDate(row.doc.meta.time, options.timezone),
          row.doc.meta.user.name,
          row.doc.meta.version,
          row.doc.meta.url,
          safeStringify(row.doc.info),
        ];
      });
      return [model];
    },
  },
};
=======
const joinLine = (csvLine) => csvLine.join(',') + '\n';

const csvLineToString = (csvLine) => {
  const escapedCsvLine = csvLine.map(cell => {
    let escaped;

    // Strings and arrays (because they contain commas, might contain strings
    // etc) need to be quoted and escaped
    if (typeof cell === 'string') {
      escaped = cell.replace(/"/g, '\\"');
    } else if (Array.isArray(cell)) {
      escaped = JSON.stringify(cell).replace(/"/g, '\\"');
    } else {
      // We don't need to escape this
      return cell;
    }
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41

    return `"${escaped}"`;
  });

  return joinLine(escapedCsvLine);
};

class SearchResultReader extends Readable {

  constructor(type, filters, searchOptions, readableOptions) {
    super(readableOptions);

    this.filters = filters;
    this.options = searchOptions;
    this.mapper = MAPPERS[type];

    // There is no reason for a user to pass a skip, but we're going to allow
    // users to pass a limit. This could be useful as an escape hatch / tweak in
    // production.
    this.options.skip = 0;
    this.options.limit = this.options.limit || BATCH;
  }

  _read() {
    if (!this.getRows) {
      return this.mapper.map(this.filters, this.options)
        .then(({ header, getRows }) => {
          this.getRows = getRows;
          this.push(joinLine(header));
        });
    }

    return this.mapper.getDocIds(this.options, this.filters)
      .then(ids => {

        if (!ids.length) {
          return this.push(null);
        }

        this.options.skip += this.options.limit;

        return this.mapper.getDocs(ids)
          .then(docs => {
            const lines = docs.map(doc => {
              return this.getRows(doc).map(csvLineToString).join('');
            });
            this.push(lines.join(''));
          });
      })
      .catch(err => {
        process.nextTick(() => this.emit('error', err));
      });
  }
}

module.exports = {
  export: (type, filters, options) => new SearchResultReader(type, filters, options),
  isSupported: type => !!MAPPERS[type],
  _mapper: type => MAPPERS[type]
};
