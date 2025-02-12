import React, { useState, useEffect } from "react";
import "../StyleCSS/Slider.css";

import slider1 from "../Images/slider-1.svg";
import slider2 from "../Images/slider-2.png";
import slider3 from "../Images/slider-3.jpg";
import slider4 from "../Images/slider-4.avif";

const images = [slider1, slider2, slider3, slider4];

function Slider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={i === index ? "active" : ""}
        />
      ))}
    </div>
  );
}

export default Slider;
