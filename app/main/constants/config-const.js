'use strict';
angular.module('main')
  .constant('API', {
    'production': {
      'donor_logs_resource': 'http://www.spoop.info/api/v1/donor_logs/:id',
      'heatmap': 'http://www.spoop.info/api/v1/donor_logs_heatmap?access_token=',
      'dayhour': 'http://www.spoop.info/api/v1/donor_logs_dayhour',
      'statistics': 'http://www.spoop.info/api/v1/donor_logs_statistics'
    },
    'development': {
      'donor_logs_resource': 'http://www.spoop.info/api/v1/donor_logs/:id',
      'heatmap': 'http://localhost:3002/api/v1/donor_logs_heatmap?access_token=',
      'dayhour': 'http://localhost:3002/api/v1/donor_logs_dayhour?access_token=',
      'statistics': 'http://localhost:3002/api/v1/donor_logs_statistics?access_token='
    }
  })
  .constant('APP_CONSTANTS', {
    'regex': {
      'hashtagCapture': /(^|\W)(#[a-z\d][\w-]*)/ig,
      'hashtagHighlight': /#[a-z0-9]+/gi
    },
    'notesPlaceholder': 'Use #hashtags to track #food, #activities, and #places you\'ve been!',
  });
