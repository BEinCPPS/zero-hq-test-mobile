(function () {
    'use strict';

    angular
        .module('zerohqt.common')
        .factory('externalAppsService', externalAppsService);

    externalAppsService.$inject = ['$rootScope', '$window', 'ENV', '$ionicLoading'];

    /* @ngInject */
    function externalAppsService($rootScope, $window, ENV, $ionicLoading) {
        var sApp = null;
         $rootScope.apiEndpointHost = ENV.apiEndpointHost;
         $rootScope.apiEndpointHostMobile = ENV.apiEndpointHostMobile;
         $rootScope.apiEndPointPort = ENV.apiEndPointPort;
         $rootScope.apiEndPointPortMobile = ENV.apiEndPointPortMobile;

        var serverStorageJSON =  $window.localStorage.getItem("server");
        var serverStorage = null;
        if(typeof serverStorageJSON != 'undefined')
                serverStorage = JSON.parse(serverStorageJSON);
        if(typeof serverStorage !== 'undefined' && serverStorage != null
                && serverStorage.serverName && serverStorage.serverPort) {
            $rootScope.apiEndpointHost = serverStorage.serverName;
            $rootScope.apiEndpointHostMobile = serverStorage.serverName;
            $rootScope.apiEndPointPort = serverStorage.serverPort;
            $rootScope.apiEndPointPortMobile = serverStorage.serverPort;
        }

        if (typeof startApp !== 'undefined' && startApp !== null) {

        }
        var service = {
            openMapsApp: openMapsApp,
            openExternalUrl: openExternalUrl,
            getBackEndUrl: getBackEndUrl,
            getWebSocketUrl: getWebSocketUrl,
            setServerCoordinates:setServerCoordinates,
            openVnc: openVncApp
        };
        return service;

        // ******************************************************

        function setServerCoordinates(serverName, serverPort){
            $rootScope.apiEndpointHost = serverName;
            $rootScope.apiEndpointHostMobile = serverName;
            $rootScope.apiEndPointPort = serverPort;
            $rootScope.apiEndPointPortMobile = serverPort;
         }

        function openMapsApp(coords) {
            var q;
            if (ionic.Platform.isAndroid()) {
                q = 'geo:' + coords;
            } else {
                q = 'maps://maps.apple.com/?q=' + coords;
            }
            $window.location.href = q;
        }

        function openExternalUrl(url) {
            $window.open(url, '_system', 'location=yes');
            return false;
        }

        function getBackEndUrl() {
            if (ionic.Platform.isAndroid()) {
                console.log($rootScope.apiEndpointHostMobile);
                return ENV.apiEndPointDefaultProtocol + '://' + $rootScope.apiEndpointHostMobile + ':' + $rootScope.apiEndPointPortMobile + '/';
            } else {
                console.log($rootScope.apiEndpointHost);
                return ENV.apiEndPointDefaultProtocol + '://' + $rootScope.apiEndpointHost + ':' + $rootScope.apiEndPointPort + '/';
            }
        }

        function getWebSocketUrl() {
            if (ionic.Platform.isAndroid()) {
                return 'ws://' + $rootScope.apiEndpointHostMobile + ':' + $rootScope.apiEndPointPortMobile + '/websocket';
            } else {
                return 'ws://' + $rootScope.apiEndpointHost + ':' + $rootScope.apiEndPointPort + '/websocket';
            }
        }

        function openVncApp(ipAddress) {
            console.log('Opening vnc ipAddress: ' + ipAddress);
            if (ionic.Platform.isAndroid()) {
                if (cordova.plugins && cordova.plugins.clipboard && ipAddress) {
                    console.log('Im copying to clipboard');
                    cordova.plugins.clipboard.copy(ipAddress);
                }
                console.log('Im opening startApp');
                sApp = startApp.set({
                    /* params */
                    "action": "ACTION_RUN",
                    "category": "CATEGORY_ALTERNATIVE",
                    "package": "com.realvnc.viewer.android",
                    "intentstart": "startActivity"
                }, {
                    /* extras */
                    //"ipAddress": ipAddress
                });
                if (sApp !== null) {
                    sApp.check(function (values) { /* success */
                        console.log('Application vnc is present with: ' + values)
                        sApp.start(function () { /* success */
                            console.log('Application vnc viewer started with: ' + values)
                        }, function (error) { /* fail */
                            console.log('Application not started with error: ' + error);
                            $ionicLoading.show({
                                template: 'Application vnc impossible to start!',
                                noBackdrop: true,
                                duration: 1000
                            });
                        });
                    }, function (error) { /* fail */
                        console.log('Application presence error: ' + error);
                        $ionicLoading.show({
                            template: 'Application vnc not available currently!',
                            noBackdrop: true,
                            duration: 1000
                        });
                    });
                }
            } else {
                $window.location.href = 'vnc://' + ipAddress;
            }
        }
    }
})();
