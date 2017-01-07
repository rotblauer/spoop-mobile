'use strict';
angular.module('main')
.controller('ListDetailCtrl', function ($state, $scope, $ionicPopup, $timeout, $log, poop, Tallyrally, APP_CONSTANTS) {

  // $scope.data = Tallyrally.get({id: poopId}, function (response) {
  //   $log.log(response);

  // });
  $scope.data = {};
  $scope.notesPlaceholder = APP_CONSTANTS.notesPlaceholder;
  $scope.data.poop = poop;

  $scope.notice = {
    success: '',
    error: ''
  };

  $scope.$watch('data.poop.donated', function (newData, oldData) {
    //if false
    if (!newData && $scope.data.poop.processable) {
      $scope.data.poop.processable = false;
    }
  });

  $scope.$watch('data.poop.processable', function (newData, oldData) {
    if (newData && !$scope.data.poop.donated) {
      $scope.data.poop.donated = true;
    }
  });

  // $scope.$watch('data.poop', function (newThing, old ) {
  //     $log.log('newThing ->', newThing);
  //     $log.log('old ->', old);
  // }, true);


  $scope.update = function () {
    $scope.data.poop.$update(function (response) {
      $log.log(response);
      showSuccess('Successfully updated!');
    }, function (err) {
      $log.log(err);
      showError('Failed to update. ' + err);
    });
  };

  $scope.delete = function () {
    $scope.data.poop.$delete(function () {
      $state.go('main.list');
    });
  };

  function showSuccess (message) {
    $scope.notice.success = message;
    $timeout(function () {
      $scope.notice.success = '';
       }, 3000);
  }
  function showError (message) {
    $scope.notice.error = message;
    $timeout(function () {
      $scope.notice.error = '';
       }, 3000);
  }

  // Triggered on a button click, or some other target
  $scope.showPopup = function () {
    // $scope.data = {};
    $log.log('lcicked!');
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="tel" ng-model="data.weight">',
      title: 'Custom Weight',
      subTitle: '(in grams!)',
      scope: $scope,
      buttons: [
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.data.poop.weight) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.poop.weight;
            }
          }
        }
      ]
    });

    myPopup.then(function (res) {
      console.log('Tapped!', res);
    });
   };


   $scope.format = {
    // 'rgba(255,0,0,0.5)' : /\d+/g,
    '#83B8F5': APP_CONSTANTS.regex.hashtagHighlight ///#[a-z0-9]+/gi
    // '#25B520'           : 'Lorem'
   };

   $scope.listMarkers = function ($markers) {
     $scope.markers = $markers;
   };

});
