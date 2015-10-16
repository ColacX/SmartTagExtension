'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', 'TabService', 'BookmarkService', function ($scope, $timeout, $log, tabService, bookmarkService) {
	var self = this;

	$scope.model = {
		url: null,
		title: null,
		tags: null
	};

	$scope.model.url = "requesting...";
	$scope.model.title = "requesting...";
	$scope.model.tags = [];

	$scope.tagInput = "";
	
	$scope.modelCollection = [];
	$scope.searchResult = [];

	$scope.urlIndex = {};
	$scope.tagIndex = {};
	$scope.tagList = [];

	tabService.requestCurrentTabData(function (result) {
		$scope.model.url = result.url;
		$scope.model.title = result.title;
		$scope.$digest();
	});

	bookmarkService.requestData(function (urlIndex, tagIndex) {
		$scope.urlIndex = urlIndex;
		$scope.tagIndex = tagIndex;

		//TODO merge data
		for (var property in tagIndex) {
			$scope.tagList.push(property);
		}
	});

	$scope.inputKeyPress = function ($event) {
		if ($event.keyCode === 13 || $event.keyCode === 32) {
			//space or enter key was pressed

			if (!$scope.tagInput) {
				return;
			}

			$scope.tagInput = $scope.tagInput.trim();

			if ($scope.model.tags.indexOf($scope.tagInput) === -1) {
				//add new tag if it was not found
				$scope.model.tags.push($scope.tagInput);

				$timeout(function () {
					$scope.searchModel();
				}, 0);
			}

			$scope.tagInput = "";
		}
	}

	$scope.removeTag = function (tagName) {
		var index;

		if (!tagName) {
			return;
		}

		index = $scope.model.tags.indexOf(tagName);

		if (index === -1) {
			return;
		}

		$scope.model.tags.splice(index, 1);
	};

	$scope.searchModel = function () {
		console.log("search model");

		$scope.searchResult = [];

		//simple linear search O(n)
		for (var i = 0; i < $scope.modelCollection.length; i++) {
			var modelItem = $scope.modelCollection[i];
			
			$scope.searchResult.push(modelItem);
		}

		$scope.$digest();
	};

	$scope.loadModel = function () {
		console.log("load model");
	};

	$scope.saveModel = function () {
		console.log("save model");
	};

	$scope.deleteModel = function () {
		console.log("delete model");
	};

	$scope.test = function (item) {
		console.log("test");
		console.log(item);
	};
}]);
