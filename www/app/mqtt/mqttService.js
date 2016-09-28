dmlesMobileApp.service('mqttService', function() {
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