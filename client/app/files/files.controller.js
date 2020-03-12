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
    $scope.deleteFile = function ($index,name) {
      File.deleteFile(name).then(function () {
        $scope.files.splice($index,1);
      })

    }
    $scope.uploadFile = function () {
      $ajax.post({
        url: '/api/songs',
        data: $scope.song,
        cache : false,
        dataType    : 'json',
        request_type: 'file',
        success: function (data) {
          $scope.event = {}
          $scope.files.push(data)
          angular.element('#myModal').modal('hide');

        }
      });
    }
  });
