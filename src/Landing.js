import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import LinkedIn from 'react-icons/lib/fa/linkedin';
import Github from 'react-icons/lib/fa/github';
import Envelope from 'react-icons/lib/fa/envelope';

import personSvg from './img/person.svg';
import meImg from './img/me.jpg';
import './styles/Landing.css';

const Landing = () => (
  <main>
    <section className="panels" id="home">
      <div className="jumbotron">
        <h2 className="section-heading ">Hello! I&apos;m Carol Chen.</h2>
        <hr className="light" />
        <Quote />
      </div>
      <img className="person-graphic" src={personSvg} alt="graphic" />
    </section>
    <section className="panels container-fluid" id="about">
      <Row>
        <Col xs={12} md={6}>
          <img src={meImg} className="img-responsive img-circle" alt="carol at hackathon" />
        </Col>
        <Col xs={12} md={6}>
          <h2 className="section-heading">ABOUT ME</h2>
          <hr />
          <p>
            Hey, it&apos;s Carol! I&apos;m a high school student in Richmond Hill, Ontario.
            I love building things, then making those things better, then fixing what was wrong with those things.
            <br />
            tl;dr I love software development.
            <br /><br />
            <a href="https://github.com/kipply" target="_blank" rel="noredirect no referrer"><Github /></a>
            <a href="https://www.linkedin.com/in/carol-chen" target="_blank" rel="noredirect no referrer"><LinkedIn /></a>
            <a href="mailto:hello@carolchen.me" target="_blank" rel="noredirect no referrer"><Envelope /></a>
          </p>
        </Col>
      </Row>
    </section>
  </main>
);

const Quote = () => {
  const quotes = [
    {
      quote: 'Cogito ergo sum',
      author: 'René Descartes from the *Renéssance*',
    },
    {
      quote: 'I would like to die on Mars. Just not on impact.',
      author: 'Elon Musk',
    },
    {
      quote: 'I have a dream.',
      author: 'Martin Luther King Jr.',
    },
    {
      quote: 'Just watch me.',
      author: 'Pierre Elliot Trudeau',
    },
    {
      quote: 'A no is a maybe and a maybe is a yes.',
      author: 'Vinod Khosla',
    },
    {
      quote: 'Do you not know I am a woman? When I think, I must speak.',
      author: 'Shakepeare in "As You Like It" Act 3',
    },
    {
      quote: 'Sunny Ways.',
      author: 'Sir Wilfred Laurier',
    },
    {
      quote: 'If you\'re going through hell, keep going.',
      author: 'Winston Churchill',
    },
    {
      quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      author: 'Aristotle',
    },
    {
      quote: 'I have no regrets.',
      author: 'Edward Snowden',
    },
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className="quote">
      <p className="quote-content">
        &#34;{quote.quote}&#34;
      </p>
        -<i>{quote.author}</i>
    </div>
  );
};

export default Landing;
