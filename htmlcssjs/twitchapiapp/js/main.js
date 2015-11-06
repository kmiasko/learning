var app = angular.module('twitchApp', []);

app.controller('userListController', function($scope, $http, $q) {

  var twitchers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "notmichaelmcdonald", "RobotCaleb", "comster404", "brunofin", "thomasballinger", "joe_at_underflow", "noobs2ninjas", "mdwasp", "beohoff", "xenocomagain", "medrybw"];

  $scope.all = [];

  $scope.getStream = function(name) {
    var online = $http.jsonp('https://api.twitch.tv/kraken/streams/' + name + '?callback=JSON_CALLBACK');
    var channels = $http.jsonp('https://api.twitch.tv/kraken/channels/' + name + '?callback=JSON_CALLBACK');

    $q.all([online, channels]).then(function(results) {
      var data = {};
      if (results[1].data.hasOwnProperty('error') === false) {
        data = results[1].data;
        data.online = (results[0].data.stream === null) ? false : true;
        $scope.all.push(data);
      }
    });
  }

  $scope.getStreams = function() {
    for (var t in twitchers) {
      $scope.getStream(twitchers[t]);
    }
  }
  $scope.getStreams();
  $scope.streams = $scope.all;

  function toggle_off() {
  var elements = [ angular.element(document.getElementById('all')),
angular.element(document.getElementById('online')),         angular.element(document.getElementById('offline'))];
   elements.map(function(el) { el.removeClass('active'); });
  }


  $scope.all_s = function($event) {
    $scope.streams = $scope.all;
    toggle_off();
    angular.element($event.currentTarget).addClass('active');
  };

  $scope.online = function($event) {
    $scope.streams = $scope.all.filter(function(f) { return f.online === true });
    toggle_off();
    angular.element($event.currentTarget).addClass('active');
  };

  $scope.offline = function($event) {
    $scope.streams = $scope.all.filter(function(f) { return f.online === false });
    toggle_off();
    angular.element($event.currentTarget).addClass('active');
  }

});