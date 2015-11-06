var app = angular.module('newsListApp', []);

app.factory('getStoriesService', function($http) {

  var getStories = function() {
    return $http.get('http://www.freecodecamp.com/stories/hotStories')
      .then(function(data) {
        return data;
      });
  };

  return {
    getStories: getStories
  };
});

app.controller('NewsListController', function($scope, $http, getStoriesService) {
  var myStoriesPromise = getStoriesService.getStories();
  myStoriesPromise.then(function(result) {
    $scope.stories = result.data;
  });
});