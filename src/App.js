import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Pages
import Landing from './Landing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
        </Switch>
      </div>
    );
  }
}

export default App;
