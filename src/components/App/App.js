import React, { Component } from 'react';
import Explore from '../Explore/Explore'
import Header from './Header/Header'
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <Explore />
      </div>
    );
  }
}

export default App;
