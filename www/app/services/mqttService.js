dmlesMobileApp.service('mqttService', function() {

    this.data = {
        topic:'dmles-mobile',
        message: 'Hello DML-ES Mobile!',
        messages: '',
        client: null,
        host: 'localhost',
        port: '61616'
    };

    this.client = function(host, port) {
        return mqtt.connect({ host: host, port: port });
    }

    this.subscribe = function(client, topic) {
        client.subscribe(topic, {qos: 1}, function(err, granted) {
            if(err) {
                console.error(err);
            } else {
                console.log('called subscribe service');
            }
        });

    }

    this.unsubscribe = function(client, topic) {
        client.unsubscribe(topic, function(err) {
            if(err) {
                console.error(err);
            } else {
                console.log('called unsubscribe service');
            }
        });

    }

    this.publish = function(client, topic, message) {
        client.publish(topic, message, {qos: 1}, function(err) {
            if(err) {
                console.error(err);
            } else {
                console.log('called publish service');
            }
        });
    }

    this.disconnect = function(client) {
        client.end(true, function() {
            client.options.clientId = undefined;
            console.log('client disconnected');
        });
    }

    this.connected = function(client) {
        return client.connected;
    }
});