var app = angular.module('fmtube', ['ng']);

app.run(function(){
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var first_tag = document.getElementsByTagName('script')[0];
  first_tag.parentNode.insertBefore(tag, first_tag);
});

app.factory('Tracks', function($http) {
  return {
    get : function(query, callback) {
      tracks = [];
      $http.jsonp('http://ws.audioscrobbler.com/2.0/', {
        params : {
          api_key : '6a6281367c3ad09f1b4a7c15dc50675b',
          method : 'artist.getTopTracks',
          limit : 20,
          format : 'json',
          callback : 'JSON_CALLBACK',
          artist : query
        }
      }).success(function(data){
        callback(data.toptracks.track);
      }).error(function(error){
        console.log(error);
      });
      return tracks;
    }
  };
});

app.service('YouTube', function($window, $http){
  this.ready = false;
  this.player = null;
  this.play = function(track, callback) {
    var query = track.name + ' ' + track.artist.name;
    $http.jsonp('http://gdata.youtube.com/feeds/api/videos', {
      params : {
        q: query + ' -みた -コピ -カラオケ -ピアノ',
        'max-results' : 2,
        alt : 'json-in-script',
        callback : 'JSON_CALLBACK'
      }
    }).success(function(data){
      data.feed.entry.sort(function(a,b){
        return b['favoriteCount'] - a['favoriteCount'];
      });
      var permalink = data.feed.entry[0]['id']['$t'];
      var id = permalink.match(/^.+\/(.+?)$/)[1];
      if(this.ready) {
        this.player.clearVideo();
        this.player.loadVideoById(id);
      }else{
        this.player = new YT.Player('player', {
          height: '400',
          width: '600',
          videoId : id,
          playerVars: { 'autoplay': 1, 'rel': 0 },
          events : { 
            onStateChange : function (event){
              if(event.data == YT.PlayerState.ENDED ) {
                callback();
              }
            }
          }
        });
        this.ready = true;
      }
    }).error(function(error){
      console.log(error);
    });
  };
});

app.service('PlayList', function(){
  this.list = [];
  this.index = 0;
  this.ready = false;
  this.add = function(track){
    this.list.push(track);
  };
  this.current_track = function(){
    if (!this.ready) return;
    return this.list[this.index];
  };
  this.next = function(index){
    if(index) {
      this.index = index;
    }else if(!this.ready) {
      this.index = 0;
    }else{
      if(this.index + 1 >= this.list.length ) {
        this.index = 0
      }else{
        this.index++;
      }
    }
    this.ready = true;
    return this.list[this.index];
  };
  this.clear = function(){
    this.list = [];
    this.ready = false;
  };
});

app.controller('controller', function($scope, Tracks, YouTube, PlayList) {
  $scope.title = 'FMTube!';
  $scope.play = function(index){
    YouTube.play(PlayList.next(index), $scope.play);
    var track = PlayList.current_track();
    $scope.title = track.name + ' by ' + track.artist.name + ' - FMTube!';
  };
  $scope.submit = function(){
    if (!this.query) return;
    PlayList.clear();
    Tracks.get(this.query, function(tracks){
      angular.forEach(tracks, function(row, i){
        PlayList.add(row);
      });
      $scope.tracks = tracks;
      $scope.play();
    });
    return false;
  };
  $scope.click = function(index){
    $scope.play(index);
    return false;
  };
  $scope.active_class = function(index){
    if(PlayList.index == index) return 'list-active';
  };
});

