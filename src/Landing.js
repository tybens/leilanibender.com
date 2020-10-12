import React from 'react';
import { Row, Col } from 'react-bootstrap';

import LinkedIn from 'react-icons/lib/fa/linkedin';
import Github from 'react-icons/lib/fa/github';
import Instagram from 'react-icons/lib/fa/instagram';
import Twitter from 'react-icons/lib/fa/twitter';
import Envelope from 'react-icons/lib/fa/envelope';

import meImg from './img/me.jpg';
import meImg2 from './img/me2.jpg';
import meImg3 from './img/me3.jpg';
import meImg4 from './img/me4.jpg';
import meImg5 from './img/me5.jpg';

import Signature from './Signature';

const meImages = [meImg, meImg2, meImg3, meImg4, meImg5];

const Landing = () => (
  <main>
    <section className="panels" id="home">
      <div className="jumbotron">
        <h2 className="section-heading">Hi! I'm Carol</h2>
        <Quote />
      </div>
    </section>
    <section id="about">
      <Row>
        <Col xs={12} md={5} style={{ paddingTop: 50 }}>
          <img src={meImages[Math.floor(Math.random() * meImages.length)]} className="img-responsive img-circle" alt="carol at hackathon" />
        </Col>
        <Col xs={12} md={6} style={{ paddingLeft: 50, paddingRight: 50 }}>
          <h2 className="section-heading">ABOUT ME</h2>
          <hr />
          <p style={{ fontSize: 14}}>
            My site randomizes many elements per load! I did this because choosing things is hard.
          </p>
          <p>
            I currently write code at Generic Stealth AI Startup. Apart from code, I consume a lot of media and train in circus arts (aerials, a bit of flow and pole). I'm currently {new Date(Date.now() - new Date(2001, 11, 28).getTime()).getUTCFullYear() - 1970} years old.
          </p>
          <p>
            Visit my <a href="/blog" style={{ textDecoration: 'underline' }} target="_blank">blog</a>, which I'd attempt to describe but it's quite all-over-the-place. Also, I enjoy conversations about tech and other stuff, never hesitate to reach out to me (preferably via email).
          </p>
        </Col>
        <Col xs={12} md={1} style={{ paddingTop: 50, fontSize: 40 }}>
          <a href="https://github.com/kipply" target="_blank" rel="noredirect no referrer"><Github /></a>
          <a href="https://twitter.com/kipperrii" target="_blank" rel="noredirect no referrer"><Twitter /></a>
          <a href="https://instagram.com/kipperrii/" target="_blank" rel="noredirect no referrer"><Instagram /></a>
          <a href="mailto:hello@carolchen.me" target="_blank" rel="noredirect no referrer"><Envelope /></a>
        </Col>
      </Row>
    </section>
    <Signature />
  </main>
);

const Quote = () => {
  const quotes = [
    {
      quote: '💕🍜 ramen is sooo good🍜 💕',
      author: 'Elon Musk',
    },
    {
      quote: 'Just watch me.',
      author: 'Pierre Elliot Trudeau',
    },
    {
      quote: 'Non-conformity is the only real passion worth being ruled by.',
      author: 'Julian Assange',
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
        <i>{quote.author}</i>
    </div>
  );
};

export default Landing;
