'use strict';

angular.module('MyModule').service('StorageService', ['$log', '$q', function ($log, $q) {

	//var storageGuid, storageKey, storageRoot, urlsIndex, tagsIndex;
	//var createStorageRoot, createUrlsBranch, createTagsBranch, loadStorage, addUrlToIndex, addTagToIndex;
	//storageGuid = "566f4d43-3930-424b-8fcc-508e9a987d58";
	//storageKey = "storage_" + storageGuid;
	//storageRoot = null;
	//urlsIndex = {};
	//tagsIndex = {};

	//createTagsBranch = function (parentId) {
	//	var deferred = $q.defer();

	//	var tagsNode = {
	//		title: "tags",
	//		parentId: parentId
	//	};

	//	chrome.bookmarks.create(tagsNode, function (treeNode) {
	//		deferred.resolve();
	//	});

	//	return deferred.promise;
	//};

	//createUrlsBranch = function (parentId) {
	//	var deferred = $q.defer();

	//	var urlsNode = {
	//		title: "urls",
	//		parentId: parentId
	//	};

	//	chrome.bookmarks.create(urlsNode, function (treeNode) {
	//		deferred.resolve();
	//	});

	//	return deferred.promise;
	//};

	//createStorageRoot = function () {
	//	var deferred = $q.defer();

	//	chrome.bookmarks.create({ title: storageKey }, function (treeNode) {
			
	//		$q.all([
	//			createTagsBranch(treeNode.id),
	//			createUrlsBranch(treeNode.id)])
	//		.then(function () {
	//			deferred.resolve(treeNode);
	//		})
	//		.catch(function () {
	//			$log.error("could not create storage root");
	//		});

	//	});

	//	return deferred.promise;
	//};

	//loadStorage = function () {
	//	var deferred = $q.defer();

	//	chrome.bookmarks.search(storageKey, function (result) {
	//		if (result && result.length > 0) {
	//			//return storage root if it exists

	//			chrome.bookmarks.getSubTree(result[0].id, function (treeRoot) {
	//				deferred.resolve(treeRoot);
	//			});
	//		}
	//		else {
	//			//create and return storage root if it does not exist
	//			createStorageRoot()
	//				.then(function (treeRoot) {
	//					deferred.resolve(treeRoot);
	//				})
	//				.catch(function (reason) {
	//					deferred.reject(reason);
	//				});
	//		}
	//	});

	//	return deferred.promise;
	//};

	//addTagToIndex = function (tagNode) {
	//	console.log(tagNode);
	//	tagsIndex[tagNode.title] = true;

	//	//for (var i = 0; i < tagNode.children.length; i++) {
	//	//	var urlItem = tagNode.children[i];
	//	//	tagsIndex[tagNode.title].urls[urlItem.title] = true;
	//	//}
	//};

	//addUrlToIndex = function (urlNode) {
	//	console.log(urlNode);

	//	var indexItem = {
	//		added: null,
	//		title: null,
	//		url: null,
	//		tags: {}
	//	};

	//	for (var i = 0; i < urlNode.children.length; i++) {
	//		var node = urlNode.children[i];

	//		if (node.title == "tags_" + storageGuid) {
	//			for (var it = 0; it < node.children.length; it++) {
	//				var tagName = node.children[it].title;
	//				indexItem.tags[tagName] = true;
	//			}
	//		}
	//		else {
	//			//assumes that there is exactly one bookmark data item there
	//			indexItem.added = node.added;
	//			indexItem.title = node.title;
	//			indexItem.url = node.url;
	//		}
	//	}

	//	urlsIndex[urlNode.title] = indexItem;
	//};

	//loadStorage()
	//	.then(function (treeNode) {
	//		storageRoot = treeNode;
	//		$log.warn(storageRoot);

	//		for (var i = 0; i < storageRoot[0].children.length; i++) {
	//			var node = storageRoot[0].children[i]

	//			if (node.title == "tags") {
	//				for (var it = 0; it < node.children.length; it++) {
	//					addTagToIndex(node.children[it]);
	//				}
	//			}
	//			else if (node.title == "urls") {
	//				for (var iu = 0; iu < node.children.length; iu++) {
	//					addUrlToIndex(node.children[iu]);
	//				}
	//			}
	//		}

	//		$log.info(tagsIndex);
	//		$log.info(urlsIndex);
	//	});

	//chrome.bookmarks.getTree(function (treeRoot) {
	//	$log.warn(treeRoot);
	//});

    //var self, keys, data;
    //self = this;
    //self.isSynchronizing = false;
    //keys = {
    //	syncTime: "syncTime",
    //	config: "config",
	//	data: "data",
    //    urlSet: "urlSet",
    //    tagSet: "tagSet",
    //    urlTagMap: "urlTagMap",
    //    tagUrlMap: "tagUrlMap"
    //};
    //data = {};
    //data[keys.syncTime] = new Date(2000, 1, 1);
    //data[keys.config] = {
    //	//todo specify default config
    //};
    //data[keys.urlSet] = {};
    //data[keys.tagSet] = {};
    //data[keys.urlTagMap] = {};
    //data[keys.tagUrlMap] = {};

    //if (!chrome.bookmarks) {
    //	$log.error("chrome.bookmarks api is only available when running as a browser extension");
    //	return;
    //}

    //self.loadModel = function (urlName) {
    //	$log.info("loadModel");

    //	var deferred = $q.defer();

    //	chrome.storage.local.get(["urlSet_" + urlName], function (result) {

    //		if (chrome.runtime.lastError) {
    //			$log.error(chrome.runtime.lastError);
    //			return;
    //		}

    //		$log.warn(result);
    //		callback(result);
    //	});
    //}

    //self.saveModel = function (model) {
    //	$log.info("saveModel");
    //	$log.warn(model);
    //	$log.info(storageRoot);
    //	var deferred = $q.defer();

    //	for (var i = 0; i < storageRoot[0].children.length; i++) {
    //		var node = storageRoot[0].children[i];
    		
    //		if (node.title == "tags") {
    //			for (var modelTag in model.tags) {
    //				var targetNode = null;

    //				for (var it = 0; it < node.children.length; it++) {
    //					var tagNode = node.children[it];
    				
    //					if (tagNode.title == modelTag) {
    //						targetNode = tagNode;
    //						break;
    //					}
    //				}

    //				if (!targetNode) {
    //					chrome.bookmarks.create({
    //						title: modelTag,
	//						parentId: node.id
    //					});
    //				}
    //			}
    //		}
    //		else if (node.title == "urls") {
    //			var targetNode = null;

    //			for (var iu = 0; iu < node.children.length; iu++) {
    //				var urlNode = node.children[iu];

    //				if (urlNode.title == model.url) {
    //					targetNode = urlNode;
    //					break;
    //				}
    //			}

    //			if (targetNode) {
	//				//todo update node instead
    //			}
    //			else {
    //				//add url node

    //				chrome.bookmarks.create({
    //					title: model.url,
    //					parentId: node.id
    //				},
	//				function (urlNode) {
	//					//create data item
	//					chrome.bookmarks.create({
	//						title: model.title,
	//						url: model.url,
	//						parentId: urlNode.id
	//					});

	//					//create tags folder
	//					chrome.bookmarks.create({
	//						title: "tags_" + storageGuid,
	//						parentId: urlNode.id
	//					},
	//					function (tagsNode) {
	//						//create tags
	//						for (var modelTag in model.tags) {
	//							chrome.bookmarks.create({
	//								title: modelTag,
	//								parentId: tagsNode.id
	//							});
	//						}
	//					});
	//				});
    //			}
    //		}
    //	}

    //	return deferred.promise;
    //}

    //self.removeModel = function (model, callback) {
    //	$log.info("removeModel");
    //	$log.warn(model);

    //	chrome.storage.local.remove([model.url], function () {

    //		if (chrome.runtime.lastError) {
    //			$log.error(chrome.runtime.lastError);
    //			return;
    //		}

    //		callback();
    //	});
    //}

    //self.clearAll = function () {
    //	$log.info("clearAll");
		
    //	chrome.storage.local.clear(function () {
    //		if (chrome.runtime.lastError) {
    //			$log.error(chrome.runtime.lastError);
    //			return;
    //		}
    //	});
    //}

    //self.saveAll = function (updatedData, callback) {
    //	$log.info("saveAll");
    //	$log.warn(updatedData);

    //	chrome.storage.local.set(updatedData, function () {

    //		if (chrome.runtime.lastError) {
    //			$log.error(chrome.runtime.lastError);
    //			return;
    //		}

    //	});
    //}

    //self.loadAll = function (callback) {
    //	$log.info("loadAll");

    //	chrome.storage.local.get(null, function (result) {

    //		if (chrome.runtime.lastError) {
    //			$log.error(chrome.runtime.lastError);
    //			return;
    //		}

    //		$log.warn(result);
    //		callback(result);
    //	});
    //}

}]);
