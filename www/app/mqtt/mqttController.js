dmlesMobileApp.controller('mqttController', function($scope, mqttService) {
    $scope.topic = "mqtt/demo";
    $scope.message = "Hello World!";
    $scope.messages = "";
    $scope.host = "localhost";
    $scope.port = "61616";

    $scope.connect = function() {
        $scope.client = mqttService.client($scope.host, $scope.port);
        $scope.client.on("message", function (topic, payload) {
            $scope.$apply(function() {
                $scope.messages = $scope.messages + "Subscriber received message: " + payload.toString() + "\n";
            });
            console.log('getting messages: ' + payload);
        });

        $scope.client.on("connect", function (connack) {
            var message = $scope.messages + "Connected to Host: " + $scope.host + " Port: " + $scope.port + "\n";
            $scope.$apply(function() {
                $scope.messages = message;
            });

            $scope.toggleConnectDisconnectButtons(true);
            console.log(message);
        });

        $scope.client.stream.socket.onerror = function(event) {
            $scope.$apply(function() {
                $scope.messages = $scope.messages + "Failed to connect to Host: " + $scope.host + " Port: " + $scope.port + "\n";

                mqttService.end($scope.client);
            });
        }

        /*
         $scope.client.stream.socket.onclose = function(event) {
         $scope.$apply(function() {
         $scope.messages = $scope.messages + "Failed to connect to Host: " + $scope.host + " Port: " + $scope.port + "\n";

         mqttService.end($scope.client);
         });
         }
         */
    }

    $scope.subscribe = function() {
        mqttService.subscribe($scope.client, $scope.topic);
        $scope.messages = $scope.messages + "Subscribed to Topic: " + $scope.topic + "\n";
    }

    $scope.publish = function() {
        mqttService.publish($scope.client, $scope.topic, $scope.message);
        $scope.messages = $scope.messages + "Published message to Topic: " + $scope.message + "\n";
    }

    $scope.disconnect = function() {
        mqttService.end($scope.client);
        $scope.messages = $scope.messages + "Client disconnected from Host: " + $scope.host + "\n";

        $scope.toggleConnectDisconnectButtons(false);
    }

    $scope.clearMessageArea = function() {
        $("#messages").val('');
        $scope.messages = '';
    }

    $scope.toggleConnectDisconnectButtons = function(connect) {
        if(connect) {
            $("#disconnect").removeClass("disabled");
            $("#connect").addClass("disabled");
            $("#subscribe").removeClass("disabled");
            $("#publish").removeClass("disabled");

            $("#disconnect").prop('disabled', false);
            $("#connect").prop('disabled', true);
            $("#subscribe").prop('disabled', false);
            $("#publish").prop('disabled', false);
        } else {
            $("#disconnect").addClass("disabled");
            $("#connect").removeClass("disabled");
            $("#subscribe").addClass("disabled");
            $("#publish").addClass("disabled");

            $("#disconnect").prop('disabled', true);
            $("#connect").prop('disabled', false);
            $("#subscribe").prop('disabled', true);
            $("#publish").prop('disabled', true);
        }
    }
});