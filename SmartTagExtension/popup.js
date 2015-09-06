'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', 'TabService', 'BookmarkService',
function ($scope, $timeout, $log, tabService, bookmarkService) {
	var ctrl = this;
	$scope.model = {};
	$scope.model.url = "";
	$scope.model.title = "";
	$scope.tagSelected = "";
	$scope.model.tags = [];
	$scope.urlList = [];
	$scope.tagList = [];
	ctrl.url2tagIndex = {};
	ctrl.tag2urlIndex = {};

	this.loadModel = function (urlName) {
		if (!urlName || !ctrl.url2tagIndex[urlName]) {
			return;
		}

		$log.info(ctrl.url2tagIndex[urlName]);
		$scope.model.tags = [];

		for (var property in ctrl.url2tagIndex[urlName].tags) {
			$scope.model.tags.push(property);
		}

		$scope.$digest();
	}

	this.saveModel = function () {

	}

	$scope.inputKeyPress = function ($event) {
		if ($event.keyCode === 13) {
			//enter key was pressed
			if (!$scope.tagSelected) {
				return;
			}

			$scope.tagSelected = $scope.tagSelected.trim();
			$scope.appendTag($scope.tagSelected);
			$scope.tagSelected = "";
		}
	}

	$scope.appendTag = function (tagName) {
		if ($scope.modelTags.indexOf($scope.tagSelected) === -1) {
			//add new tag if it was not found
			$scope.modelTags.push($scope.tagSelected);
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

	//-------------do work after definitions-------------------------
	bookmarkService.requestUrlTagData(function (urls, tags, url2tagIndex, tag2urlIndex) {
		$scope.urlList = urls;
		$scope.tagList = tags;
		ctrl.url2tagIndex = url2tagIndex;
		ctrl.tag2urlIndex = tag2urlIndex;

		tabService.requestCurrentTabUrl(function (url, title) {
			$scope.model.url = url;
			$scope.model.title = title;
			$scope.$digest();
			ctrl.loadModel($scope.model.url);
		});
	});
}]);
