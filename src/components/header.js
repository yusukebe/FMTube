import React from 'react';
import {TextField} from 'material-ui';
import {FlatButton} from 'material-ui';

class Header extends React.Component {
  render () {
    return (
      <header>
        <Title/>
        <Form/>
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
  render() {
    return (
      <div style={{textAlign:'center'}}>
        <TextField hintText="Artist Name" style={{marginRight:'1rem'}}>
        </TextField>
        <FlatButton label="Play" />
      </div>
    )
  }
}

export default Header;
