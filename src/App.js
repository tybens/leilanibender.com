import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Pages
import Landing from './Landing';
import Navigation from './Navigation';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path="/" component={Landing} />
        </Switch>
      </div>
    );
  }
}

export default App;
