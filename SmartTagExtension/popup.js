'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', '$q', 'TabService', 'BookmarkService', 'StorageService', function ($scope, $timeout, $log, $q, tabService, bookmarkService, storageService) {
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
		$scope.status = "processing";
		$scope.model.url = result.url;
		$scope.model.title = result.title;
		$scope.$digest();

		bookmarkService.getData($scope.model.url)
		.then(function (result) {
			
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
		.then(function () {
			if (!$scope.model.folder && !$scope.model.folder.id) {
				return $q.when(null); //returns an auto resolved promise
			}

			return bookmarkService.getFolderContent($scope.model.folder.id);
		})
		.then(function (result) {
			$scope.searchResult = result;
		})
		.then(function () {
			$scope.status = "ready";
		})
		.catch(function (reason) {
			$log.error(reason);
			$scope.status = "failed";
		});
	});

	$scope.saveModel = function () {
		$log.debug("save model");
		$scope.status = "processing";

		if (!$scope.model || !$scope.model.url || !$scope.model.folder) {
			return;
		}

		if ($scope.model.folder.id) {

			if ($scope.model.currentBookmark) {
				$log.debug("move new bookmark to existing folder...");

				bookmarkService.moveBookmark(
					$scope.model.currentBookmark.id,
					{
						parentId: $scope.model.folder.id,
						index: 0
					}
				).then(function(){
					$scope.status = "success";
				})
				.catch(function (reason) {
					$log.error(reason);
					$scope.status = "failed";
				});
			}
			else {
				$log.debug("save new bookmark to existing folder...");

				bookmarkService.createBookmark({
					parentId: $scope.model.folder.id,
					index: 0,
					title: $scope.model.title,
					url: $scope.model.url
				}).then(function () {
					$scope.status = "success";
				})
				.catch(function (reason) {
					$log.error(reason);
					$scope.status = "failed";
				});
			}
		}
		else {
			$log.debug("save new bookmark to new folder");

			bookmarkService.createBookmark({
				index: 0,
				title: $scope.model.folder,
			}).then(function (result) {
				return bookmarkService.createBookmark({
					parentId: result.id,
					index: 0,
					title: $scope.model.title,
					url: $scope.model.url
				});
			}).then(function (result) {
				$scope.status = "success";
			})
			.catch(function (reason) {
				$log.error(reason);
				$scope.status = "failed";
			});
		}
	};

	$scope.deleteModel = function () {
		$log.debug("delete model");
		$scope.status = "processing";

		bookmarkService.removeBookmark(
			$scope.model.currentBookmark.id
		).then(function () {
			$scope.status = "success";
		})
		.catch(function (reason) {
			$log.error(reason);
			$scope.status = "failed";
		});
	};

	$scope.openTab = function (urlName) {
		$log.debug("openTab");
		chrome.tabs.create({ url: urlName });
	}

	$scope.inputKeyPress = function ($event) {
		$log.debug(event);

		if ($event.keyCode == 13) {
			$scope.saveModel();
		}
	}

	$scope.folderChange = function () {
		$log.debug("folderChange");

		if (!$scope.model.folder || !$scope.model.folder.id) {
			return;
		}

		bookmarkService.getFolderContent($scope.model.folder.id)
		.then(function (result) {
			$scope.searchResult = result;
		})
		.catch(function (reason) {
			$log.error(reason);
		});
	}
}]);
