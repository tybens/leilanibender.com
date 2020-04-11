import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import App from './App';
import Modelling from './pages/Modelling';


ReactDOM.render(
  (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route exact path="/modelling" component={Modelling} />
      </div>
    </Router>
  ), document.getElementById('root'),
);
