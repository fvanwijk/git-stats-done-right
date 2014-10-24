angular.module('gitStats', [
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngSanitize'
])
  .config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/templates/home.html',
      controller: 'HomeController'
    })
    .otherwise({ redirectTo: '/' });
  })
  .factory('d3', function () {
    return d3;
  })
  .factory('moment', function () {
    return moment;
  });