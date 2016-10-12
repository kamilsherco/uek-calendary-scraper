'use strict';

angular.module('myApp.home', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/home', {
                    templateUrl: 'views/home.html',
                    controller: 'HomeCtrl'
                });
            }])

        .controller('HomeCtrl', ['$http', '$scope', function ($http, $scope) {
                $scope.update = function (urlToScrape) {

                    $scope.url = "";
                    $http.get('/scrape')
                            .success(function (response) {
                                console.log(response);
                                $scope.url = response.url;
                            }).error(function (data, status) {

                    });
                };

            }]);
