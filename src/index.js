import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import App from './App';
import Lyra from './pages/Lyra';
import Projects from './pages/Projects';


ReactDOM.render(
  (
    <Router> 
      <div>
        <Route exact path="/" component={App} />
        <Route path="/pages/lyra" component={Lyra} />
        <Route path="/projects" component={Projects} />
      </div>
    </Router> 
  ), document.getElementById('root'),
);
