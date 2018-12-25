import React from 'react';

import Typist from 'react-typist';

class Signature extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      typing: true
    }
  }
done = () => {
  this.setState({ typing: false }, () => {
    this.setState({ typing: true })
  });
}

  render() {
    return (
      <div>
        <div className="triangle" />
        {this.state.typing
            ? <Typist className="signature" avgTypingDelay={40} onTypingDone={this.done}>
              <span>Dvorak User</span>
              <Typist.Backspace count={11} delay={200} />
              <span>Pole Dancer and Aerialist</span>
              <Typist.Backspace count={25} delay={200} />
              <span>Wizard™</span>
              <Typist.Backspace count={7} delay={200} />
              <span>Hackathon Organizer</span>
              <Typist.Backspace count={19} delay={200} />
              <span>Ski Instructor</span>
              <Typist.Backspace count={14} delay={200} />
              <span>Carol Chen</span>
              <Typist.Backspace count={12} delay={200} />
              </Typist>
            : ''
          }

      </div>
    );
  }
}

export default Signature;
