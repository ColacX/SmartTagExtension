'use strict';

//service that interacts with the browser bookmarks
angular.module('MyModule').service('BookmarkService', ['$log', '$q', function ($log, $q) {
	if (!chrome.bookmarks) {
		$log.error("chrome.bookmarks api is only available when running as a browser extension");
		throw "chrome.bookmarks api is only available when running as a browser extension";
	}

	var self = this;

	self.getData = function (targetUrl) {
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

	self.getFolderContent = function (bookmarkId) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.getSubTree(bookmarkId, function (result) {
			if (!result || result.length != 1 || !result[0].children) {
				deferred.resolve([]);
				return;
			}
			else {
				var list = [];
				for (var i = 0; i < result[0].children.length; i++) {
					if (result[0].children[i].url) {
						list.push(result[0].children[i]);
					}
				}

				deferred.resolve(list);
			}
		});

		return deferred.promise;
	};

	self.createBookmark = function (bookmarkNode) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.create(bookmarkNode, function (result) {
			deferred.resolve(result);
		});

		return deferred.promise;
	};

	self.moveBookmark = function (bookmarkId, destination) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.move(bookmarkId, destination, function (result) {
			deferred.resolve(result);
		});

		return deferred.promise;
	};

	self.removeBookmark = function (bookmarkId) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.remove(bookmarkId, function () {
			deferred.resolve();
		});

		return deferred.promise;
	};

	self.updateBookmark = function (bookmarkId, changes) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.update(bookmarkId, changes, function () {
			deferred.resolve();
		});

		return deferred.promise;
	};

	self.deleteFolder = function (folderId) {
		var deferred;
		deferred = $q.defer();

		//should we delete only empty folders?
		chrome.bookmarks.removeTree(folderId, function () {
			if (chrome.runtime.lastError) {
				deferred.reject(chrome.runtime.lastError.message);
				return;
			}

			deferred.resolve();
		});

		return deferred.promise;
	};
}]);
