'use strict';

var confRoomBooking = angular.module('confRoomBooking', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider){

        $routeProvider
          .when('/', {
              templateUrl: 'views/main.tpl.html',
              controller: 'confRoomCtrl'
          })
          .otherwise({
              redirectTo: '/'
          });

    }]);
