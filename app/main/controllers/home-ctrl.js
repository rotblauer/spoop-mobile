'use strict';
angular.module('main')
.controller('HomeCtrl', function ($log, $scope, $ionicHistory, $ionicPopup, $state, $timeout, Tallyrally, Store, APP_CONSTANTS) {

  $scope.notice = '';
  $scope.notesPlaceholder = APP_CONSTANTS.notesPlaceholder;

  //Update time in form when entering view.
  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    $scope.updateTime();
  });


  function initNewPoop () {
    $scope.newPoop = new Tallyrally();
    $scope.newPoop.donated = true;
    $scope.newPoop.processable = true;
    $scope.newPoop.bristol_score = 4;
    $scope.newPoop.weight = 65;
    $scope.newPoop.time_of_passage = Date.now();
    $scope.newPoop.notes = '';
  }
  initNewPoop();

  // watch donated
  $scope.$watch('newPoop.donated', function (newData) {
    // $log.log(newData);
    if (!newData && $scope.newPoop.processable) {
      $scope.newPoop.processable = false;
    }
  });
  //watch processable
  $scope.$watch('newPoop.processable', function (newData) {
    // $log.log(newData);
    if (newData && !$scope.newPoop.donated) {
      $scope.newPoop.donated = true;
    }
  });

  $scope.addPoop = function () {
    $scope.newPoop.$save(function () {
      // $log.log('saved poop');
      flashNotice('balanced', 'Poop saved!');
      initNewPoop();
      $state.go('main.list');
    }, function (err) {
      flashNotice('assertive', err.statusText);
      $log.log(err);
    });
  };

  $scope.updateTime = function () {
    $scope.newPoop.time_of_passage = Date.now();
  };

  function flashNotice (classs, message) {
    $scope.noticeClass = classs;
    $scope.notice = message;
    $timeout(function () {
      $scope.noticeClass = '';
      $scope.notice = '';
    }, 2500);
  }

  // Triggered on a button click, or some other target
  $scope.showPopup = function () {
    // $scope.data = {};
    $log.log('lcicked!');
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="tel" ng-model="newPoop.weight">',
      title: 'Custom Weight',
      subTitle: '(in grams!)',
      scope: $scope,
      buttons: [
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.newPoop.weight) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.newPoop.weight;
            }
          }
        }
      ]
    });

    myPopup.then(function (res) {
      console.log('Tapped!', res);
    });
   };

   // $scope.areaConfig = {
   //   autocomplete: [
   //      {
   //        words: [/#([A-Za-z]+[_A-Za-z0-9]+)/gi],
   //        cssClass: 'thing'
   //      }
   //    ]
   // };

   // $scope.textareaHighLightOption = {
   //    words: [/#([A-Za-z]+[_A-Za-z0-9]+)/gi],
   //    color: '#ffff00'
   // };

   $scope.format = {
    // 'rgba(255,0,0,0.5)' : /\d+/g,
    '#83B8F5'           : APP_CONSTANTS.regex.hashtagHighlight
    // '#25B520'           : 'Lorem'
   };

   $scope.listMarkers = function ($markers) {
     $scope.markers = $markers;
   };

});
