(function () {
    'use strict';

    angular
        .module('zerohqt.config')
        .controller('ConfigController', ConfigController);

    ConfigController.$inject = ['$scope', '$ionicLoading', '$rootScope', 'externalAppsService'];


    /* @ngInject */
    function ConfigController($scope, $ionicLoading, $rootScope, externalAppsService) {
        $scope.server = {
            serverName : $rootScope.apiEndpointHost,
            serverPort : $rootScope.apiEndPointPort
        };

        $scope.save = function () {
        if($scope.server.serverName && $scope.server.serverPort){
               if(isNaN($scope.server.serverPort)){
                    $scope.server.serverPort='';
                    return;
                 }
                window.localStorage.setItem("server", JSON.stringify($scope.server));
                externalAppsService.setServerCoordinates($scope.server.serverName.trim(), $scope.server.serverPort.trim());
                if($rootScope.isWsConnected){
                    $rootScope.$emit('config-logout');
                } else
                  $rootScope.$emit('config-login');

           }
        };
    } //end Controller
})();
