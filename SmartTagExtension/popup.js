'use strict';
//define controllers
angular.module('MyModule').controller('MyController', ['$scope', '$timeout', '$log', 'TabService', 'BookmarkService', function ($scope, $timeout, $log, tabService, bookmarkService) {
	$scope.activeUrl = "requesting...";
	$scope.today = new Date();
	$scope.pageNumber = 0;
	$scope.pageSize = 0;
	$scope.itemCount = 0;
	$scope.tagSelected = "";

	$scope.inputKeyPress = function ($event) {
		if ($event.keyCode === 13) {
			//enter key was pressed
			$scope.tagSelected = "";
		}
	}

	$scope.selected = undefined;
	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
	// Any function returning a promise object can be used to load values asynchronously
	$scope.getLocation = function (val) {
		return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: val,
				sensor: false
			}
		}).then(function (response) {
			return response.data.results.map(function (item) {
				return item.formatted_address;
			});
		});
	};

	$scope.statesWithFlags = [{ 'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png' }, { 'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png' }, { 'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png' }, { 'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png' }, { 'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png' }, { 'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png' }, { 'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png' }, { 'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png' }, { 'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png' }, { 'name': 'Georgia', 'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png' }, { 'name': 'Hawaii', 'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png' }, { 'name': 'Idaho', 'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png' }, { 'name': 'Illinois', 'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png' }, { 'name': 'Indiana', 'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png' }, { 'name': 'Iowa', 'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png' }, { 'name': 'Kansas', 'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png' }, { 'name': 'Kentucky', 'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png' }, { 'name': 'Louisiana', 'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png' }, { 'name': 'Maine', 'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png' }, { 'name': 'Maryland', 'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png' }, { 'name': 'Massachusetts', 'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png' }, { 'name': 'Michigan', 'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png' }, { 'name': 'Minnesota', 'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png' }, { 'name': 'Mississippi', 'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png' }, { 'name': 'Missouri', 'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png' }, { 'name': 'Montana', 'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png' }, { 'name': 'Nebraska', 'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png' }, { 'name': 'Nevada', 'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png' }, { 'name': 'New Hampshire', 'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png' }, { 'name': 'New Jersey', 'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png' }, { 'name': 'New Mexico', 'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png' }, { 'name': 'New York', 'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png' }, { 'name': 'North Carolina', 'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png' }, { 'name': 'North Dakota', 'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png' }, { 'name': 'Ohio', 'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png' }, { 'name': 'Oklahoma', 'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png' }, { 'name': 'Oregon', 'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png' }, { 'name': 'Pennsylvania', 'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png' }, { 'name': 'Rhode Island', 'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png' }, { 'name': 'South Carolina', 'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png' }, { 'name': 'South Dakota', 'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png' }, { 'name': 'Tennessee', 'flag': '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png' }, { 'name': 'Texas', 'flag': 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png' }, { 'name': 'Utah', 'flag': 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png' }, { 'name': 'Vermont', 'flag': '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png' }, { 'name': 'Virginia', 'flag': '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png' }, { 'name': 'Washington', 'flag': '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png' }, { 'name': 'West Virginia', 'flag': '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png' }, { 'name': 'Wisconsin', 'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png' }, { 'name': 'Wyoming', 'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png' }];

	$scope.tagCollection = ["tag1", "tag2"];

	bookmarkService.requestUrlTagData(function (urls, tags) {
		$scope.tagCollection = tags;
	});

	tabService.requestCurrentTabUrl(function (result) {
		$scope.activeUrl = result;
		$scope.$digest();
	});

	$scope.test0 = function () {
	}

	$scope.test1 = function () {
	}

	$scope.test2 = function () {
	}

	//stuff that will be inherited to child scopes. only children can access these.
	$scope.stuff = {};

	$scope.stuff.requestSearch = function (tags, callback) {

	};

	$scope.stuff.requestSuggestion = function (searchTerm, callback) {
		$timeout(function () {
			var results = ["test", "abba", "abc"];
			callback(results);
		}, 0);
	};
}]);

//define directives
angular.module('MyModule').directive('myTagEditor', ['$document', '$log', '$compile', function ($document, $log, $compile) {
	return {
		restrict: "E",
		template: "<span></span><span class='tag-input' contenteditable='true' ng-keypress='stuff.keyPress($event)'></span>",
		controller: function ($scope) {
			var tags, ctrl;
			tags = {};
			ctrl = this;

			

			$scope.stuff.keyPress = function ($event) {
				if ($event.keyCode === 32 || $event.keyCode === 13) {
					//space key or enter key was pressed

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

				if ($event.keyCode === 13) {
					//enter key was pressed
					//todo add save
				}
			};
			
			$scope.stuff.append = function (tagName) {
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

				angular.element(ctrl.tagContainerElement).append(tagItemElement);
			};

			$scope.stuff.remove = function (tagName) {
				if (tags[tagName]) {
					tags[tagName].element.remove();
					delete tags[tagName];
				}
			};
		},
		link: function ($scope, $element, $attr, controller) {
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

