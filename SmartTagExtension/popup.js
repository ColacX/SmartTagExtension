'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', 'TabService', 'BookmarkService', function ($scope, tabService, bookmarkService) {
	$scope.activeUrl = "requesting...";
	$scope.today = new Date();
	$scope.pageNumber = 0;
	$scope.pageSize = 0;
	$scope.itemCount = 0;

	tabService.requestCurrentTabUrl(function (result) {
		$scope.activeUrl = result;
		$scope.$digest();
	});

	$scope.test0 = function () {
		bookmarkService.test();
	}

	$scope.test1 = function () {
	}

	$scope.test2 = function () {
	}
}]);

//define directives
angular.module('MyModule').directive('myAutoFocus', ['$document', function ($document) {
	return {
		link: function (scope, element, attributes, controller) {
			angular.element($document).ready(function () {
				element[0].focus();
			});
		}
	};
}]);

angular.module('MyModule').directive('myTagEditor', ['$document', '$log', '$compile', function ($document, $log, $compile) {
	return {
		restrict: "E",
		template: "<span class='tag-input' contenteditable='true' ng-keypress='keyPress($event)'>default html</span>",
		controller: function ($scope) {
			var tags, self;
			tags = [];
			self = this;

			$scope.keyPress = function ($event) {
				if ($event.keyCode === 32) {
					//space key was pressed

					if (!self.tagInputElement || typeof self.tagInputElement.innerHTML != "string") {
						//return if tagInputElement is bad
						return;
					}

					//convert html-code to plain-text then split to tagNames
					var textData, tagNames;
					textData = angular.element("<textarea />").html(self.tagInputElement.innerHTML).text();
					textData = textData.replace(/<br>/g, " ");
					tagNames = textData.match(/\S+/g);

					if (tagNames) {
						$log.debug(tagNames);
						$log.debug(tagNames.shift());
						self.tagInputElement.innerHTML = tagNames.join(" ");
					}
				}
				else if ($event.keyCode === 32) {
					//enter key was pressed
					
				}
			}


			this.append = function (tagName) {
				$log.debug("append");
				$log.debug(tagName);
			}

			this.remove = function (tagName) {
				$log.debug("remove");
				$log.debug(tagName);
			}
		},
		link: function ($scope, $element, $attr, controller) {
			$log.debug($element);
			$element.addClass('tag-container');
			controller.tagInputElement = $element[0].children[0];


			angular.element($document).ready(function () {
			});

			$compile($element.contents())($scope);
		}
	};
}]);

angular.module('MyModule').directive('myTagItem', ['$document', '$log', function ($document, $log) {
	return {
		restrict: "E",
		template: "<span class='tag-text'>{{tagName}}</span><span class='icon-button icon-delete' ng-click='remove()'></span>",
		require: "^myTagEditor",
		link: function (scope, element, attributes, controller) {
			$log.debug(element);
			element.addClass('tag-item');

			controller.test();
		}
	};
}]);

