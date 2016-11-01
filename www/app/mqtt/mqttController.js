dmlesMobileApp.controller('mqttController', function($scope, mqttService, databaseService, syncService, connectivityService) {
    var vm = this;
    vm.data = mqttService.data;

    $scope.$watchGroup(['online', 'vm.data.client.options.clientId'], function(newValues, oldValues, scope) {
        // Offline
        if(newValues[0] == false) {
            toggleButtons(['#connect', '#disconnect', '#subscribe'], false);

            // Store data offline
            vm.publish = function() {
                var message = {"message": vm.data.message};
                var params = {$scope: $scope, message: message, appendMessage: appendMessage};
                syncService.add(params);
            }
        } else {  // Online
            // Offload local changes
            syncService.pushLocalChanges();

            // Is client connected
            if(newValues[1] != undefined ) {
                toggleButtons(['#connect'], true);
                toggleButtons(['#disconnect'], false);

                vm.publish = function() {
                    mqttService.publish(vm.data.client, vm.data.topic, vm.data.message);
                    appendMessage("Published message to topic: " + vm.data.topic + ", message:" + vm.data.message);
                }

            } else {
                toggleButtons(['#connect'], true);
                toggleButtons(['#disconnect', '#subscribe', '#unsubscribe'], false);

                vm.publish = function() {
                    alert("Client not connected");
                }
            }
        }

        // console.log('New Values: ' + newValues[0], newValues[1]);
        // console.log('Old Values: ' + oldValues[0], oldValues[1]);
    });

    vm.connect = function () {
        vm.data.client = mqttService.client(vm.data.host, vm.data.port);
        vm.data.client.on("message", function (topic, payload) {
            var textMessage = "Subscriber received message: " + payload.toString();
            $scope.$apply(function () {
                appendMessage(textMessage);
            });
            console.log(textMessage);
        });

        vm.data.client.on("connect", function (connack) {
            var message = "Connected to Host: " + vm.data.host + " Port: " + vm.data.port + " Client ID: " + vm.data.client.options.clientId;
            $scope.$apply(function () {
                appendMessage(message);
            });

            console.log(message);
            toggleButtons(['#disconnect', '#subscribe'], true);
            toggleButtons(['#connect'], false);
        });

        /**
         * This works in Chrome browser
         * @param event
         */
        vm.data.client.stream.socket.onerror = function (event) {
            var textMesage = "Received onerror event, type: " + event.type + ",  reason: " + event.reason;
            $scope.$apply(function () {
                appendMessage(textMesage);
            });
            console.log(textMesage);
        }

        /**
         * This works in Safari iOS
         * @param event
         */
        vm.data.client.stream.socket.onclose = function (event) {
            var textMesage = "Received onclose event, type: " + event.type + ", reason: " + event.reason;
            $scope.$apply(function () {
                appendMessage(textMesage);
            });
            console.log(textMesage);
        }
    }

    vm.subscribe = function () {
        mqttService.subscribe(vm.data.client, vm.data.topic);
        toggleButtons(['#unsubscribe'], true);
        appendMessage("Subscribed to Topic: " + vm.data.topic);
    }

    vm.unsubscribe = function () {
        mqttService.unsubscribe(vm.data.client, vm.data.topic);
        toggleButtons(['#unsubscribe'], false);
        appendMessage("Unsubscribed from Topic: " + vm.data.topic);
    }

    vm.disconnect = function () {
        mqttService.disconnect(vm.data.client);

        appendMessage("Client disconnected from Host: " + vm.data.host);
    }

    vm.clearMessageArea = function() {
        $("#messages").val('');
        vm.data.messages = '';
    }

    function checkConnection(isOnline) {
        if(typeof isOnline === 'undefined') {
            isOnline = connectivityService.checkConnection();
        }
        console.log("isOnline: " + isOnline);

        return isOnline;
    }

    function appendMessage(message) {
        vm.data.messages = vm.data.messages + message + "\n";
    }

    function toggleButtons(ids, on) {
        if(on) {
            for (var id in ids) {
                $(ids[id]).removeClass("disabled");
                $(ids[id]).prop('disabled', !on);
            }
        } else {
            for (var id in ids) {
                $(ids[id]).addClass("disabled");
                $(ids[id]).prop('disabled', !on);
            }
        }
    }
});