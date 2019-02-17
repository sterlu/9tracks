import React from 'react';
import ReactDOM from 'react-dom';
import List from './components/List/List';

const playlists = window.playlists;

ReactDOM.render(<List playlists={playlists} />, document.getElementById('root'));
