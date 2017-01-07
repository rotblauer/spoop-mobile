'use strict';

angular.module('main')
  .factory('keychain', function ($log, $localForage) {

    // var get = 'not-real';

    var get = $localForage.getItem('spoopApiKey');

    // var get = $localForage.getItem('spoopApiKey').then(function (data) {
    //   return data;
    // });
    //
    // var get = function () {
    //   return 'stupendous-golden-pinstriped-space-heater';
    // };

    var set = function (value) {
      $log.log('keychain setting key ->', value);
      return $localForage.setItem('spoopApiKey', value);
    };

    return {
      get: get,
      set: set
    };

  });
