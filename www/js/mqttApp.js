function appendMessages(scope, message) {

}

function toggleConnectDisconnectButtons(connect) {
    if(connect) {
        $("#disconnect").removeClass("disabled");
        $("#connect").addClass("disabled");
        $("#subscribe").removeClass("disabled");
        $("#publish").removeClass("disabled");
    } else {
        $("#disconnect").addClass("disabled");
        $("#connect").removeClass("disabled");
        $("#subscribe").addClass("disabled");
        $("#publish").addClass("disabled");
    }
}

var mqttApp = angular.module("mqttApp", []);
mqttApp.controller('mqttController', function($scope, mqttService) {
    $scope.topic = "mqtt/demo";
    $scope.message = "Hello World!";
    $scope.messages = "";
    $scope.host = "localhost";
    $scope.port = "61616";

    $scope.connect = function() {
        $scope.client = mqttService.client($scope.host, $scope.port);
        //$scope.messages = $scope.messages + "Connected to Host: " + $scope.host + " Port: " + $scope.port + "\n";
        $scope.client.on("message", function (topic, payload) {
            $scope.$apply(function() {
                $scope.messages = $scope.messages + "Subscriber received message: " + payload.toString() + "\n";
            });
            console.log('getting messages: ' + payload);
        });

        $scope.client.on("error", function (error) {
            $scope.$apply(function() {
                $scope.messages = $scope.messages + error + "\n";
            });
        });

        $scope.client.on("connect", function (connack) {
            $scope.$apply(function() {
                $scope.messages = $scope.messages + "Connected to Host: " + $scope.host + " Port: " + $scope.port + "\n";
            });

            toggleConnectDisconnectButtons(true);
        });
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

        toggleConnectDisconnectButtons(false);
    }
});
mqttApp.service('mqttService', function() {
    this.client = function(host, port) {
        return mqtt.connect({ host: host, port: port });
    }

    this.subscribe = function(client, topic) {
        client.subscribe(topic);
        console.log('called subscribe service');
    }

    this.publish = function(client, topic, message) {
        client.publish(topic, message);
        console.log('called publish service');
    }

    this.end = function(client) {
        client.end();
        console.log('client disconnected from topic');
    }
});