import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import { LazyImage } from "react-lazy-images";

import lyraMedia from './LyraMedia.js';

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      
  };

};

class Lyra extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      currentImage: 0,
      photos: lyraMedia.slice(0, 9), 
      pageNum: 1,
      totalPages: lyraMedia.length / 3,
      loadedAll: false
    }; 
    this.handleScroll = this.handleScroll.bind(this);
    this.loadMorePhotos = this.loadMorePhotos.bind(this);
    this.loadMorePhotos = debounce(this.loadMorePhotos, 200);

    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
  }

  componentDidMount() {
    document.title = 'Lyra Dance';
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
      this.loadMorePhotos();
    }
  }

  loadMorePhotos() {
    console.log("loading more")
    if (this.state.pageNum >= this.state.totalPages) {
      this.setState({
        loadedAll: true,
      });
      return;
    }
    const numPhotos = this.state.photos.length;
    this.setState({
      photos: lyraMedia.concat(lyraMedia.slice(numPhotos, numPhotos + 3)),
      pageNum: this.state.pageNum + 1,
    });

  }

  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    });
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  render() {
    return (
      <div className="Lyra">
        <main> 
          <h2 className="section-eading">Lyra / Aerial Hoop</h2>
          <Gallery 
            photos={this.state.photos} 
            columns={3} 
            onClick={this.openLightbox}

            />
          <Lightbox images={lyraMedia}
            onClose={this.closeLightbox}
            onClickPrev={this.gotoPrevious}
            onClickNext={this.gotoNext}
            currentImage={this.state.currentImage}
            isOpen={this.state.lightboxIsOpen}
          />
        </main>
      </div>
    );
  }
}

export default Lyra;
