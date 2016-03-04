'use strict';

//define module and dependencies to other modules
angular.module('MyModule', ['ui.bootstrap']);

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
