import React from "react";
import { Row, Col } from "react-bootstrap";

import meImg from "./img/me.jpg";
import meImg2 from "./img/me2.jpg";
import meImg3 from "./img/me3.jpg";
import meImg4 from "./img/me4.jpg";
import meImg5 from "./img/me5.jpg";

const meImages = [meImg, meImg2, meImg3, meImg4, meImg5];

const Landing = () => (
  <div style={{ display: "block" }}>
    <section className="panels" id="home" style={{ overflow: "hidden" }}>
      <Row className="landing-row">
        <Col sm={4} md={4}>
          <img
            alt=""
            src={meImages[Math.floor(Math.random() * meImages.length)]}
            className="img-responsive img-circle"
          />
        </Col>
        <Col sm={8} md={8} style={{ paddingLeft: "50px" }} id="intro-text">
          <h2 className="section-heading">hi i'm emily (leilani) bender</h2>
          <p>
            I'm from Honolulu, Hawaii and currently am a Transportation
            Integration Systems intern at Atkins. Apart from civil engineering,
            I enjoy physical activity in the form of Rugby, climbing, and
            weight-lifting.
          </p>
          <p>
            I enjoy conversations about civil policy and rugby and other stuff,
            never hesitate to reach out to me (preferably via email).
          </p>
          <div id="links">
            <h3 className="section-heading">links</h3>
            <a
              href="mailto:elbender@princeton.edu"
              target="_blank"
              rel="noredirect noopener noreferrer"
            >
              email me
            </a>{" "}
            ||{" "}
            <a
              href="https://www.linkedin.com/in/leilanibender/"
              target="_blank"
              rel="noredirect noopener noreferrer"
            >
              linkedin
            </a>{" "}
            ||{" "}
            <a
              href="https://instagram.com/1eilanib/"
              target="_blank"
              rel="noredirect noopener noreferrer"
            >
              instagram
            </a>{" "}
            ||{" "}
            <a
              href="https://leilanibender.com/resume"
              rel="noredirect noopener noreferrer"
            >
              button for recruiters
            </a>
          </div>
        </Col>
      </Row>
    </section>
  </div>
);

export default Landing;
