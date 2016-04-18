import React from 'react';
import Header from './components/header';
import Player from './components/player';
import Sidebar from './components/sidebar';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      video: {}
    };
  }

  getTracks(query) {
    $.ajax({
      url: 'http://ws.audioscrobbler.com/2.0/',
      type: 'GET',
      data: {
        api_key : '6a6281367c3ad09f1b4a7c15dc50675b',
        method : 'artist.getTopTracks',
        limit : 20,
        format : 'json',
        artist : query
      },
      dataType: 'jsonp',
      success:(data) => {
        if(data.toptracks) {
          this.setState({ tracks: data.toptracks.track});
        }
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  play(query) {
    $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/search',
      type: 'GET',
      data: {
        part: 'snippet',
        key: 'AIzaSyBkrjp5QVbUS55LUo5FnoJxWXmqbI25Xk8',
        maxResults: 1,
        q: query,
        type: 'video',
        videoEmbeddable: 'true'
      },
      dataType: 'jsonp',
      success:(data) => {
        if(data.items){
          const item = data.items[0];
          const videoId = item.id.videoId;
          const title = item.snippet.title;
          const thumbnailUrl = item.snippet.thumbnails.high.url;
          this.setState({ video: { id: videoId, title: title, thumbnailUrl: thumbnailUrl} });
        }
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }      
    });
  }

  render () {
    return (
      <div id={'container'}>
        <Header onSubmitArtist={this.getTracks.bind(this)}/>
        <Player video={this.state.video}/>
        <Sidebar tracks={this.state.tracks} onRequestPlay={this.play.bind(this)}/>
      </div>
    );
  }
}

export default App;
