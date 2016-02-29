'use strict';

//service that interacts with the browser bookmarks
angular.module('MyModule').service('BookmarkService', ['$log', '$q', function ($log, $q) {
	if (!chrome.bookmarks) {
		throw "chrome.bookmarks api is only available when running as a browser extension";
	}

	this.getData = function (targetUrl) {
		$log.info("getData");
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

	this.createBookmark = function (bookmarkNode) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.create(bookmarkNode, function (result) {
			$log.warn(result);
			deferred.resolve();
		});

		return deferred.promise;
	};

	this.moveBookmark = function (bookmarkId, destination) {
		var deferred;
		deferred = $q.defer();

		chrome.bookmarks.move(bookmarkId, destination, function (result) {
			$log.warn(result);
			deferred.resolve();
		});

		return deferred.promise;
	};

	this.requestData2 = function () {
		$log.info("requestData2");

		var deferred, probe, folders, urls;
		deferred = $q.defer();
		folders = {};
		urls = {};
		probe = function (node) {
			if (node.url) {
				//leaf node
				if (!urls[node.url]) {
					urls[node.url] = [];
				}

				urls[node.url].push({
					bookmarkId: node.id,
					bookmarkParentId: node.parentId,
					urlTitle: node.title,
					dateAdded: node.dateAdded
				});
				return;
			}

			//branch node
			if (node.title) {
				//add only folders with title

				if (!folders[node.title]) {
					folders[node.title] = [];
				}

				folders[node.title].push({
					bookmarkId: node.id,
					bookmarkParentId: node.parentId,
					dateAdded: node.dateAdded
				});
			}

			//recurse over all children
			for (var i = 0; i < node.children.length; i++) {
				probe(node.children[i]);
			}
		};

		if (!chrome.bookmarks) {
			throw "chrome.bookmarks api is only available when running as a browser extension";
			//$log.error(m);
			//return;
			//throw m;
		}

		chrome.bookmarks.getTree(function (result) {
			if (!result || !result.length || result.length < 1) {
				$log.warn("no bookmarks found");
			}

			$log.warn(result);

			for (var i = 0; i < result.length; i++) {
				probe(result[i]);
			}

			deferred.resolve({
				folders: folders,
				urls: urls
			});
		});

		return deferred.promise;
	}

	this.requestData = function (callback) {

		if (!chrome.bookmarks) {
			$log.error("chrome.bookmarks api is only available when running as a browser extension");
			return callback(null, null);
		}

		chrome.bookmarks.getTree(function (result) {
			//$log.info(result);

			if (!result || !result.length || result.length < 1) {
				$log.warn("no bookmarks found");
			}

			var urlSet, tagSet, urlTagMap, tagUrlMap, findUnknown;
			urlSet = {};
			tagSet = {};
			urlTagMap = {};
			tagUrlMap = {};

			//the algorithm used is not a simple DFS nor BFS, it searches the tree for unknown urlSet and avoids revisiting nodes that cannot have more to find
			//the algorithm has O(N) time-complexity, actually it is probably closer to O(2*N + log n)
			findUnknown = function (node) {
				if (!node || node.dontVisit) {
					//return not found if the node was a bad reference or should not be revisited
					return null;
				}

				if (!node.children) {
					//found a leaf node
					//$log.debug(node);
					node.dontVisit = true;

					var urlName = node.url;
					if (!urlName || urlName == "" || urlSet[urlName]) {
						//return not found if the urlName is bad or already exist
						return null;
					}

					//create a new urlItem if urlName was unknown
					urlSet[urlName] = {
						//url object data
						added: node.dateAdded,
						title: node.title
					};
					return urlName;
				}

				for (var i = 0; i < node.children.length; i++) {
					//search through each child
					var urlName = findUnknown(node.children[i]);

					if (!urlName) {
						//if no new urlItem was found then try the next child
						continue;
					}

					//tag the leaf node
					var tagName = node.title;

					if (!tagName || tagName == "") {
						//if the tag name is bad then just skip the tagging step
						return urlName;
					}

					if (!tagSet[tagName]) {
						//create new tag item if it does not exist yet
						tagSet[tagName] = {
							//tag object data
						};
					}

					//map the tagName to the urlName
					if (!tagUrlMap[tagName]) {
						//create new if mapping does not exist
						tagUrlMap[tagName] = {};
					}
					tagUrlMap[tagName][urlName] = true;

					//map url to tag
					if (!urlTagMap[urlName]) {
						//create new if mapping does not exist
						urlTagMap[urlName] = {};
					}
					urlTagMap[urlName][tagName] = true;

					//go back up the tree so it can receive the next tag
					return urlName;
				}

				//return no new urlName found and never come back here since it has searched through all children without finding anything
				node.dontVisit = true;
				return null;
			};

			for (var i = 0; i < result.length; i++) {
				while (true) {
					//keep search the same tree branch until no new url is found
					var urlName = findUnknown(result[i]);

					if (!urlName) {
						//stop searching through the same tree branch if no new url was found
						break;
					}
				}
			}

			//$log.info(urlSet);
			//$log.info(tagSet);
			//$log.info(urlTagMap);
			//$log.info(tagUrlMap);
			callback(urlSet, tagSet, urlTagMap, tagUrlMap);
		});
	};
}]);
