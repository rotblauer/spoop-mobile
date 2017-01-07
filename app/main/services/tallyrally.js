'use strict';
angular.module('main')
.factory('Tallyrally', function ($log, $timeout, $resource, API) {

  return $resource(API.production.donor_logs_resource,
    {id: '@id'}, { update: { method: 'PUT' } });

})
.factory('Store', function ($log, Tallyrally) {

  var index;

  function getIndex () {
    return index = Tallyrally.query();
  }
  getIndex();

  return {
    index: index,
    getIndex: getIndex
  };
})
;
