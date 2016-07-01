'use strict';

angular.module('integracionInsiteApp')
  .controller('CalendarController', function ($scope, $http, socket,$ajax) {
    $scope.event = {}
    $scope.createEvent = function () {
      $ajax.post({
        url: '/api/events',
        data: $scope.event,
        request_type: 'file',
        succes: function (data) {
          $scope.event = {}
          angular.element('#fileModal').modal('hide');

        }
      });
    }
  });
