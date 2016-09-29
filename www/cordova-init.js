'use strict';

var CordovaInit = function() {

    var onDeviceReady = function() {
        receivedEvent('deviceready');
    };

    var receivedEvent = function() {
        console.log('Start event received, bootstrapping application setup.');
        angular.bootstrap($('body'), ['dmles-mobile-app']);

        //var dmlesMobileAppModule = angular.module('dmles-mobile-app');
        //var dmlesMobileAppController = dmlesMobileAppModule.controller('mqttController').scope();

        //var messages = angular.element('#messages');
        //alert(messages);
        //messages.val('Start event received, bootstrapping application setup.');
        //var messages = dmlesMobileAppController.messages;
        //alert(dmlesMobileAppController)
        //messages = 'Start event received, bootstrapping application setup.';

    };

    this.bindEvents = function() {
        document.addEventListener('deviceready', onDeviceReady, false);
    };

    //If cordova is present, wait for it to initialize, otherwise just try to
    //bootstrap the application.
    if (window.cordova !== undefined) {
        console.log('Cordova found, wating for device.');
        this.bindEvents();
    } else {
        console.log('Cordova not found, booting application');
        receivedEvent('manual');
    }
};

$(function() {
    console.log('Bootstrapping!');
    new CordovaInit();
});