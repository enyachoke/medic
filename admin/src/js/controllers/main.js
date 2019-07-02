angular.module('controllers').controller('MainCtrl',
  function (
    $log,
    $scope,
    $state,
    $translate,
    $window,
    Auth,
<<<<<<< HEAD
    $scope,
    Location
=======
    Location,
    Session
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41
  ) {
    'ngInject';
    $translate.use('en');
    $scope.authorized = false;
<<<<<<< HEAD
=======
    $scope.navbarCollapsed = true;
>>>>>>> 4e139626073cbda5df71756ece2ed5edf71b4c41
    Auth('can_configure')
    .then(function() {
      $scope.authorized = true;
    })
    .catch(function() {
      $log.error('Insufficient permissions. Must be either "admin" or "nationalAdmin".');
      $window.location.href = Location.path;
    });


    $scope.webAppUrl = Location.path;
    $scope.logout = function() {
      Session.logout();
    };
    $scope.checkActive = state => {
      if (state === 'targets' && $state.is('targets-edit')) {
        // a special case for a route that doesn't match our usual pattern
        return true;
      }
      return $state.includes(state);
    };
  }
);
