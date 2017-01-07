'use strict';
angular.module('main')
.controller('DebugCtrl', function ($scope, $log, keychain) {


  $scope.data = {};
  keychain.get.then(function (data) {
    $scope.data.apiKey = data;
  });


  $scope.setKey = function (key) {
    $log.log('setting key ->', key);

    if (key !== null && key.length > 10) {
      keychain.set(key).then(function () {
        $scope.data.lfresponseClass = 'type-balanced';
        $scope.data.lfresponse = 'Got it! Restart the app, and we\'ll take it from there!';
      });
    } else {
      $scope.data.lfresponseClass = 'type-assertive';
      $scope.data.lfresponse = 'That key looks a little short! Try again?';
    }

  };
  // bind data from services
  // $scope.someData = Main.someData;
  // $scope.ENV = Config.ENV;
  // $scope.BUILD = Config.BUILD;

  // // PASSWORD EXAMPLE
  // $scope.password = {
  //   input: '', // by user
  //   strength: ''
  // };
  // $scope.grade = function () {
  //   var size = $scope.password.input.length;
  //   if (size > 8) {
  //     $scope.password.strength = 'strong';
  //   } else if (size > 3) {
  //     $scope.password.strength = 'medium';
  //   } else {
  //     $scope.password.strength = 'weak';
  //   }
  // };
  // $scope.grade();

});
