'use strict';

confRoomBooking

    .factory('confRoomFactory', function($http, $q){
        return {
            getLocations: function(){
                var deferred = $q.defer();

                $http.get('/roombooking/api/location')
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(reason){
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },

            getFacilities: function(){
                var deferred = $q.defer();

                $http.get('/roombooking/api/facility')
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(reason){
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },

            getPurposes: function(){
                var deferred = $q.defer();

                $http.get('/roombooking/api/purpose')
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(reason){
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },

            searchForRooms: function(formData){
                var deferred = $q.defer();

                $http.post('/roombooking/api/search', formData)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(reason){
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },

            searchOccupancy: function(formData) {
                var deferred = $q.defer();

                $http.get('data/showOccupancy.json')
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(reason){
                        deferred.reject(reason);
                    });
                /*
                $http.post('/roombooking/api/show-occupancy', formData)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(reason){
                        deferred.reject(reason);
                    });
                */
                return deferred.promise;
            },

            bookingRoom: function(roomJson) {
              var deferred = $q.defer();

              $http.post('/roombooking/api/book-room', roomJson)
                  .success(function(data){
                      deferred.resolve(data);
                  })
                  .error(function(reason){
                      deferred.reject(reason);
                  });

              return deferred.promise;
            }

        };
    });
