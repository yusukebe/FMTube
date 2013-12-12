var app = angular.module('fmtube', []);

app.factory('Tracks', function($http) {
  return {
    get : function(query) {
      tracks = [];
      $http.jsonp('http://ws.audioscrobbler.com/2.0/', {
        params : {
          api_key : '6a6281367c3ad09f1b4a7c15dc50675b',
          method : 'artist.getTopTracks',
          format : 'json',
          callback : 'JSON_CALLBACK',
          artist : query
        }
      }).success(function(data){
        angular.extend(tracks, data.toptracks.track);
        console.log(tracks);
      }).error(function(error){
        console.log(error);
      });
      return tracks;
    }
  };
});

app.controller('controller', function($scope, Tracks) {
  $scope.submit = function(){
    var query = this.query;
    if (!query) return;
    var tracks = Tracks.get(query);
    $scope.tracks = tracks;
  };
});

