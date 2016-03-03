'use strict';

angular.module('MyModule').service('TabService', ['$log', '$q', function ($log, $q) {

	if (!chrome.tabs) {
		$log.error("chrome.tabs api is only available when running as a browser extension");
		return callback("request error");
	}

	//fetches the url of the current window and active tab
	this.currentTabInfo = function () {
		var deferred = $q.defer();

		chrome.tabs.query({ active: true, currentWindow: true }, function (result) {
			var tab = result[0];
			deferred.resolve({
				url: tab.url,
				title: tab.title,
				favIconUrl: tab.favIconUrl
			});
		});

		return deferred.promise;
	}
}]);
