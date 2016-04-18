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
      video: {},
      currentTrackNumber: null
    };
  }

  getTracks(query) {
    $.ajax({
      url: 'http://ws.audioscrobbler.com/2.0/',
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
          this.setState({tracks: data.toptracks.track});
          this.play();
          document.location.hash = "?q=" + encodeURIComponent(query);
        }
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  playNextTrack(){
    let number = this.state.currentTrackNumber;
    if(number >= 19) {
      number = 0;
    }else{
      number = number + 1;
    }
    this.play(number);
  }

  play(number=0) {
    this.setState({currentTrackNumber: number});
    const track = this.state.tracks[number];
    const query = `${track.artist.name} ${track.name}`;

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
          $('title').text(`${track.name} by ${track.artist} - FMTube!`);
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
        <Player video={this.state.video}
        onNextTrack={this.playNextTrack.bind(this)}
        />
        <Sidebar tracks={this.state.tracks}
        currentTrackNumber={this.state.currentTrackNumber}
        onRequestPlay={this.play.bind(this)}
        />
      </div>
    );
  }
}

export default App;
