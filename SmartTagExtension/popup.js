'use strict';
(function () {
	//define module and dependencies to other modules
	angular.module('MyModule', ['pascalprecht.translate']);

	//configure module translations
	angular.module('MyModule').config(function ($translateProvider) {

		$translateProvider.translations('en', {
			HEADLINE: 'Hello there, This is my awesome app!',
			INTRO_TEXT: 'And it has i18n support!'
		});

		$translateProvider.translations('de', {
			HEADLINE: 'Hey, das ist meine großartige App!',
			INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!'
		});

		$translateProvider.translations('sv', {
			HEADLINE: 'Hejsan detta är min awesome app!',
			INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!'
		});

		//$translateProvider.preferredLanguage('de');
		//$translateProvider.preferredLanguage('en');
		$translateProvider.preferredLanguage('sv');
	});

	//define services
	angular.module('MyModule').service('TabService', ['$log', function ($log) {

		//fetches the url of the current window and active tab
		this.requestCurrentTabUrl = function (callback) {

			if (!chrome.tabs) {
				$log.error("chrome.tabs api is not available in local mode");
				return;
			}

			chrome.tabs.query({	active: true, currentWindow: true }, function (result) {
				var tab = result[0];
				var url = tab.url;
				callback(url);
			});

		};
	}]);

	angular.module('MyModule').service('BookmarkService', ['$log', function ($log) {

		//fetches the url of the current window and active tab
		this.requestCurrentTabUrl = function (callback) {

			if (!chrome.tabs) {
				$log.error("chrome.tabs api is not available in local mode");
				return;
			}

			chrome.tabs.query({ active: true, currentWindow: true }, function (result) {
				var tab = result[0];
				var url = tab.url;
				callback(url);
			});

		};
	}]);

	//define controllers
	angular.module('MyModule').controller('MyController', ['$scope', 'TabService', function ($scope, tabService) {
		$scope.activeUrl = "requesting....";
		$scope.today = new Date();
		$scope.pageNumber = 0;
		$scope.pageSize = 0;
		$scope.itemCount = 0;

		tabService.requestCurrentTabUrl(function (result) {
			$scope.activeUrl = result;
			$scope.$digest();
		});
	}]);


})();
