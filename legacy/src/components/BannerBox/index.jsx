import { Link } from "react-router-dom";
import "./index.css";
const BannerBox = (props) => {
  return (
    <div className="bannerBox overflow-hidden rounded-[18px] group relative">
      <Link to={props.link}>
        {/* IMAGE */}
        <img
          src={props.img}
          alt="banner"
          className="
            w-full
            h-[190px]
            object-cover
            transition-all
            duration-500
            group-hover:scale-110
          "
        />
        {/* OVERLAY */}
        <div className="bannerOverlay"></div>
        {/* CONTENT */}
        <div className="bannerContent">
          <span>Smart Deals</span>
          <h3>Trending Smartphones</h3>
          <p>Exchange Available*</p>

          <button>Shop Now</button>
        </div>
      </Link>
    </div>
  );
};

export default BannerBox;