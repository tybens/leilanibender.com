import React, { Component } from 'react';
import './styles/Engcalc.css';
import {Tex} from 'react-tex';
import * as math from 'mathjs';

class Engcalc extends Component {
  constructor(props) {
    super(props);

    this.equation = "";
    this.answerEquation = "";
    this.eState = true;
    this.answer = "";

    this.url = process.env.PUBLIC_URL + '/song.mp3';
    this.audio = new Audio(this.url);
    this.audioState = true;
  }

  componentDidMount() {
    this.play();

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // remote script has loaded
    };
    script.src = process.env.PUBLIC_URL + 'engcalc/engcalc.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  play = () => {
    this.audio.play();
  }

  pause = () => {
    this.audio.pause();
  }


  click(operation) {
    this.equation += operation;
    this.eState = true;
    this.setState({ state: this.state });
  }

  clear() {
    this.equation = "";
    this.eState = true;
    this.setState({ state: this.state });
  }

  backspace() {
    this.equation = this.equation.slice(0, this.equation.length - 1);
    this.eState = true;
    this.setState({ state: this.state });
  }


  _handleKeyDown = (event) => {
    if (/^[0-9()+-/*coslogsin%tan^]$/.test(event.key)) {
      this.click(event.key);
    }
    if (/^Backspace$/.test(event.key)) {
      this.backspace(event.key);
    }
    if (/^Enter$/.test(event.key)) {
      this.evaluate(event.key);
    }
  }


  evaluate() {
    var toEval = this.equation;
    toEval = toEval.replace("x", "*")
    var lnm = toEval.match(/ln\((.+)\)/);
    var logm = toEval.match(/log\((.+)\)/);
    if (lnm) {
      toEval = toEval.replace(/ln\((.+)\)/, "log(" + lnm[1] + ", e)")
    }
    if (logm) {
      toEval = toEval.replace(/log\((.+)\)/, "log(" + logm[1] + ", 10)")
    }

    try {
      var lahtech = window.Module.UTF8ToString(window.Module.ccall('run', null, ['string'], [math.evaluate(toEval).toString()]))
      this.answerEquation = toEval + " = " + lahtech;
      this.equation = "";
      this.eState = false;
      this.setState({ state: this.state });
    } catch {
      alert("beep beep bad equation beep")
    }

  }

  music() {
    if (this.audioState) {
      this.audio.pause();
      this.audioState = false;
    } else {
      this.audio.play();
      this.audioState = true;
    }
  }

  render() {
    return (
      <div className="Engcalc">
        <div className="toprow">
          {this.eState &&
            <div className="equation">
              {this.equation}
            </div>
          }
          {!this.eState &&
            <div className="equation">
               <Tex texContent={this.answerEquation}/>
            </div>
          }
        </div>
        <div className="row">
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/1title.gif'}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/2factorial.gif'} onClick={() => this.click("!")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/3openbracket.gif'} onClick={() => this.click("(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/4closingbracket.gif'} onClick={() => this.click(")")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/5modulo.gif'} onClick={() => this.click("%")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/6AC.gif' } onClick={() => this.clear()}/>
        </div>
        <div className="row">
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/7music.png'} onClick={() => this.music()}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/8sin.gif'} onClick={() => this.click("sin(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/9ln.gif'} onClick={() => this.click("ln(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/101.gif'} onClick={() => this.click("1")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/113.gif'} onClick={() => this.click("3")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/125.gif'} onClick={() => this.click("5")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/13:.gif.gif'} onClick={() => this.click("/")}/>
        </div>
        <div className="row">
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/14pi.gif'} onClick={() => this.click("pi")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/15cos.gif'} onClick={() => this.click("cos(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/16log.gif'} onClick={() => this.click("log(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/177.gif'} onClick={() => this.click("7")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/189.gif'} onClick={() => this.click("9")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/190.gif'} onClick={() => this.click("0")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/20x.gif'} onClick={() => this.click("x")}/>
        </div>
        <div className="row">
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/21e.gif'} onClick={() => this.click("e")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/22tan.gif'} onClick={() => this.click("tan(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/23sqrt.gif'} onClick={() => this.click("sqrt(")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/242.gif'} onClick={() => this.click("2")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/254.gif'} onClick={() => this.click("4")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/266.gif'} onClick={() => this.click("6")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/27-.gif'} onClick={() => this.click("-")}/>
        </div>
        <div className="row">
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/28ans.gif'} onClick={() => this.click(this.answer)}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/29exp.png'} onClick={() => this.click("*10^")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/30^.gif'} onClick={() => this.click("^")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/318.gif'} onClick={() => this.click("8")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/32..gif'} onClick={() => this.click(".")}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/33=.png'} onClick={() => this.evaluate()}/>
          <img alt="" src={process.env.PUBLIC_URL + '/engcalc/34+.gif'} onClick={() => this.click("+")}/>
        </div>
        <div className="row">
          Built by Howard Halim, William Zhao and Carol Chen
          <br/>
          Constants:
          <ul>
            <li>Pi (3.14)</li>
            <li>Phi(1.618)</li>
            <li>e(2.718)</li>
            <li>Gamma, Euler–Mascheroni constant(0.577)</li>
            <li>Alpha, Fine-structure constant (0.007297)</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Engcalc;
