import React, { Component } from 'react';

import Slider from 'rc-slider';
import { Row, Col } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

import 'rc-slider/assets/index.css';

const data = require('./portfolio.json');

class Portfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      slider: 3,
    };
  }
  render() {
    return (
      <main>
        <section id="portfolio">
          <h2 className="section-heading">THINGS I'VE DONE</h2>
          <center>
            <span style={{color: '#808080'}}>Last Updated August 2018</span>
            <Slider
              defaultValue={3}
              min={1}
              max={5}
              marks={{
                1: 'Very Little Things',
                2: 'Less Things',
                3: 'Default',
                4: 'More Things',
                5: 'Excruciating Number of Things with Excruciating Detail',
              }}
              dots
              onChange={v => this.setState({ slider: v })}
            />
          </center>
          <div className="portfolio-box">
            <Row>
              <Col xs={12} md={6} className="item">
                <h1>Work</h1>
                <ReactCSSTransitionGroup
                  transitionName="points"
                  transitionEnterTimeout={2000}
                  transitionLeaveTimeout={200}
                >
                  {
                    this.state.data.experience.map((item) => {
                      if (item.toggle.indexOf(this.state.slider) === -1) {
                        return '';
                      }
                      const points = item.points.map((p) => {
                        if (p.toggle.indexOf(this.state.slider) === -1) {
                          return '';
                        }
                        return <li dangerouslySetInnerHTML={{ __html: p.content }} />;
                      });
                      return (
                        <div className="portfolio-item">
                          <div className="header">
                            <span className="title">{item.company}</span>
                            <span className="divider-strong"> // </span>
                            <span className="desc">{item.position}</span>
                            <span className="divider-weak"> // </span>
                            <span className="date"> {item.date}</span>
                          </div>
                          <ul>
                            <ReactCSSTransitionGroup
                              transitionName="points"
                              transitionAppear
                              transitionAppearTimeout={400}
                              transitionEnterTimeout={2000}
                              transitionLeaveTimeout={200}
                            >
                              {points}
                            </ReactCSSTransitionGroup>
                          </ul>
                        </div>
                      );
                    })
                  }
                </ReactCSSTransitionGroup>

                <h1>Community</h1>
                <ReactCSSTransitionGroup
                  transitionName="points"
                  transitionEnterTimeout={2000}
                  transitionLeaveTimeout={200}
                >

                  {
                    this.state.data.community.map((item) => {
                      if (item.toggle.indexOf(this.state.slider) === -1) {
                        return '';
                      }
                      const points = item.points.map((p) => {
                        if (p.toggle.indexOf(this.state.slider) === -1) {
                          return '';
                        }
                        return <li dangerouslySetInnerHTML={{ __html: p.content }} />;
                      });
                      return (
                        <div className="portfolio-item">
                          <div className="header">
                            <span className="title">{item.thing}</span>
                            <span className="divider-strong"> // </span>
                            <span className="desc">{item.description}</span>
                            <span className="divider-weak"> // </span>
                            <span className="date"> {item.date}</span>
                          </div>
                          <ul>
                            <ReactCSSTransitionGroup
                              transitionName="points"
                              transitionAppear
                              transitionAppearTimeout={400}
                              transitionEnterTimeout={2000}
                              transitionLeaveTimeout={200}
                            >

                              {points}
                            </ReactCSSTransitionGroup>
                          </ul>
                        </div>
                      );
                    })
                  }
                </ReactCSSTransitionGroup>
                {this.state.slider > 2 > 0 &&
                  <ReactCSSTransitionGroup
                    transitionName="points"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={200}
                  >
                  <h1>Misc</h1>

                    {
                      this.state.data.stuff.map((item) => {
                        if (item.toggle.indexOf(this.state.slider) === -1) {
                          return '';
                        }
                        const points = item.points.map((p) => {
                          if (p.toggle.indexOf(this.state.slider) === -1) {
                            return '';
                          }
                          return <li dangerouslySetInnerHTML={{ __html: p.content }} />;
                        });
                        return (
                          <div className="portfolio-item">
                            <div className="header">
                              <span className="title">{item.thing}</span>
                              <span className="divider-strong"> // </span>
                              <span className="desc">{item.description}</span>
                              <span className="divider-weak"> // </span>
                              <span className="date"> {item.date}</span>
                            </div>
                            <ul>
                              <ReactCSSTransitionGroup
                                transitionName="points"
                                transitionAppear
                                transitionAppearTimeout={400}
                                transitionEnterTimeout={2000}
                                transitionLeaveTimeout={200}
                              >

                                {points}
                              </ReactCSSTransitionGroup>
                            </ul>
                          </div>
                        );
                      })
                    }
                  </ReactCSSTransitionGroup>
                }
              </Col>
              <Col xs={12} md={6} className="item">
                <h1>Hobbies</h1>
                <ReactCSSTransitionGroup
                  transitionName="points"
                  transitionEnterTimeout={2000}
                  transitionLeaveTimeout={200}
                >

                  {
                    this.state.data.hobbies.map((item) => {
                      if (item.toggle.indexOf(this.state.slider) === -1) {
                        return '';
                      }
                      const points = item.points.map((p) => {
                        if (p.toggle.indexOf(this.state.slider) === -1) {
                          return '';
                        }
                        return <li dangerouslySetInnerHTML={{ __html: p.content }} />;
                      });
                      return (
                        <div className="portfolio-item">
                          <div className="header">
                            <span className="title">{item.thing}</span>
                            <span className="divider-strong"> // </span>
                            <span className="desc">{item.description}</span>
                            <span className="divider-weak"> // </span>
                            <span className="date"> {item.date}</span>
                          </div>
                          <ul>
                            <ReactCSSTransitionGroup
                              transitionName="points"
                              transitionAppear
                              transitionAppearTimeout={400}
                              transitionEnterTimeout={2000}
                              transitionLeaveTimeout={200}
                            >

                              {points}
                            </ReactCSSTransitionGroup>
                          </ul>
                        </div>
                      );
                    })
                  }
                </ReactCSSTransitionGroup>
                                <h1>Awards and Honours</h1>
                <ReactCSSTransitionGroup
                  transitionName="points"
                  transitionEnterTimeout={2000}
                  transitionLeaveTimeout={200}
                >

                  {
                  this.state.data.awards.map((item) => {
                    if (item.toggle.indexOf(this.state.slider) === -1) {
                      return '';
                    }
                    const points = item.points.map((p) => {
                      if (p.toggle.indexOf(this.state.slider) === -1) {
                        return '';
                      }
                      return <li dangerouslySetInnerHTML={{ __html: p.content }} />;
                    });
                    return (
                      <div className="portfolio-item">
                        <div className="header">
                          <span className="title">{item.thing}</span>
                          <span className="divider-strong"> // </span>
                          <span className="desc">{item.description}</span>
                          <span className="divider-weak"> // </span>
                          <span className="date"> {item.date}</span>
                        </div>
                        <ul>
                          <ReactCSSTransitionGroup
                            transitionName="points"
                            transitionAppear
                            transitionAppearTimeout={400}
                            transitionEnterTimeout={2000}
                            transitionLeaveTimeout={200}
                          >

                            {points}
                          </ReactCSSTransitionGroup>
                        </ul>
                      </div>
                    );
                  })
                }
                </ReactCSSTransitionGroup>
              </Col>
            </Row>
          </div>
        </section>
      </main>
    );
  }
}

export default Portfolio;
