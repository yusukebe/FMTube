import React from 'react';
import {List} from 'material-ui';
import {ListItem} from 'material-ui';
import {Avatar} from 'material-ui';

class Sidebar extends React.Component {
  render() {
    return (
      <div id={'sidebar'}>
      <TrackList tracks={this.props.tracks} onRequestPlay={this.props.onRequestPlay}
      currentTrackNumber={this.props.currentTrackNumber}
      />
      </div>
    )
  }
}

class TrackList extends React.Component {
   render() {
    const trackNodes = this.props.tracks.map((track, count) => {
      const imageUrl = track.image[3]['#text'];
      return(<TrackListItem key={count} number={count}
        currentTrack={this.props.currentTrackNumber == count ? true : false} name={track.name}
        imageUrl={imageUrl} artist={track.artist.name}
        onRequestPlay={this.props.onRequestPlay}/>);
    });
    return(<List>{trackNodes}</List>);
  }
}

class TrackListItem extends React.Component {
  handleClick(e) {
    this.props.onRequestPlay(this.props.number);
  }

  render() {
    return (
      <ListItem primaryText={this.props.name} onClick={this.handleClick.bind(this)}
      leftAvatar={<Avatar src={this.props.imageUrl}/>}
      className={this.props.currentTrack ? 'selectedItem' : ''}
      />
    );
  }
}

export default Sidebar;
