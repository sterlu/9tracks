import React, { Component } from 'react';
import List from '../List/List'
import Header from './Header/Header'
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <List />
      </div>
    );
  }
}

export default App;
