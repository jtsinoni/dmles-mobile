dmlesMobileApp.controller('storeController', function($scope, databaseService, connectivityService) {

    $scope.items = [];

    init();
    function init() {
        databaseService.find()
            .then(function (messages){

                $scope.$apply(function() {
                    $scope.items = messages;
                });

            }).catch(console.log.bind(console));

        //connectivityService.checkConnection();
    }

    $scope.delete = function(index, data) {
        // remove from scope
        $scope.items.splice(index, 1);

        // now remove from db
        databaseService.delete(data.id);
    }

    $scope.deleteAll = function() {
        // remove all rows from scope
        $scope.items = [];

        // now remove from db
        databaseService.delete();
    }
});

