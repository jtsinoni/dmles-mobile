'use strict';

var dmlesMobileApp = angular.module('dmles-mobile-app', ['ngRoute', 'ui.bootstrap']);
dmlesMobileApp.constant('dexie', 'window.Dexie');

/**
 * online and offline callbacks are triggered
 * from cordova's cordova-plugin-network-information plugin
 */
dmlesMobileApp.run(function($rootScope){
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);

    function onOnline() {
        $rootScope.$apply(function(){
            console.log("just got online event");
            $rootScope.online = true;
        });
    }

    function onOffline() {
        $rootScope.$apply(function(){
            console.log("just got offline event");
            $rootScope.online = false;
        });
    }
});
//document.addEventListener("offline", onOffline, false);

dmlesMobileApp.config(function ($routeProvider) {
     $routeProvider
         .when('/', {
             templateUrl: 'app/mqtt/views/mqtt.html',
             controller: 'mqttController'
         }).
         when('/store', {
             templateUrl: 'app/store-forward/views/store.html',
             //controllerAs: 'vm',
             controller: 'storeController'
         }).
         when('/forward', {
             templateUrl: 'app/store-forward/views/forward.html'
         })
         .otherwise({
             redirectTo: '/'
        });
 });