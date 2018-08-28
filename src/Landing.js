import React from 'react';
import { Row, Col } from 'react-bootstrap';

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
    <section id="about">
      <Row>
        <Col xs={12} md={5} style={{ paddingTop: 50 }}>
          <img src={meImg} className="img-responsive img-circle" alt="carol at hackathon" />
        </Col>
        <Col xs={12} md={6} style={{ paddingLeft: 50, paddingRight: 50 }}>
          <h2 className="section-heading">ABOUT ME</h2>
          <hr />
          <p>
            Hey, it&apos;s Carol! I&apos;m a high school student in Richmond Hill, Ontario.
          </p>
          <p>
            I started programming in grade nine, and I've been to a lot of Hackathons, contributed to One Laptop per Child software,
            and completed internships at Shopify and Hatch Canada.
            Check out <a href="CarolChenResume.pdf" style={{ textDecoration: 'underline' }}>my resume</a>!
          </p>
          <p>
            I like solving little contest problems, and I'm working on become less-bad at doing so. In the future, I also intend
            on learning cybersecurity, computer graphics and machine learning / statistics.
          </p>
          <p>
            For non-recruiters (or <b>really</b> awesome recruiters), I keep a <a href="/blog" style={{ textDecoration: 'underline' }}>blog</a> about life, travel, and shit I do.
          </p>
        </Col>
        <Col xs={12} md={1} style={{ paddingTop: 50, fontSize: 40 }}>
          <a href="https://www.linkedin.com/in/carol-chen" target="_blank" rel="noredirect no referrer"><LinkedIn /></a>
          <a href="https://github.com/kipply" target="_blank" rel="noredirect no referrer"><Github /></a>
          <a href="mailto:hello@carolchen.me" target="_blank" rel="noredirect no referrer"><Envelope /></a>
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
