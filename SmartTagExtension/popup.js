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
		template: "<span></span><span class='tag-input' contenteditable='true' ng-keypress='stuff.keyPress($event)'></span>",
		controller: function ($scope) {
			var tags, ctrl;
			tags = {};
			ctrl = this;

			$scope.stuff = {
				keyPress: function ($event) {
					if ($event.keyCode === 32) {
						//space key was pressed

						if (!ctrl.tagInputElement || typeof ctrl.tagInputElement.innerHTML != "string") {
							//return if tagInputElement is bad
							return;
						}

						//convert html-code to plain-text then split to tagNames
						var textData, tagNames;
						textData = angular.element("<textarea />").html(ctrl.tagInputElement.innerHTML).text();
						textData = textData.replace(/<br>/g, " ");
						tagNames = textData.match(/\S+/g);

						if (tagNames) {
							$scope.stuff.append(tagNames.shift());
							ctrl.tagInputElement.innerHTML = tagNames.join(" ");
						}
					}
					else if ($event.keyCode === 32) {
						//enter key was pressed
						//todo add save
					}
				},
				append: function (tagName) {
					if (!tagName || tags[tagName]) {
						//todo possible show some indication
						//return if name is bad or tag already exists
						return;
					}

					//create tag item
					var childScope = $scope.$new();
					childScope.tagName = tagName;
					var tagItemElement = $compile("<my-tag-item></my-tag-item>")(childScope);

					//save child element so it can be deleted later
					tags[tagName] = {
						element: tagItemElement,
						scope: childScope
					}; 

					$log.debug(ctrl.tagContainerElement);
					angular.element(ctrl.tagContainerElement).append(tagItemElement);
				},
				remove: function (tagName) {
					if (tags[tagName]) {
						tags[tagName].element.remove();
						delete tags[tagName];
						$log.debug(tags);
					}
				}
			};
		},
		link: function ($scope, $element, $attr, controller) {
			$log.debug($element);
			$element.addClass('tag-container');
			controller.tagContainerElement = $element[0].childNodes[0];
			controller.tagInputElement = $element[0].children[1];
			controller.tagEditorElement = $element;

			angular.element($document).ready(function () {
				controller.tagInputElement.focus();
			});

			$compile($element.contents())($scope);
		}
	};
}]);

angular.module('MyModule').directive('myTagItem', ['$document', '$log', '$compile', function ($document, $log, $compile) {
	return {
		restrict: "E",
		template: "<span class='tag-text'>{{tagName}}</span><span class='icon-button icon-delete' ng-click='stuff.remove(tagName)'></span>",
		link: function ($scope, $element, $attr, controller) {
			$element.addClass("tag-item");
		}
	};
}]);

