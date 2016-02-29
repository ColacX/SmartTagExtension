'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', 'TabService', 'BookmarkService', 'StorageService', function ($scope, $timeout, $log, tabService, bookmarkService, storageService) {
	var self = this;

	$scope.model = {
		url: "requesting...",
		title: "requesting...",
		folder: "requesting...",
		currentBookmark: null
	};

	$scope.folderList = [];
	$scope.searchResult = [];
	$scope.status = "ready";

	tabService.requestCurrentTabData(function (result) {
		$scope.model.url = result.url;
		$scope.model.title = result.title;
		$scope.$digest();

		bookmarkService.getData($scope.model.url)
		.then(function (result) {
			$log.info("success");
			$log.info(result);
			$scope.folderList = result.folderList;
			$scope.model.folder = "";
			$scope.model.currentBookmark = result.currentBookmark;

			if ($scope.model.currentBookmark) {
				//then fetch the folder title
				for (var i = 0; i < $scope.folderList.length; i++) {
					if ($scope.folderList[i].id == $scope.model.currentBookmark.parentId) {
						$scope.model.folder = {
							id: $scope.folderList[i].id,
							title: $scope.folderList[i].title
						};
						break;
					}
				}
			}
		})
		.catch(function (reason) {
			$log.error(reason);
		});
	});

	$scope.saveModel = function () {
		$log.info("save model...");
		$scope.status = "processing";

		if (!$scope.model || !$scope.model.url || !$scope.model.folder) {
			return;
		}

		if ($scope.model.folder.id) {

			if ($scope.model.currentBookmark) {
				$log.info("move new bookmark to existing folder...");

				bookmarkService.moveBookmark(
					$scope.model.currentBookmark.id,
					{
						parentId: $scope.model.folder.id,
						index: 0
					}
				).then(function(){
					$log.info("success");
					$scope.status = "success";
				})
				.catch(function (reason) {
					$log.error("failed");
					$log.error(reason);
					$scope.status = "failed";
				});
			}
			else {
				$log.info("save new bookmark to existing folder...");

				bookmarkService.createBookmark({
					parentId: $scope.model.folder.id,
					index: 0,
					title: $scope.model.title,
					url: $scope.model.url
				}).then(function () {
					$log.info("success");
					$scope.status = "success";
				})
				.catch(function (reason) {
					$log.error("failed");
					$log.error(reason);
					$scope.status = "failed";
				});
			}
		}
		else {
			console.log("save new bookmark to new folder");
			//prompt save to new folder?
			$scope.status = "success";
		}
	};

	$scope.deleteModel = function () {
		console.log("delete model");
		$scope.status = "processing";

		bookmarkService.removeBookmark(
			$scope.model.currentBookmark.id
		).then(function () {
			$log.info("success");
			$scope.status = "success";
		})
		.catch(function (reason) {
			$log.error("failed");
			$log.error(reason);
			$scope.status = "failed";
		});
	};

	$scope.openTab = function (urlName) {
		chrome.tabs.create({ url: urlName });
	}
}]);
