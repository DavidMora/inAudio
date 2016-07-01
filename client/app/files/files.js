'use strict';

angular.module('integracionInsiteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('files', {
        url: '/files',
        templateUrl: 'app/files/files.html',
        controller: 'FilesController'
      });
  });
