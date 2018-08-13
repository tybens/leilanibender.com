import React from 'react';

import PersonSvg from './img/person.svg';
import './styles/Navigation.css';

const Navigation = () => (
  <nav id="mainNav" className="navbar navbar-default navbar-fixed-top zoomInDown">
    <div className="navbar-inner">
      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-content" >
          <i className="fa fa-bars fa-1x" aria-hidden="true" />
        </button>
      </div>
      <div className="collapse navbar-collapse" id="nav-content">
        <ul className="nav navbar-nav">
          <li>
            <a className="page-scroll" href="#home">Home</a>
          </li>
          <li>
            <a className="page-scroll" href="#about">About Me</a>
          </li>
          <li>
            <a className="page-scroll" href="#portfolio">Things I've Done</a>
          </li>
          <li>
            <a className="page-scroll" href="/resume">Resume</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navigation;
