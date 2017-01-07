'use strict';
angular.module('main')
.controller('StatsCtrl', function ($log, $scope, $http, $ionicLoading, Tallies, Store, API) {

  $scope.dat = {};

  $scope.showLoading = function () {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.showLoading();

  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };

  $scope.requestStats = function () {
    $scope.showLoading();
    Tallies.httpStats()
      .then(function (res) {
        $scope.stats = res.data;
        initDayHours();
        $scope.statSelected = $scope.stats.this_month;
        $log.info('stats ->', $scope.stats);
        $scope.dat.data = generateData($scope.stats.this_month.start_date); // afterDate
        $scope.hideLoading();
      })
      .catch(function (err) {
        $scope.hideLoading();
        $scope.noticeClass = 'type type-assertive';
        $scope.notice = err.status + ': ' + (err.message || 'Request failed');
      });
  };

  $scope.selectStats = function (statSet) {
    $scope.statSelected = statSet;
    // $scope.dat.data = generateData($scope.stats.this_month.start_date); // afterDate
  };

  $scope.requestStats();

  $scope.dat.options = {
    chart: {
      type: 'scatterChart',
      height: 300,
      refreshDataOnly: true,
      deepWatchData: true,
      // color: d3.scale.category10().range(),
      scatter: {
        onlyCircles: true //false
      },
      showLegend: false,
      // showXAxis: false,
      // showYAxis: false,
      forceY: [1,7],

      // color: ['#ef4e3a', '#444', '#8a6de9', '#43cee6'], // heart+diamond, spade+club, joker, pause
      margin: { 'left': 60, 'right': 60, 'top': 5, 'bottom': 40 },
      showDistX: true,
      showDistY: true,
      // tooltipContent: function (key) {
      //   return '<h3>' + key + '</h3>';
      // },
      duration: 350,
      noData: 'No data available - tap to refresh.',
      xAxis: {
        // axisLabel: 'Past month (rolling)',
        // axisLabel: 'X Axis',
        tickFormat: function (d) {
          // return d3.format('.02f')(d);
          return d3.time.format('%b %d')(new Date(d));
        }
      },
      yAxis: {
        axisLabel: 'Bristol',
        // axisLabel: 'Y Axis',
        tickFormat: function (d) {
          // return d3.format('.02f')(d);
          // return d3.format('.02f')(d);
          return d;
        },
        axisLabelDistance: -15
      }
    }
  };

  // $scope.dat.sparkOptions = {
  //   chart: {
  //     type: 'sparklinePlus',
  //     height: 20,

  //     margin: {
  //       'left': 0,
  //       'right': 0,
  //       'top': 0,
  //       'bottom': 0
  //     }
  //   }
  // };

  // var r = [];
  // var a1 = {x: 1, y: 4};
  // var a2 = {x: 2, y: 5};
  // var a3 = {x: 3, y: 6};
  // r.push(a1, a2, a3);

  // $scope.sparkData = r;


  // $scope.dat.sparkData = function () {
  //   var g = [];
  //   function dater (item) {

  //     var d = moment(item.time_of_passage).day().unix();
  //     $log.log('d -> ', d);
  //     return d;
  //   }
  //   var e = moment().subtract(1, 'week').unix();
  //   angular.forEach(Store.index, function (val, key) {
  //     var d = dater(val);

  //     if (d >= e) {
  //       this.push({
  //         x: d,
  //         y: 1
  //       });
  //     }
  //   }, g);

  //   // $log.log('d ->', d);
  //   $log.log('e ->', e);
  //   $log.log('g ->', g);

  // };
  // $scope.dat.sparkData();

  function generateData (startDate) {

    var data = [];

    data.push({
      key: 'Processed',
      color: '#669d45',
      values: []
    }, {
      key: 'Rejected',
      color: 'red',
      values: []
    }, {
      key: 'Not donated',
      color: '#f0b840',
      values: []
    });

    var tallies = [];

    $log.log('startDate ->', startDate);
    // var tallies = Store.index;
    var c = 0;
    angular.forEach(Store.index, function (val, key) {
      var d = moment(val.time_of_passage).unix();//parseInt(val.start_date);
      // $log.log('d ->', d);
      if (d >= moment().subtract(1, 'month').unix()) {
        this.push(val);
        key;
        $log.log(c++);
      }
    }, tallies);

    // var tallies = Store.index;

    for (var i = 0; i < tallies.length; i++) {
      // processed
      if (tallies[i]['processable']) {
        data[0].values.push({
          x: Date.parse(tallies[i]['time_of_passage']),
          y: tallies[i]['bristol_score'],
          size: tallies[i]['weight'],
          shape: 'circle'
        });
      // rejected
      } else if (tallies[i]['donated']) {
        data[1].values.push({
          x: Date.parse(tallies[i]['time_of_passage']),
          y: tallies[i]['bristol_score'],
          size: tallies[i]['weight'],
          shape: 'circle'
        });
      } else {
        data[2].values.push({
          x: Date.parse(tallies[i]['time_of_passage']),
          y: tallies[i]['bristol_score'],
          size: tallies[i]['weight'],
          shape: 'circle'
        });
      }
    }
    $log.log('data -> ', data);
    return data;
  }

  ///////////////////////////////
  ///////////////////////////////
  $scope.hours = [[1,2,3,4,5,6],[7,8,9,10,11,12],[13,14,15,16,17,18],[19,20,21,22,23,0]];

  var grads = [
    '#dae289',
    '#9cc069',
    '#669d45',
    '#637939'
  ];

  $scope.colorSixHours = function (hour) {
    var style = '';
    // if (hour % 6 === 0 && hour !== 0) {
    //   style += 'border-top: 2px solid white;';
    // }
    // var num;
    // hour++;
    // if (hour > 12) {
    //   var num = (hour - 12) * 3;
    // } else {
    //   var num = (12 - hour) * 3;
    // }
    // style += 'margin-top: ' + Math.abs(num) + 'px;';
    return style;
  };

  function getQuantiles (arr) {
    var a = {
      q0: ss.quantile(arr, 0),
      q1: ss.quantile(arr, 0.25),
      q2: ss.quantile(arr, 0.5),
      q3: ss.quantile(arr, 0.75),
      q4: ss.quantile(arr, 1),
      mean: ss.mean(arr)
    };
    // $log.log('a -> ', a);
    return a;
  }

  // function setColor (arr, item) {
  //   // $log.log(arr, item);

  //   var qs = getQuantiles(arr);

  //   // $log.log('item -> ', item);
  //   if (item === 0) {
  //      return 'lightgray';
  //   }
  //   else if (item >= qs['q3']) {
  //     return grads[3];
  //   } else if (item >= qs['q2']) {
  //     return grads[2];
  //   } else if (item >= qs['q1']) {
  //     return grads[1];
  //   } else {
  //     return grads[0];
  //   }
  // }
  $scope.setColor = function (arr, item) {
    // $log.log(arr, item);

    var qs = getQuantiles(arr);

    // $log.log('item -> ', item);
    if (typeof item === 'undefined') {
       return 'white';
    }
    // else if (item === qs['q0']) { // is min
    //   return grads[0];
    // } else if (item === qs['q4']) { // is max
    //   return grads[3];
    // } else if (item >= qs['q2'] + 1) { // is bigger than middle
    //   return grads[2];
    // } else {
    //   return grads[1]; // is not bigger than middle
    // }

    else if (item === qs['q0']) { // is min
      return grads[0];
    } else if (item === qs['q4']) { // is max
      return grads[3];
    } else if (item > Math.ceil(qs['mean'])) {
      return grads[2];
    } else {
      return grads[1];
    }

    // else if (item >= qs['q3']) {
    //   return grads[3];
    // } else if (item > qs['q2']) {
    //   return grads[2];
    // } else if (item > qs['q1']) {
    //   return grads[1];
    // } else {
    //   return grads[0];
    // }
  };

  // $http.get('http://tallyrally.herokuapp.com/unixify').then(function (res) {
  //   $log.log('got res -> ', res);
  //   $scope.dat.unixer = res.data;

  //   $scope.wdayColors = {};
  //   $scope.hourlyColors = {};

  //   $log.log('unixer]wd -> ', $scope.dat.unixer['weekdayly']);

  //   _.each($scope.dat.unixer['weekdayly'], function (val, key) {
  //     $log.log('eacher ->', key);
  //     $scope.wdayColors[key] = setColor(_.values($scope.dat.unixer['weekdayly']), val);
  //   });

  //   _.each($scope.dat.unixer['hourly'], function (val, key) {
  //     $scope.hourlyColors[key] = setColor(_.values($scope.dat.unixer['hourly']), val);
  //   });
  // });

  // $http.get('http://tallyrally.herokuapp.com/dayhour').then(function (res) {
  function initDayHours () {
    $http.get(API.production.dayhour).then(function (res) {
    // $http.get('http://localhost:3002/api/v1/donor_logs_dayhour').then(function (res) {
      // $log.log('got response from dayhour -> ', res);
      $scope.dat.dh = res.data;
      $scope.allVals = [];

      _.each($scope.dat.dh, function (val, key) {
        // key is hour 0 - 23
        // val is wday 0 -6
        _.each(val, function (val, key) {
          // key is wday 0 - 6
          // val is count 0 -> sum tally
          this.push(val);
        }, $scope.allVals);
      });
    });
  }
  // initDayHours();
  // $log.log('allVals -> ', $scope.allVals);

});
