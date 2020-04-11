import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 
import Masonry from 'react-masonry-component';

import Zero from '../img/modelling/Kaylens/beige lounge/_DSF1145-Edwebit.jpg';
import One from '../img/modelling/Kaylens/beige lounge/_DSF1048-Edwebit.jpg';
import Two from '../img/modelling/Kaylens/beige lounge/_DSF1109-Ediweb.jpg';
import Three from '../img/modelling/Kaylens/beige lounge/_DSF1122-Editwebjpg.jpg';
import Four from '../img/modelling/Kaylens/beige lounge/_DSF1106-Edwebit.jpg';
import Five from '../img/modelling/Eileen Carter/wood room/dikdi.jpg';
import Six from '../img/modelling/Eileen Carter/wood room/2-735A8439.JPG';
import Seven from '../img/modelling/Eileen Carter/wood room/ntm.jpg';
import Eight from '../img/modelling/Kaylens/black pole/DSCF9403-Edit-Ediwebt.jpg';
import Nine from '../img/modelling/Kaylens/black pole/DSCF9178-Editweb.jpg';
import Ten from '../img/modelling/Kaylens/black pole/DSCF9185-Edit1200.jpg';
import Eleven from '../img/modelling/Eileen Carter/window/aoeao.jpg';
import Twelve from '../img/modelling/Eileen Carter/window/ntm.jpg';
import Thirteen from '../img/modelling/Eileen Carter/window/rpg,.jpg';
import Fourteen from '../img/modelling/Anatoli Sviajine/hammock/4.jpg';
import Fifteen from '../img/modelling/Anatoli Sviajine/hammock/5.jpg';
import Sixteen from '../img/modelling/Anatoli Sviajine/hammock/2.jpg';
import Seventeen from '../img/modelling/Anatoli Sviajine/hammock/3.jpg';
import Eighteen from '../img/modelling/Anatoli Sviajine/hammock/1.jpg';
import Nineteen from '../img/modelling/Kaylens/blue lounge/4.jpg';
import Twenty from '../img/modelling/Kaylens/blue lounge/5.jpg';
import Twentyone from '../img/modelling/Kaylens/blue lounge/2.jpg';
import Twentytwo from '../img/modelling/Kaylens/blue lounge/3.jpg';
import Twentythree from '../img/modelling/Kaylens/blue lounge/1.jpg';
import Twentyfour from '../img/modelling/Anatoli Sviajine/silhouette/_DSC7737.JPG';
import Twentyfive from '../img/modelling/Anatoli Sviajine/silhouette/_DSC7802_1000.jpg';
import Twentysix from '../img/modelling/Anatoli Sviajine/silhouette/_DSC7799.jpg';
import Twentyseven from '../img/modelling/Peter Yeung/outdoor lolli/A7304903-Edit.jpg';
import Twentyeight from '../img/modelling/Peter Yeung/outdoor lolli/A7304915-Edit.jpg';
import Twentynine from '../img/modelling/Peter Yeung/outdoor lolli/A7304916.jpg';
import Thirty from '../img/modelling/Peter Yeung/outdoor lolli/A7304935.jpg';
import Thirtyone from '../img/modelling/Peter Yeung/outdoor lolli/A7304932.jpg';
import Thirtytwo from '../img/modelling/Anatoli Sviajine/light painting/m.jpg';
import Thirtythree from '../img/modelling/Anatoli Sviajine/light painting/_DSC7713.JPG';
import Thirtyfour from '../img/modelling/Anatoli Sviajine/light painting/t.jpg';
import Thirtyfive from '../img/modelling/Anatoli Sviajine/light painting/r.jpg';
import Thirtysix from '../img/modelling/Anatoli Sviajine/light painting/cc.jpg';
const images = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Eleven, Twelve, Thirteen, Fourteen, Fifteen, Sixteen, Seventeen, Eighteen, Nineteen, Twenty, Twentyone, Twentytwo, Twentythree, Twentyfour, Twentyfive, Twentysix, Twentyseven, Twentyeight, Twentynine, Thirty, Thirtyone, Thirtytwo, Thirtythree, Thirtyfour, Thirtyfive, Thirtysix];

const masonryOptions = {
    transitionDuration: 0,
};

export default class Modelling extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }
 
  render() {
    const { photoIndex, isOpen } = this.state;

    const childElements = images.map((pic, i) => {
       return (
          <div 
            className="pic" 
            style={{ "backgroundImage": `url(${pic})`}}
            onClick={() => {this.setState({ isOpen: true, photoIndex: i }); console.log(i)}}
          />
        );
    });
    return (

      <div>
        <Masonry
          className={'wrap'} // default ''
          options={masonryOptions} 
        >
          {childElements}
        </Masonry>
 
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}