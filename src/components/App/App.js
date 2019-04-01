import React, { Component } from 'react';
import Explore from '../Explore/Explore'
import Header from './Header/Header'
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Explore} />
            <Route path="/tag/:tag" component={Explore} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
