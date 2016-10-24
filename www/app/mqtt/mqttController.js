dmlesMobileApp.controller('mqttController', function($scope, mqttService, databaseService, connectivityService) {
    var isOnline = true;
    var mqttConnected = false;
    $scope.topic = "mqtt/demo";
    $scope.message = "Hello DML-ES Mobile!";
    $scope.messages = "";
    $scope.host = "localhost";
    $scope.port = "61616";

    $scope.$watch('online',function(onlineValue){
        if(typeof onlineValue === 'undefined') {
            onlineValue = connectivityService.checkConnection();
        }

        if(onlineValue) {
            isOnline = true;
            toggleButtons(['#connect'], true);

            $scope.connect = function () {
                $scope.client = mqttService.client($scope.host, $scope.port);
                $scope.client.on("message", function (topic, payload) {
                    $scope.$apply(function () {
                        appendMessage("Subscriber received message: " + payload.toString());
                    });
                    console.log('getting messages: ' + payload);
                });

                $scope.client.on("connect", function (connack) {
                    var message = "Connected to Host: " + $scope.host + " Port: " + $scope.port + " Client ID: " + $scope.client.options.clientId;
                    $scope.$apply(function () {
                        appendMessage(message);
                    });

                    mqttConnected = true;

                    console.log(message);
                    toggleButtons(['#disconnect', '#subscribe'], true);
                    toggleButtons(['#connect'], false);
                });

                /**
                 * This works in Chrome browser
                 * @param event
                 */
                // $scope.client.stream.socket.onerror = function (event) {
                //     $scope.$apply(function () {
                //         $scope.messages = $scope.messages + "Failed to connect to Host: " + $scope.host + " Port: " + $scope.port + "\n";
                //
                //         mqttService.end($scope.client);
                //     });
                // }

                /**
                 * This works in Safari iOS
                 * @param event
                 */
                 $scope.client.stream.socket.onclose = function(event) {
                    $scope.$apply(function() {
                        $scope.messages = $scope.messages + "Failed to connect to Host: " + $scope.host + " Port: " + $scope.port + "\n";

                        mqttService.end($scope.client);
                    });
                 }
            }

            $scope.subscribe = function () {
                mqttService.subscribe($scope.client, $scope.topic);
                appendMessage("Subscribed to Topic: " + $scope.topic);
            }

            $scope.disconnect = function () {
                mqttService.end($scope.client);
                mqttConnected = false;

                appendMessage("Client disconnected from Host: " + $scope.host);
                toggleButtons(['#disconnect', '#subscribe'], false);
                toggleButtons(['#connect'], true);
            }

        } else { // offline
            toggleButtons(['#connect', '#disconnect', '#subscribe'], false);
            isOnline = false;
        }

    });


    $scope.publish = function() {
        if(isOnline) {
            if(mqttConnected) {
                mqttService.publish($scope.client, $scope.topic, $scope.message);
                appendMessage("Published message to Topic: " + $scope.message);
            } else {
                alert("MQTT Client not connected");
            }
        } else {
            var data = {"message": $scope.message};
            databaseService.add(data)
                .then(function (id){
                    var textMessage = "Row added with id: " + id;
                    $scope.$apply(function () {
                        appendMessage(textMessage);
                    });
                    console.log(textMessage);
                })
                .catch(function (err) {
                    var textMessage = "Failed to add item: " + err
                    console.error(textMessage);

                    throw err; // Re-throw the error
                });
        }
    }

    $scope.clearMessageArea = function() {
        $("#messages").val('');
        $scope.messages = '';
    }

    function checkConnection(isOnline) {
        if(typeof isOnline === 'undefined') {
            isOnline = connectivityService.checkConnection();
        }
        console.log("isOnline: " + isOnline);

        return isOnline;
    }

    function appendMessage(message) {
        $scope.messages = $scope.messages + message + "\n";
    }

    function toggleButtons(ids, on) {
        if(on) {
            for (var id in ids) {
                $(ids[id]).removeClass("disabled");
                $(ids[id]).prop('disabled', !on);
                //console.log("id: " + id + " on: " + on + " ids" + ids);
            }
        } else {
            for (var id in ids) {
                $(ids[id]).addClass("disabled");
                $(ids[id]).prop('disabled', !on);
                //console.log("id: " + id + " on: " + on + " ids" + ids);
            }
        }
    }
});