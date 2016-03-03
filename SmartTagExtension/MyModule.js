'use strict';

//define module and dependencies to other modules
angular.module('MyModule', ['pascalprecht.translate', 'ngAnimate', 'ui.bootstrap']);

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

//define directives
angular.module('MyModule').directive('myAutoFocus', ['$document', '$timeout', function ($document, $timeout) {
	return {
		link: function (scope, element, attributes, controller) {
			angular.element($document).ready(function () {
				$timeout(function () {
					element[0].focus();
				}, 500);
			});
		}
	};
}]);
