'use strict';

angular.module('myApp.topnav', ['ngRoute'])

        .controller('TopNavCtrl', ['$location', '$scope', function ($location, $scope) {
          $scope.currentNavItem = 'home';
          $scope.goto = function(url){
          $location.path(url);
          }

            }]);
