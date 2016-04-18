import React from 'react';
import ReactDOM from 'react-dom';
import {TextField} from 'material-ui';
import {FlatButton} from 'material-ui';

class Header extends React.Component {
  render () {
    return (
      <header>
        <Title/>
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
    this.state = {
      value: ''
    };
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }
  
  handleSubmit(e) {
    const query = this.state.value;
    if(!query) return;
    this.props.onSubmitArtist(query);
  }

  render() {
    return (
      <div style={{textAlign:'center'}}>
        <TextField hintText="Artist Name"
         style={{marginRight:'1rem', marginBottom:'1rem'}}
         onChange={this.handleChange.bind(this)}
         value={this.state.value}
         onEnterKeyDown={this.handleSubmit.bind(this)}>
        </TextField>
        <FlatButton label="Play" onClick={this.handleSubmit.bind(this)}/>
      </div>
    )
  }
}

export default Header;
