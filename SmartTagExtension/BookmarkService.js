'use strict';

//service that interacts with the browser bookmarks
angular.module('MyModule').service('BookmarkService', ['$log', '$q', function ($log, $q) {
	if (!chrome.bookmarks) {
		throw "chrome.bookmarks api is only available when running as a browser extension";
	}

	this.getData = function (targetUrl) {
		$log.info(targetUrl);

		var deferred, folderList, currentBookmark, probe;
		deferred = $q.defer();
		folderList = [];
		currentBookmark = null;

		probe = function (node) {

			if (node.url) {
				//leaf node
				if (node.url == targetUrl) {
					currentBookmark = node;
				}

				return;
			}

			//branch node
			if (node.title) {
				folderList.push({
					id: node.id,
					title: node.title
				});
			}

			//recurse over all children
			for (var i = 0; i < node.children.length; i++) {
				probe(node.children[i]);
			}
		};

		chrome.bookmarks.getTree(function (result) {
			if (!result || !result.length || result.length <= 0) {
				$log.warn("no bookmarks found");
			}

			$log.warn(result);

			for (var i = 0; i < result.length; i++) {
				probe(result[i]);
			}

			deferred.resolve({
				folderList: folderList,
				currentBookmark: currentBookmark
			});
		});

		return deferred.promise;
	};

	this.getFolderContent = function (bookmarkId) {
		$log.info("getFolderContent");
		$log.info(bookmarkId);
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.getSubTree(bookmarkId, function (result) {
			$log.warn(result);

			if (!result || result.length != 1 || !result[0].children) {
				deferred.resolve([]);
				return;
			}
			else {
				deferred.resolve(result[0].children);
			}
		});

		return deferred.promise;
	};

	this.createBookmark = function (bookmarkNode) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.create(bookmarkNode, function (result) {
			deferred.resolve(result);
		});

		return deferred.promise;
	};

	this.moveBookmark = function (bookmarkId, destination) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.move(bookmarkId, destination, function (result) {
			deferred.resolve(result);
		});

		return deferred.promise;
	};

	this.removeBookmark = function (bookmarkId) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.remove(bookmarkId, function () {
			deferred.resolve();
		});

		return deferred.promise;
	};
}]);
