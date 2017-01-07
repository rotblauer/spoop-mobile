'use strict';
angular.module('main')
.controller('ListCtrl', function ($log, $scope, $timeout, $sce, $state, $q, $http, chmFactory, Tallyrally, Tallies, Store, API, APP_CONSTANTS, apikey) {

  var heatmapAPI = API.production.heatmap + apikey;

  $scope.data = {};
  $scope.data.poops = Store.index;
  $scope.data.heat = {};

  $scope.highlightHashtags = function (notesString) {
    var repl = notesString.replace(APP_CONSTANTS.regex.hashtagCapture, '$1<span class="type type-positive">$2</span>');
    return repl;
  };

  $scope.data.heaterOptions = {
    domain: 'month', // 'month'
    range: 2, // 2,
    subDomain: 'x_day', // x_day
    dataType: 'json',
    // data: Tallyrally.query(function (res) {return res;}), //heatmapAPI,
    // data: heatmapAPI,
    data: heatmapAPI,
    // afterLoadData: function (d) { return d; },
    afterLoadData: function (data) { $log.log(data); return data; },
    // afterLoadData: function (ddata) {
    //   var ob = {};
    //   $log.log('ddata ->', ddata);
    //   for (var i = 0; i < ddata.length; i++) {
    //     var poo = ddata[i];
    //     if (poo.processed) {
    //       var date = new Date(poo.passage_at);
    //       ob[date] = 1;
    //       $log.log(date);
    //     }
    //   }
    //   return ob;
    // },
    // data: heatData,//heatmapAPI,
    legend: [1, 2, 3],
    start: new Date(moment().subtract(1, 'months')),
    highlight: moment(),
    cellSize: 35,
    displayLegend: false,
    verticalOrientation: true,
    // colLimit: 10,
    label: {
      position: 'top',
      align: 'center',
      rotate: null,
      height: 35
    },
    onClick: function (date, nb) {
      $log.log(date, nb);
      $scope.data.clicked = {
        date: date,
        val: nb
      };
      $log.log($scope.data.clicked);
      $scope.$apply();
      $timeout(function () {
        $scope.data.clicked = null;
      }, 2000);
    }
  };

  $scope.prev = function () {
    chmFactory.previous();

  };
  $scope.nex = function () {
    chmFactory.next();

  };

  $scope.doRefresh = function () {
    chmFactory.update(heatmapAPI, false);
    $scope.data.poops = Store.getIndex();
    $scope.$broadcast('scroll.refreshComplete');
  };

  // $scope.number = 5;
  $scope.getNumber = function (num) {
    return new Array(num);
  };

  $scope.weightWatch = function (string) {
    return Math.round(parseInt(string) / 10);
  };

  $scope.processStatus = function (poop) {
    if (poop.processable) {
      return '$40';//'●';
    } else if (poop.donated && !poop.processable) {
      return 'REJ';
    } else if (!poop.donated) {
      return 'ND';
    }
  };

});

