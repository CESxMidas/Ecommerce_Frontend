import { useRef, useState } from "react";
import "./index.css";
const ProductZoom = ({ image }) => {
  const imageRef = useRef(null);
  const [backgroundPosition, setBackgroundPosition] = useState("50% 50%");
  const [showZoom, setShowZoom] = useState(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };
  return (
    <div className="productZoomWrapper">
      {/* MAIN IMAGE */}
      <div
        className="productZoomImage"
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
      >
        <img src={image} alt="product" />
      </div>

      {/* ZOOM PANEL */}
      {showZoom && (
        <div
          className="zoomResult"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition,
          }}
        />
      )}
    </div>
  );
};

export default ProductZoom;
