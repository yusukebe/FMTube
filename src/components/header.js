import React from 'react';
import ReactDOM from 'react-dom';
import {AutoComplete} from 'material-ui';
import {RaisedButton} from 'material-ui';
import $ from 'jquery';

class Header extends React.Component {
  render () {
    return (
      <header>
      <Title/>
      <SocialButtons/>
      <Form onSubmitArtist={this.props.onSubmitArtist}/>
      </header>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <h1 style={{textAlign:'center'}}>FMTube!</h1>
    )
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    let value = '';
    if(document.location.hash) {
      const matches = /\?q=([^&]+)/.exec(document.location.hash)
      value = decodeURIComponent(matches[1]);
    }
    this.state = {
      value: value,
      dataSource: []
    };
  }

  handleChange(text) {
    this.setState({
      value: text
    });
    if(!text || text == '') return;
    $.ajax({
      url: 'http://ws.audioscrobbler.com/2.0/',
      data: {
        api_key : '6a6281367c3ad09f1b4a7c15dc50675b',
        method : 'artist.search',
        limit : 5,
        format : 'json',
        artist : text
      },
      dataType: 'jsonp',
      success:(data) => {
        if(data.results.artistmatches) {
          const artists = data.results.artistmatches.artist;
          const names = artists.map((artist) => {
            return artist.name;
          });
          this.setState({dataSource: names});
        }
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  handleNewRequest(text) {
    this.setState({
      value: text
    });
  }

  handleSubmit(e) {
    const query = this.state.value;
    if(!query) return;
    this.props.onSubmitArtist(query);
  }

  render() {
    return (
      <div style={{textAlign:'center', marginBottom:'1rem'}}>
        <AutoComplete hintText="Artist Name"
         onUpdateInput={this.handleChange.bind(this)}
         onNewRequest={this.handleNewRequest.bind(this)}
         dataSource={this.state.dataSource}
         filter={AutoComplete.caseInsensitiveFilter}
         style={{marginRight:'1rem'}}
         searchText={this.state.value}
        >
        </AutoComplete>
        <RaisedButton label="Play" onClick={this.handleSubmit.bind(this)}/>
      </div>
    )
  }
}

class SocialButtons extends React.Component {
  componentDidMount(){
    window.eval(`var script = document.createElement('script');script.src = 'http://platform.twitter.com/widgets.js';document.body.appendChild(script);`)
    window.eval(`var script = document.createElement('script');script.src = 'http://b.st-hatena.com/js/bookmark_button.js';document.body.appendChild(script);`)
  }
  createMarkup(){
    return {
      __html:`<span style="margin-right:4px;">
    <a href="http://b.hatena.ne.jp/entry/http://yusuke.be/FMTube/" class="hatena-bookmark-button" data-hatena-bookmark-title="FMTube!" data-hatena-bookmark-layout="standard-balloon" data-hatena-bookmark-lang="en" title="このエントリーをはてなブックマークに追加"><img src="http://b.st-hatena.com/images/entry-button/button-only@2x.png" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a>
    </span>
    <a href="https://twitter.com/share" class="twitter-share-button" data-url="http://yusuke.be/FMTube/" data-text="FMTube!">Tweet</a>
    <span>
    <iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fyusuke.be.%2FFMTube%2F&amp;width=150&amp;layout=button_count&amp;action=like&amp;show_faces=true&amp;share=true&amp;height=21&amp;appId=640667512644377" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px; width:150px;" allowTransparency="true"></iframe>
    </span>`
    }
  }
  render(){
    return (
      <div id='social-buttons' dangerouslySetInnerHTML={this.createMarkup()}/>
    )
  }
}

export default Header;
