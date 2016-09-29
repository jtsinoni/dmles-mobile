'use strict';

var dmlesMobileApp = angular.module('dmles-mobile-app', ['ngRoute', 'ui.bootstrap']);
dmlesMobileApp.config(function ($routeProvider) {
     $routeProvider
         .when('/', {
             templateUrl: 'app/mqtt/views/mqtt.html',
             controller: 'mqttController'
         })
         .otherwise({
             redirectTo: '/'
         });
 });