'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ngResource',
  'ion-datetime-picker',
  'angular.filter',
  'nvd3',
  'angularMoment',
  'LocalForageModule',
  'input-highlight'
  // TODO: load other modules selected during generation
])
.config(['$httpProvider', 'keychainProvider', function ($httpProvider, keychainProvider) {
    // set api token
    // http://stackoverflow.com/questions/17485900/injecting-dependencies-in-config-modules-angularjs
    var apiToken = keychainProvider.$get().get.then(function (data) {
      var apiToken = data;
      if (data && data.length > 1) {
        $httpProvider.defaults.headers.common['Authorization'] = 'Token  ' + apiToken;
      }
    });

    // should be default
    // $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
}])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/home');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      controller: 'MenuCtrl as menu',
      resolve: {
        apikey: function ($state, keychain) {
          return keychain.get.then(function (data) {
            if (data && data.length > 1) {
              return data;
            }
            else {
              $state.go('debug');
            }
          });
        }
      }
    })
      .state('main.home', {
        url: '/home',
        views: {
          'main-home': {
            templateUrl: 'main/templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('main.stats', {
        url: '/stats',
        views: {
          'main-stats': {
            templateUrl: 'main/templates/stats.html',
            controller: 'StatsCtrl'
          }
        }
      })
      .state('main.times', {
        url: '/times',
        views: {
          'main-times': {
            templateUrl: 'main/templates/times.html',
            controller: 'TimesCtrl'
          }
        }
      })
      .state('main.list', {
        url: '/list',
        views: {
          'main-list': {
            templateUrl: 'main/templates/list.html',
            controller: 'ListCtrl'
          }
        }
      })
      .state('main.listDetail', {
        url: '/list/:poopId',
        views: {
          'main-list': {
            templateUrl: 'main/templates/list-detail.html',
            controller: 'ListDetailCtrl',
            resolve: {
              poop: function ($stateParams, Tallyrally) {
                return Tallyrally.get({id: $stateParams.poopId}, function (res) {
                  return res;
                });
              }
              // poopId: function ($stateParams) {
              //   return $stateParams.poopId;
              // }
            }
          }
        }
      })
      .state('debug', {
        url: '/debug',
        templateUrl: 'main/templates/debug.html',
        controller: 'DebugCtrl'
      });
});
