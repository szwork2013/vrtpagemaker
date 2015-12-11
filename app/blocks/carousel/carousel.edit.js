'use strict';

angular.module('immersiveAngularApp')
    .directive('editCarousel', function() {
        return {
            template: '<div><div class="btn-left" ng-click="onClickPrevious()" ng-include="\'icons/left-arrow.html\'" ng-hide="parameters.media"></div><div class="btn-right" ng-click="onClickNext()" ng-include="\'icons/right-arrow.html\'" ng-hide="parameters.media"></div><figure class="{{filter}}"><img ng-class="{ show: current == $index }" ng-repeat="image in parameters.images" ng-src="{{ image }}"></figure><edit-audioplayer class="ap" ng-if="parameters.media" id="id" parameters="parameters" progress="onProgress"></edit-audioplayer></div>',
            restrict: 'E',
            scope: {
                id: '=',
                parameters: '='
            },

            link: function postLink(scope) {
                scope.$watch('parameters.images', function(newValue, oldValue) {
                    if (newValue) {
                        scope.images = newValue;
                    };
                });

                scope.$watch('parameters.filter', function(newValue, oldValue) {
                    if (newValue) {
                        scope.filter = newValue;
                    };
                });
            },
            controller: CarouselController
        };
    });

function CarouselController($scope, AudioPlayerService) {
    var interval;

    $scope.time = $scope.parameters.time || 5000;
    $scope.current = 0;

    $scope.onProgress = onProgress;
    $scope.onClickPrevious = onClickPrevious;
    $scope.onClickNext = onClickNext;

    $scope.$watch(function () {
        return $scope.parameters.media;
    }, function (newValue, oldValue) {
        if (newValue) {
            stop();
        } else {
            start();
        }
    });

    function onProgress(value) {
        var part = 1 / $scope.images.length;
        var number = Math.floor(value / part);

        if (!isNaN(number)) {
            select(number);
        }
    }

    function select(number) {
        $scope.current = number;
    }

    function start() {
        interval = setInterval(function() {
            next();
        }, $scope.time);
    }

    function stop() {
        clearInterval(interval);
    }

    function previous() {
        $scope.current--;
        if ($scope.current < 0) {
            $scope.current = $scope.images.length - 1;
        }
    }

    function next() {
        $scope.current++;
        if ($scope.current >= $scope.images.length) {
            $scope.current = 0;
        }
    }

    function onClickPrevious() {
        stop();
        previous();
    }

    function onClickNext() {
        stop();
        next();
    }
}