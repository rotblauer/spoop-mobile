'use strict';
angular.module('main')
  .factory('Tallies', function ($log, $http, Store, keychain, API) {

    var stored = [];
    var stats;

    function gotStats (res) {
      stats = res.data;
    }
    function errCallback (err) {
      stats = err;
    }
    function queryStats () {
      // return $http.get('http://tallyrally.herokuapp.com/v1/statistics').then(gotStats, errCallback);
      // return keychain.get.then(function (data) {
      //   var apikey = data;
        return $http.get(API.production.statistics).then(gotStats, errCallback);
      // });
    }
    function getStatistics () {
      if (typeof stats === 'undefined') {
        return queryStats().then(function () {
          return stats;
        });
      } else {
        return stats;
      }
    }
    // queryStats();

    function httpStats () {
      // return $http.get('http://tallyrally.herokuapp.com/v1/statistics');
      // return keychain.get.then(function (data) {
      //   var apikey = data;
        return $http.get(API.production.statistics);
      // });
    }

    function generateData (startDate) {

      var data = [{
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
      }];

      var tallies = [];

      $log.log('startDate ->', startDate);
      // var tallies = Store.index;
      var c = 0;
      angular.forEach(Store.index, function (val, key) {
        var d = moment(val.time_of_passage).unix();//parseInt(val.start_date);
        // $log.log('d ->', d);
        $log.log(key);
        if (d >= startDate) {
          this.push(val);
          $log.log(c++);
        }
      }, tallies);

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

    return {
      store: function (data) {
        $log.log('Tallies storing data -> ', data);
        stored = data;
      },
      get: function () {
        $log.log('Tallies getting data -> ', stored);
        return stored;
      },
      generateData: generateData,
      queryStats: queryStats,
      getStatistics: getStatistics,
      httpStats: httpStats
    };

  });
