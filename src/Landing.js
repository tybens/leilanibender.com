import React from 'react';
import { Row, Col } from 'react-bootstrap';

import LinkedIn from 'react-icons/lib/fa/linkedin';
import Github from 'react-icons/lib/fa/github';
import Envelope from 'react-icons/lib/fa/envelope';

import personSvg from './img/person.svg';
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
        <h2 className="section-heading ">Hello! I&apos;m Carol Chen.</h2>
        <hr className="light" />
        <Quote />
      </div>
      <img className="person-graphic" src={personSvg} alt="graphic" />
    </section>
    <section id="about">
      <Row>
        <Col xs={12} md={5} style={{ paddingTop: 50 }}>
          <img src={meImages[Math.floor(Math.random() * meImages.length)]} className="img-responsive img-circle" alt="carol at hackathon" />
        </Col>
        <Col xs={12} md={6} style={{ paddingLeft: 50, paddingRight: 50 }}>
          <h2 className="section-heading">ABOUT ME</h2>
          <hr />
          <p>
            Hey, it&apos;s Carol!
          </p>
          <p>
            I started programming in grade nine, and I've been to a lot of Hackathons, contributed to One Laptop per Child software,
            and completed internships at Shopify and Hatch Canada.
            Check out <a href="https://carolchen.me/resume" style={{ textDecoration: 'underline' }}>my resume</a>!
          </p>
          <p>
            I like solving little contest problems, and I'm working on become less-bad at doing so. In the future, I also intend
            on learning cybersecurity, computer graphics and machine learning / statistics.
          </p>
          <p>
            For non-recruiters (or <b>really</b> awesome recruiters), I keep a <a href="https://carolchen.me/blog" style={{ textDecoration: 'underline' }}>blog</a> about life, travel, and stuff I do. Not much yet as I'm currently suffering the wrath of college applications.
          </p>
        </Col>
        <Col xs={12} md={1} style={{ paddingTop: 50, fontSize: 40 }}>
          <a href="https://www.linkedin.com/in/carol-chen" target="_blank" rel="noredirect no referrer"><LinkedIn /></a>
          <a href="https://github.com/kipply" target="_blank" rel="noredirect no referrer"><Github /></a>
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
      quote: 'This is important. Someone is WRONG on the internet.',
      author: 'Cueball',
    },
    {
      quote: '💕🍜 ramen is sooo good🍜 💕',
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
      author: 'Rosalind in Shakespeare's "As You Like It" ',
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
        -<i>{quote.author}</i>
    </div>
  );
};

export default Landing;
