import React, { Component } from 'react';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import InfiniteScroll from 'react-infinite-scroller';
import lyraMedia from './LyraMedia.js';

class InfiniteScrollWorking extends InfiniteScroll { 
}

class Lyra extends Component {

  constructor(props) {
    super(props);
    this.state = { currentImage: 0 };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.state = {
      photos: [],
      hasMoreItems: true,
      currIdx: 0,
      initialLoad: true,
    }
  }

  componentDidMount () {
    document.title = "Lyra Dance";
  }

  loadItems(page) {
    if(this.state.currIdx < lyraMedia.length){
      let newIdx = Math.min((page + 1) * 3, lyraMedia.length); 
      const newPhotos = lyraMedia.slice(0, newIdx);
      this.setState({
        photos: newPhotos,
        currIdx: newIdx,
        initialLoad: false
      }); 
    } else {
      this.setState({ hasMoreItems: false }); 
    }
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
    const photos = this.state.photos; 
    return (
      <div className="Lyra">
        <main> 
          <h2 className="section-eading">Lyra / Aerial Hoop</h2>
          <InfiniteScrollWorking
            threshold={window.innerHeight}
            initialLoad={this.state.initialLoad}
            loadMore={(page) => this.loadItems(page)}
            hasMore={this.state.hasMoreItems}
            pageStart={Math.floor(window.innerHeight / (window.innerWidth * 0.8 / 3 )) - 1}
            loader={<div className="loader" key={0}>Loading ...</div>}
            threshold={100}
          >
            <Gallery photos={photos} columns={3} onClick={this.openLightbox} />
          </InfiniteScrollWorking>
          <Lightbox images={photos}
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
