'use strict';
(function () {
	//define controllers
	angular.module('MyModule').controller('MyController', ['$scope', 'TabService', 'BookmarkService', function ($scope, tabService, bookmarkService) {
		$scope.activeUrl = "requesting...";
		$scope.today = new Date();
		$scope.pageNumber = 0;
		$scope.pageSize = 0;
		$scope.itemCount = 0;

		tabService.requestCurrentTabUrl(function (result) {
			$scope.activeUrl = result;
			$scope.$digest();
		});

		$scope.test0 = function () {
			bookmarkService.test();
		}

		$scope.test1 = function () {
		}

		$scope.test2 = function () {
		}
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
})();
