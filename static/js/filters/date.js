var _ = require('underscore');

(function () {

  'use strict';

  var module = angular.module('inboxFilters');

  var getRelativeDate = function(date, options) {
    var options = options || {};
    _.defaults(options, { prefix: '', suffix: '' });
    if (!date) {
      return '<span>' + options.prefix + options.suffix + '</span>';
    }
    date = moment(date);
    var absolute = options.FormatDate.datetime(date);
    var relative;
    if (options.withoutTime && date.isSame(moment(), 'd')) {
      relative = options.$translate.instant('today');
    } else {
      relative = options.FormatDate.relative(date);
    }
    return options.prefix +
           '<span class="relative-date" title="' + absolute + '">' +
             '<span class="relative-date-content">' + relative + '</span>' +
           '</span>' +
           options.suffix;
  };

  var getTaskDate = function(task) {
    if (task.state === 'scheduled') {
      return task.due;
    }
    if (task.state_history && task.state_history.length) {
      return task.state_history[task.state_history.length - 1].timestamp;
    }
    return task.due || task.reported_date;
  };

  var getState = function(state, translate) {
    return '<span class="state ' + state + '">' + translate('state.' + state) + '</span>';
  };

  module.filter('autoreply', ['FormatDate', 'translateFilter',
    function (FormatDate, translateFilter) {
      return function (task) {
        if (!task || !task.state) {
          return '';
        }
        var content = getState(task.state, translateFilter) + '&nbsp;' +
          '<span class="autoreply" title="' + task.messages[0].message + '">' +
            '<span class="autoreply-content">' + translateFilter('autoreply') + '</span>' +
          '</span>&nbsp';
        return getRelativeDate(getTaskDate(task), {
          FormatDate: FormatDate,
          prefix: content
        });
      };
    }
  ]);

  var getRecipient = function(task, translateFilter) {
    if (task && task.messages && task.messages.length && task.messages[0].to) {
      return '<span class="recipient">&nbsp;' +
               translateFilter('to recipient', { recipient: task.messages[0].to }) +
             '</span>';
    }
    return '';
  };

  module.filter('state', ['FormatDate', 'translateFilter',
    function (FormatDate, translateFilter) {
      return function (task) {
        if (!task) {
          return '';
        }
        var options = {
          FormatDate: FormatDate,
          prefix: getState(task.state || 'received', translateFilter) + '&nbsp;',
          suffix: getRecipient(task, translateFilter)
        };
        return getRelativeDate(getTaskDate(task), options);
      };
    }
  ]);

  module.filter('relativeDate', ['FormatDate',
    function (FormatDate) {
      return function (date) {
        return getRelativeDate(date, { FormatDate: FormatDate });
      };
    }
  ]);

  module.filter('relativeDay', ['$translate', 'FormatDate',
    function ($translate, FormatDate) {
      return function (date) {
        return getRelativeDate(date, {
          $translate: $translate,
          FormatDate: FormatDate,
          withoutTime: true
        });
      };
    }
  ]);

  module.filter('simpleDate', ['FormatDate',
    function (FormatDate) {
      return function (date) {
        return FormatDate.date(date);
      };
    }
  ]);

  module.filter('simpleDateTime', ['FormatDate',
    function (FormatDate) {
      return function (date) {
        return FormatDate.datetime(date);
      };
    }
  ]);

  module.filter('fullDate', ['FormatDate',
    function (FormatDate) {
      return function (date) {
        if (!date) {
          return '';
        }
        return '<div class="relative-date-content">' + FormatDate.relative(date) + '</div>' +
               '<div class="full-date">' + FormatDate.datetime(date) + '</div>';
      };
    }
  ]);

  module.filter('weeksPregnant', ['FormatDate',
    function () {
      return function (weeks) {
        if (!weeks || !weeks.number) {
          return '';
        }
        var classes = [];
        if (weeks.number >= 37) {
          classes.push('upcoming-edd');
        }
        if (weeks.approximate) {
          classes.push('approximate');
        }
        var attr = classes.length ? ' class="' + classes.join(' ') + '"' : '';
        return '<span' + attr + '>' + weeks.number + '</span>';
      };
    }
  ]);

}());
