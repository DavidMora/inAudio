
'use strict';

angular.module('integracionInsiteApp')

  .factory('Event', function($http,$q){

    //Create a new object
    var eventFactory = {};

    /**
     * Get all events of the database
     * @returns {HttpPromise}
     */

    eventFactory.getAll = function(type){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/events')
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
     * Get one event of the database
     * @param idevent
     * @returns {HttpPromise}
     */
    eventFactory.get = function(id_event){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/events/' + id_event)
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
     * Create new event on the database
     * @param eventData
     * @returns {HttpPromise}
     */
    eventFactory.create = function(eventData){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.post('/api/events/', eventData)
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
     * Update a event on the database
     * @param idevent
     * @param eventData
     * @returns {HttpPromise}
     */
    eventFactory.update = function(idevent, eventData){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.put('/api/events/'+idevent,eventData)
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
     * Delete a event of the database
     * @param idevent
     * @returns {HttpPromise}
     */

    eventFactory.stopAll= function(){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.get('/api/events/stop-all')
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
    eventFactory.delete = function(id_event){

      var deferred = $q.defer(); // deferred contains the promise to be returned

      return $http.delete('/api/events/' + id_event)
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

    return eventFactory;

  });
