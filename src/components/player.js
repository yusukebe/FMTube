import React from 'react';
import {Card} from 'material-ui';
import {CardTitle} from 'material-ui';
import {CardMedia} from 'material-ui';
import YouTube from 'react-youtube';

class Player extends React.Component {
  render() {
    let card = <Card></Card>;
    if(this.props.video.id) {
      card = <Card><CardTitle subtitle={this.props.video.title}/>
      <CardMedia style={{padding:'0 10px 10px 10px'}}>
      <YouTubePlayer videoId={this.props.video.id} onNextTrack={this.props.onNextTrack}/>
      </CardMedia></Card>;
    }
    return (
      <div id={'player'}>
      {card}
      </div>
    )
  }
}

class YouTubePlayer extends React.Component {
  render() {
    const options = {
      height: '300',
      width: '100%',
      rel: '0',
      showinfo: '0'
    };
    return(
      <YouTube videoId={this.props.videoId} opts={options} onReady={this.onReady.bind(this)}
      onStateChange={this.onStateChange.bind(this)}/>
    );
  }
  handleNextTrack() {
    this.props.onNextTrack();
  }
  onReady(e) {
    e.target.playVideo();
  }
  onStateChange(e){
    switch (e.data) {
      case 0:
        e.target.stopVideo();
        this.handleNextTrack();
      case 5:
        e.target.playVideo();
    }
  }
}

export default Player;
