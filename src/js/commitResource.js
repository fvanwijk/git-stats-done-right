angular.module('gitStats')
.factory('commitResource', function ($resource) {
  return $resource('api/ing.json');
});