dmlesMobileApp.controller('forwardController', function($scope, syncService) {

    var vm = this;
    vm.items = syncService.data.offlineMessages;
});

