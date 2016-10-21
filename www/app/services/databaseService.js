//TODO:
// Need to create an abstract database factory, for now using using Dexie as the default wrapper

dmlesMobileApp.service('databaseService', function(dexie) {
    var databaseName = "dmles-mobile-dt";
    var db = new Dexie(databaseName);

    function init() {
        // create the collection with schema
        db.version(1).stores({
            messages: '++id, message'
        });

        // Open it
        db.open().catch(function (e) {
            //alert ("Open failed: " + e);
            console.error("Open failed: " + e.stack);
        });
    }
    init();

    /**
     * Data is a json string
     * i.e. {message: "A message"}
     * @param data
     * @returns a promise
     */
    this.add = function(data) {
        return db.messages.add(data);
    }

    this.update = function(data) {

    }

    /**
     * If parameter data contains values delete individual records, else delete all records
     * @param data
     * @returns a Promise
     */
    this.delete = function(data) {
        if(data) { //delete individual records
            return db.messages.delete(data);
        } else { // delete all data
            return db.messages.clear();
        }
    }

    /**
     * For now get everything
     * @returns a Promise
     */
    this.find = function(data) {
        return db.messages.toArray();
    }

    this.transaction = function(data) {

    }
});
