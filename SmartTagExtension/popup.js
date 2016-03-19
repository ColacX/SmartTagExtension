'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', '$q', '$uibModal', 'TabService', 'BookmarkService', 'StorageService',
function ($scope, $timeout, $log, $q, $uibModal, tabService, bookmarkService, storageService) {
	var self = this;
	$scope.model = {
		url: "requesting...",
		title: "requesting...",
		folder: "requesting...",
		currentBookmark: null
	};
	$scope.folderList = [];
	$scope.searchResult = [];
	$scope.status = "processing";

	$scope.saveModel = function () {
		$log.debug("save model");

		if (!$scope.model || !$scope.model.url || !$scope.model.folder) {
			return;
		}

		$scope.status = "processing";
		$q.when()
		.then(function () {
			if (!$scope.model.folder.id) {
				$log.debug("create folder if folder does not exist");
				return bookmarkService.createBookmark({
					index: 0,
					title: $scope.model.folder,
				});
			}
			else {
				$log.debug("return existing folder instead");
				return $q.when({
					id: $scope.model.folder.id,
					title: $scope.model.folder.title
				});
			}
		})
		.then(function (folderInfo) {
			$log.debug("create bookmark and add it to the folder");
			return bookmarkService.createBookmark({
				parentId: folderInfo.id,
				index: 0,
				title: $scope.model.title,
				url: $scope.model.url
			});
		})
		.then(function () {
			if ($scope.model.currentBookmark && $scope.model.currentBookmark.url == $scope.model.url) {
				$log.debug("remove existing bookmark");
				return bookmarkService.removeBookmark(
					$scope.model.currentBookmark.id
				);
			}

			$log.debug("keep existing bookmark");
			return $q.when();
		})
		.then(function () {
			$scope.status = "success";
		})
		.catch(function (reason) {
			$log.error(reason);
			$scope.status = "failed";
		});
	};

	$scope.deleteModel = function () {
		$log.debug("delete model");

		if (!$scope.model.currentBookmark) {
			return;
		}

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

	$scope.deleteFolder = function () {
		$log.debug("deleteFolder");

		if (!$scope.model.folder || !$scope.model.folder.id) {
			return;
		}

		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: true,
			templateUrl: "MyConfirmDialogTemplate.html",
			controller: "MyConfirmDialogController",
			windowClass: "my-confirm-dialog",
			size: "sm",
			resolve: {
			}
		});

		modalInstance.result.then(function (isYes) {
			$scope.status = "processing";
			return bookmarkService.deleteFolder($scope.model.folder.id);
			
		})
		.then(function () {
			$scope.status = "success";
		})
		.catch(function (reason) {
			$log.error(reason);
			$scope.status = "failed";
		});;
	}

	tabService.currentTabInfo()
		.then(function (tabInfo) {
			$scope.model.url = tabInfo.url;
			$scope.model.title = tabInfo.title;
			return bookmarkService.getData($scope.model.url);
		})
		.then(function (result) {
			$scope.folderList = result.folderList;
			$scope.model.folder = "";

			if (result.currentBookmark) {
				$scope.model.currentBookmark = result.currentBookmark;
				$scope.model.title = $scope.model.currentBookmark.title;
			}

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
			$scope.status = "ready";
		})
		.catch(function (reason) {
			$log.error(reason);
			$scope.status = "failed";
		});
}]);
