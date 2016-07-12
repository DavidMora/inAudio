
'use strict';

angular.module('integracionInsiteApp')

  .factory('File', function($http,$q,$ajax){

    //Create a new object
    var fileFactory = {};

    /**
     * Get all files of the database
     * @returns {HttpPromise}
     */

    fileFactory.getAll = function(type){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/files')
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    fileFactory.play = function(name){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/songs/play/'+name)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    fileFactory.stopAll= function(){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/songs/stop-all')
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    fileFactory.stop = function(name){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/songs/stop/'+name)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };


    fileFactory.getFiles = function(){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/songs/files')
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };


    /**
     * Get one file of the database
     * @param idfile
     * @returns {HttpPromise}
     */
    fileFactory.get = function(id_file){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/files/' + id_file)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    /**
     * Create new file on the database
     * @param fileData
     * @returns {HttpPromise}
     */
    fileFactory.create = function(fileData){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.post('/api/files/', fileData)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    /**
     * Update a file on the database
     * @param idfile
     * @param fileData
     * @returns {HttpPromise}
     */
    fileFactory.update = function(idfile, fileData){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.put('/api/files/'+idfile,fileData)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    /**
     * Delete a file of the database
     * @param idfile
     * @returns {HttpPromise}
     */
    fileFactory.delete = function(id_file){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.delete('/api/files/' + id_file)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };
    fileFactory.deleteFile = function(id_file){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.delete('/api/songs/files/' + id_file)
        .then(function(response){
          // when promise is fulfilled
          deferred.resolve(response.data);
          // promise is returned
          return deferred.promise;
        },function(err){
          // when promise is rejected
          deferred.reject(err);
          // promise is returned
          return deferred.promise;
        });
    };

    return fileFactory;

  });
