import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Projects = () => (
  <main>
    <section id="projects">
      <Row>
        <Col xs={12} md={5} style={{ paddingTop: 50 }}>
        beep
        </Col>
        <Col xs={12} md={6} style={{ paddingLeft: 50, paddingRight: 50 }}>
          <h2 className="section-heading">ABOUT ME</h2>
          <hr />
          <p>
            Hey, it&apos;s Carol!
          </p>
          <p>
            I started coding when I was fourteen and have since then worked at Hatch Canada and Shopify. I also won Google Code-in '17 
            for contribution to Sugar Labs and spoke at the Wolfram Technology Conference in '17. I'm likely not going to university, and 
              with that, I'm seeking full-time employment in Canada. 
            Check out <a href="https://carolchen.me/resume" style={{ textDecoration: 'underline' }} target="_blank">my resume</a>!
          </p>
          <p>
            Other than programming, I also practice aerial arts. I currently working on an <a href="https://drive.google.com/file/d/1L705zdV4zWG4XDoSxX8ZuebGrPjiv36K/view?usp=sharing" style={{ textDecoration: 'underline' }} target="_blank">aerial hoop piece titled "I'm in Spaaaace"</a>.
            I used to collect carnivorous plants (I had over 200!) and I still love talking about them. I've also worked as a Ski Instructor. I also consume a lot of media; mostly anime and TV shows.  
          </p>
          <p>
            I like solving contest problems, and I'm working on become less-bad at doing so (Codeforces blue soon I hope). In the future, I also intend
            on learning cybersecurity, computer graphics and machine learning / statistics. I put this here to hold myself 
            to these commitments. I also need to blog at some point. 
          </p>
        </Col>
      </Row>
    </section>
  </main>
);

export default Projects;
