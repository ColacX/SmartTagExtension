'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', 'TabService', 'BookmarkService', function ($scope, $timeout, $log, tabService, bookmarkService) {
	var self = this;

	$scope.model = {
		url: "requesting...",
		title: "requesting...",
		tags: []
	};

	$scope.tagInput = "";
	$scope.urlSet = {};
	$scope.tagSet = {};
	$scope.urlTagMap = {};
	$scope.tagUrlMap = {};
	$scope.tagList = [];
	$scope.searchResult = [];

	tabService.requestCurrentTabData(function (result) {
		$scope.model.url = result.url;
		$scope.model.title = result.title;
		$scope.$digest();
	});

	bookmarkService.requestData(function (urlSet, tagSet, urlTagMap, tagUrlMap) {
		$scope.urlSet = urlSet;
		$scope.tagSet = tagSet;
		$scope.urlTagMap = urlTagMap;
		$scope.tagUrlMap = tagUrlMap;

		//TODO merge data
		for (var property in tagSet) {
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
		
		$timeout(function () {
			$scope.searchModel();
		}, 0);
	};

	$scope.urlHasAllTags = function (urlName) {
		if (!$scope.model.tags || !$scope.model.tags.length) {
			return false;
		}

		for (var i = 0; i < $scope.model.tags.length; i++) {
			var modelTagName = $scope.model.tags[i];

			if (!$scope.urlTagMap[urlName][modelTagName]) {
				return false;
			}
		}

		return true;
	}

	$scope.searchModel = function () {
		console.log("search model");

		$scope.searchResult = [];

		//simple linear search O(n)
		for (var property in $scope.urlSet) {
			var urlName = property;

			if (!$scope.urlHasAllTags(urlName)) {
				continue;
			}

			var modelItem = {
				url: urlName,
				title: $scope.urlSet[urlName].title,
			};

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

	$scope.openTab = function (urlName) {
		chrome.tabs.create({ url: urlName });
	}
}]);
