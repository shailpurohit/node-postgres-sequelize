'use strict';

confRoomBooking

    .factory('confRoomFactory', function($http, $q){
        return {
            getLocations: function(){
                var deferred = $q.defer();

                $http.get('data/locations.json')
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

                $http.get('data/facilities.json')
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

                $http.get('data/purposes.json')
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

                $http.post('api/searchRoom', formData)
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
