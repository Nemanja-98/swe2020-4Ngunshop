import React from "react";

//import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function SlideEffect(props) {
  const slideImages = [
    props.img[0],
    props.img[1],
    props.img[2],
  ];
  return (
    <Carousel  className="Carousel">
      <div>
        <img src={slideImages[0]} alt="prvaSlika Carousel" />
        {/*<p className="legend"></p>*/}
      </div>
      <div>
        <img src={slideImages[1]} alt="drugaSlika Carousel" />
        {/*<p className="legend"></p>*/}
      </div>
      <div>
        <img src={slideImages[2]} alt="trecaSlika Carousel" />
        {/*<p className="legend"></p>*/}
      </div>
    </Carousel>
  );
}
export default SlideEffect;