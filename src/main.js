import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './app';
import './scss/style.scss';

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('app'));
