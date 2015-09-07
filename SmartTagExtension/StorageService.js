'use strict';

angular.module('MyModule').service('StorageService', ['$log', function ($log) {

    var self, keys, data;
    self = this;
    self.isSynchronizing = false;
    keys = {
        syncTime: "syncTime",
        urls: "urls",
        tags: "tags",
        url2tagIndex: "url2tagIndex",
        tag2urlIndex: "tag2urlIndex",
        config: "config"
    };
    data = {};

    data[keys.syncTime] = new Date(2000, 1, 1);
    data[keys.urls] = [];
    data[keys.tags] = [];
    data[keys.url2tagIndex] = {};
    data[keys.tag2urlIndex] = {};
    data[keys.config] = {
        //todo specify default config
    };

    //self.createUrl2tagIndex = function (tag2urlIndex) {
    //    //hmm either we do some reverse processing, or we say screw that and just save it to memory
    //}

    self.get = function () {
        return data;
    }

    self.set = function (updatedData) {

    }

    self.requestSync = function (callback) {
        if (!chrome.storage) {
            $log.error("chrome.storage api is only available when running as an extension");
            return;
        }

        if (self.isSynchronizing) {
            return; //then ignore the request
        }

        self.isSynchronizing = true;

        chrome.storage.sync.get(keys.syncTime, function (result) {
            $log.info("synchronizing...");

            if (chrome.runtime.lastError) {
                self.isSynchronizing = false;
                $log.error(chrome.runtime.lastError);
                callback("error");
                return;
            }

            if (result && result[keys.syncTime] && result[keys.syncTime] > data.syncTime) {
                //fetch data if data exists and the syncTime is greater than the local data
                chrome.storage.sync.get([keys.syncTime, keys.urls, keys.tags, keys.url2tagIndex, keys.tag2urlIndex, keys.config], function (result) {
                    if (chrome.runtime.lastError) {
                        self.isSynchronizing = false;
                        $log.error(chrome.runtime.lastError);
                        callback("error");
                        return;
                    }

                    self.isSynchronizing = false;
                    $log.info("get");
                    $log.debug(result);
                    callback("success");
                });
            }
            else {
                //save data if data does not exist or if syncTime is less than local data
                data[keys.syncTime] = new Date(); //update the time

                chrome.storage.sync.set(data, function () {
                    if (chrome.runtime.lastError) {
                        self.isSynchronizing = false;
                        $log.error(chrome.runtime.lastError);
                        callback("error");
                        return;
                    }

                    self.isSynchronizing = false;
                    $log.info("set");
                    callback("success");
                });
            }
        });
    };
}]);
