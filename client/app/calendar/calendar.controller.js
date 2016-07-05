'use strict';

angular.module('integracionInsiteApp')
  .controller('CalendarController', function ($scope, $http, socket,$ajax,File,Event) {
    $scope.event = {}
    File.getFiles().then(function (files) {
      $scope.files = files
    })
    Event.getAll().then(function (eventos) {
      $scope.events = eventos
    })
    $scope.createEvent = function () {
      $ajax.post({
        url: '/api/events',
        data: $scope.event,
        request_type: 'file',
        succes: function (data) {
          $scope.events.push(data)
          $scope.event = {}
          angular.element('#fileModal').modal('hide');
          File.getFiles().then(function (files) {
            $scope.files = files
          })

        }
      });
    }
  });
