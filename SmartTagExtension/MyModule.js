'use strict';

//define module and dependencies to other modules
angular.module('MyModule', ['pascalprecht.translate']);

//define translations
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
			throw "chrome.tabs api is only available when running as a browser extension";
			return callback("request error");
		}

		chrome.tabs.query({ active: true, currentWindow: true }, function (result) {
			var tab = result[0];
			var url = tab.url;
			callback(url);
		});

	};
}]);

//define directives
angular.module('MyModule').directive('myAutoFocus', ['$document', function ($document) {
	return {
		link: function (scope, element, attributes, controller) {
			angular.element($document).ready(function () {
				element[0].focus();
			});
		}
	};
}]);
