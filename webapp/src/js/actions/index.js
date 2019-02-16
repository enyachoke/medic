angular.module('inboxServices').factory('Actions',
  function() {
    'use strict';

    function createSingleValueAction(type, valueName, value) {
      var action = {
        type: type,
        payload: {}
      };
      action.payload[valueName] = value;
      return action;
    }

    return function(dispatch) {

      function createSetCancelCallbackAction(value) {
        return createSingleValueAction('SET_CANCEL_CALLBACK', 'cancelCallback', value);
      }

      function createSetEnketoStatusAction(value) {
        return createSingleValueAction('SET_ENKETO_STATUS', 'enketoStatus', value);
      }

      function createSetSelectModeAction(value) {
        return createSingleValueAction('SET_SELECT_MODE', 'selectMode', value);
      }

      function createSetSelectedAction(value) {
        return createSingleValueAction('SET_SELECTED', 'selected', value);
      }

      function createSetSelectedPropertyAction(value) {
        return createSingleValueAction('SET_SELECTED_PROPERTY', 'selected', value);
      }

      return {
        clearCancelCallback: function() {
          dispatch(createSetCancelCallbackAction(null));
        },

        setCancelCallback: function(cancelCallback) {
          dispatch(createSetCancelCallbackAction(cancelCallback));
        },

        setEnketoError: function(error) {
          dispatch(createSetEnketoStatusAction({ error: error }));
        },

        setEnketoEditedStatus: function(edited) {
          dispatch(createSetEnketoStatusAction({ edited: edited }));
        },

        setEnketoSavingStatus: function(saving) {
          dispatch(createSetEnketoStatusAction({ saving: saving }));
        },

        setSelectMode: function(selectMode) {
          dispatch(createSetSelectModeAction(selectMode));
        },

        setSelected: function(selected) {
          dispatch(createSetSelectedAction(selected));
        },

        setSelectedAreTasksEnabled: function(enabled) {
          dispatch(createSetSelectedPropertyAction({ areTasksEnabled: enabled }));
        },

        setSelectedTasks: function(tasks) {
          dispatch(createSetSelectedPropertyAction({ tasks: tasks }));
        },

        setSelectedSummary: function(summary) {
          dispatch(createSetSelectedPropertyAction({ summary: summary }));
        },

        setSelectedError: function(error) {
          dispatch(createSetSelectedPropertyAction({ error: error }));
        }
      };
    };
  }
);
