import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import App from './App';
import EngCalc from './pages/Engcalc';

ReactDOM.render(
  (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route exact path="/eng-calc" component={EngCalc} />
      </div>
    </Router>
  ), document.getElementById('root'),
);
