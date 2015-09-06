'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', 'TabService', 'BookmarkService', function ($scope, $timeout, $log, tabService, bookmarkService) {
	$scope.urlSelected = "requesting...";
	$scope.tagSelected = "";
	$scope.modelTags = [];
	$scope.tagCollection = [];

	tabService.requestCurrentTabUrl(function (result) {
		$scope.urlSelected = result;
		$scope.$digest();
	});

	bookmarkService.requestUrlTagData(function (urls, tags, url2tagIndex, tag2urlIndex) {
		$scope.tagCollection = tags;
	});

	this.loadModel = function (urlName) {

	}

	$scope.inputKeyPress = function ($event) {
		if ($event.keyCode === 13) {
			//enter key was pressed
			if (!$scope.tagSelected) {
				return;
			}

			$scope.tagSelected = $scope.tagSelected.trim();

			if ($scope.modelTags.indexOf($scope.tagSelected) === -1) {
				//add new tag if it was not found
				$scope.modelTags.push($scope.tagSelected);
			}

			$scope.tagSelected = "";
		}
	}

	$scope.removeTag = function (tagName) {
		var index;

		if (!tagName) {
			return;
		}

		index = $scope.modelTags.indexOf(tagName);

		if (index === -1) {
			return;
		}

		$scope.modelTags.splice(index, 1);
	};
}]);
