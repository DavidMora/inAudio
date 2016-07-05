'use strict';

angular.module('integracionInsiteApp')
  .controller('FilesController', function ($scope, $http, socket,$ajax,File) {
    $scope.song = {}
    File.getFiles().then(function (files) {
      $scope.files = files
    })
    $scope.play = function (name) {
      File.play(name).then(function (msg) {
        console.log(msg)
      })
    }
    $scope.stop = function (name) {
      File.stop(name).then(function (msg) {
        console.log(msg)
      })
    }
    $scope.uploadFile = function () {
      $ajax.post({
        url: '/api/songs',
        data: $scope.song,
        request_type: 'file',
        succes: function (data) {
          $scope.event = {}
          angular.element('#myModal').modal('hide');

        }
      });
    }
  });
