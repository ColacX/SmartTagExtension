'use strict';

//service that interacts with the browser bookmarks
angular.module('MyModule').service('BookmarkService', ['$log', function ($log) {
	this.requestUrlTagData = function (callback) {

		if (!chrome.bookmarks) {
			$log.error("chrome.bookmarks api is only available when running as a browser extension");
			return callback(null, null);
		}

		//if (!window.confirm("are you sure?")) {
		//	return;
		//}

		chrome.bookmarks.getTree(function (result) {
			$log.info(result);

			if (!result || !result.length || result.length < 1) {
				$log.warn("no bookmarks found");
			}

			var urls, tags, findUnknown, progressCount;
			urls = {};
			tags = {};
			progressCount = 0;

			//the algorithm used is not a simple DFS nor BFS, it searches the tree for unknown urls and avoids revisiting nodes that cannot have more to find
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
					progressCount++;

					var urlName = node.url;
					if (!urlName || urlName == "" || urls[urlName]) {
						//return not found if the urlName is bad or already exist
						return null;
					}

					//create a new urlItem if urlName was unknown
					urls[urlName] = {
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

					if (!tags[tagName]) {
						//create new tag item if it does not exist yet
						tags[tagName] = {};
					}

					//map the tagName to the urlName
					var tagItem = tags[tagName];
					tagItem[urlName] = null;

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

			$log.info(urls);
			$log.info(tags);

			//post process
			var urlList, tagList, url2tagIndex, tag2urlIndex;
			urlList = [];
			tagList = [];

			for (var property in tags) {
				tagList.push(property);
			}

			callback(urlList, tagList);
		});
	};
}]);
