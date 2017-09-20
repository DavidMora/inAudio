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
    $scope.delete = function (indice,evento) {
      Event.delete(evento._id).then(function (data) {
        $scope.events = $scope.events.filter(function (ev) {
          return (ev._id != evento._id)
        })

      })
    }

    $scope.stopAll = function () {
      File.stopAll().then(function () {

      })
      Event.stopAll().then(function () {

      })
    }
    $scope.uploadFile = function () {
      $ajax.post({
        url: '/api/songs',
        data: $scope.song,
        request_type: 'file',
        success: function (data) {
          $scope.event = {}
          angular.element('#file').modal('hide');
          $scope.files.push(data)
        }
      });
    }
    $scope.createEvent = function () {
      $.ajax({
        type:"POST",
        url: '/api/events',
        data: $scope.event,
        request_type: 'file',
        success: function (data) {
          $scope.events.push(data)
          $scope.event = {}
          angular.element('#myModal').modal('hide');
          File.getFiles().then(function (files) {
            $scope.files = files
          })

        },error:function(e){console.log("soy un error",e)}
      });
    }
  });
