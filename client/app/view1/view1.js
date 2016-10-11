'use strict';

angular.module('myApp.view1', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/view1', {
                    templateUrl: 'view1/view1.html',
                    controller: 'View1Ctrl'
                });
            }])

        .controller('View1Ctrl', ['$http', '$scope', function ($http, $scope) {
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