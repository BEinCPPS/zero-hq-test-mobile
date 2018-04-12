(function() {
	'use strict';
	angular
		.module('zerohqt.config', [
			'ionic',
			'ngCordova'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.config', {
					url: '/config',
					views: {
						'menuContent': {
							templateUrl: 'scripts/config/config.html',
							controller: 'ConfigController'
						}
					}
				})
		});
})();
