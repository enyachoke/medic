/*
<<<<<<< HEAD:webapp/src/js/controllers/reloading-modal.js
Controller for the Modal service which executes window.reload when submitted.
=======
Controller for the Modal service which executes $window.reload when submitted.
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41:webapp/src/js/controllers/reloading-modal.js
*/
angular.module('inboxControllers').controller('ReloadingModalCtrl',
  function (
    $scope,
    $uibModalInstance,
    $window
  ) {

    'use strict';
    'ngInject';

    $scope.submit = function() {
      $uibModalInstance.close();
      $window.location.reload();
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss();
    };

  }
);
