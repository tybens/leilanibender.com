import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import App from './App';
import Lyra from './pages/Lyra';
import AnonMessages from './apps/AnonMessages';


ReactDOM.render(
  (
    <Router> 
      <div>
        <Route exact path="/" component={App} />
        <Route path="/pages/lyra" component={Lyra} />
      </div>
    </Router> 
  ), document.getElementById('root'),
);
