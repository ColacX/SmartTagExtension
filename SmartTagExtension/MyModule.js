'use strict';

//define module and dependencies to other modules
angular.module('MyModule', ['ui.bootstrap', 'ui.bootstrap.modal']);

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

angular.module('MyModule').controller('MyConfirmDialogController', function ($scope, $uibModalInstance) {
	$scope.yesButton = function () {
		$uibModalInstance.close(true);
	};

	$scope.noButton = function () {
		$uibModalInstance.close(false);
	};
});

angular.module('MyModule').controller('MyInputDialogController', function ($scope, $uibModalInstance) {
	$scope.submitButton = function () {
		$uibModalInstance.close($scope.inputData);
	};

	$scope.cancelButton = function () {
		$uibModalInstance.close();
	};
});