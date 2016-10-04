'use strict';

var dmlesMobileApp = angular.module('dmles-mobile-app', ['ngRoute', 'ui.bootstrap']);
dmlesMobileApp.config(function ($routeProvider) {
     $routeProvider
         .when('/', {
             templateUrl: 'app/mqtt/views/mqtt.html',
             controller: 'mqttController'
         }).
         when('/store', {
             templateUrl: 'app/store-forward/views/store.html'
         }).
         when('/forward', {
             templateUrl: 'app/store-forward/views/forward.html'
         })
         .otherwise({
             redirectTo: '/'
        });
 });