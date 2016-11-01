dmlesMobileApp.service('syncService', function(databaseService, mqttService) {
    var self = this;

    this.data = {
        offlineMessages: []
    };

    this.add = function(params) {
        databaseService.add(params.message)
            .then(function (id){
                var textMessage = "Row added with id: " + id;
                params.$scope.$apply(function () {
                    params.appendMessage(textMessage);
                });
                console.log(textMessage);
            })
            .catch(function (err) {
                console.error("Failed to add item: " + err);

                throw err; // Re-throw the error
            });
    }

    this.pushLocalChanges = function() {
        var topic = mqttService.data.topic;
        var host = mqttService.data.host;
        var port = mqttService.data.port;

        databaseService.find()
            .then(function (items){
                //console.log("items.length: " + items.length);
                if(items.length > 0) {
                    return items;
                } else {
                    throw new Error("NoItems");
                }
            }).then(function (items) {
                // Connect to Host
                //console.log("Connecting to Host: " + host + " Port: " + port);
                var client = mqttService.client(host, port);

                return {client: client, items: items};

            }).then(function (data) {
                // Subscribe to Topic
                //console.log("Subscribing to Topic: " + topic);
                mqttService.subscribe(data.client, topic);

                return data;

            }).then(function (data) {
                // Publish messages to Topic
                //console.log("Publishing " + data.items.length + " messages to Topic: " + topic);

                //TODO:  needs to done in a transaction
                for (var i in data.items) {
                    mqttService.publish(data.client, topic, data.items[i]);
                }

                return data;

            }).then(function (data) {
                // Unsubscribe from Topic
                //console.log("Unsubscribing from Topic: " + topic);
                mqttService.unsubscribe(data.client, topic);

                return data;

            }).then(function (data) {
                // Remove items from local storage
                console.log("Removing messages from local storage");
                databaseService.delete();

                // temporarily save the offline items
                self.data.offlineMessages = data.items;

            }).catch(function handleReject(reason) {
                if(reason.message === "NoItems") {
                    console.log("The are no items in local storage");
                } else {
                    console.error(reason);
                }
            });
    }
});