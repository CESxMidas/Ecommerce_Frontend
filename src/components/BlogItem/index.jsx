import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import "./index.css";
const BlogItem = ({ item }) => {
  return (
    <div className="blogItem group">
      {/* IMAGE */}
      <Link
        to={`/blog/${item.id}`}
        className="blogImageWrapper"
      >
        <img
          src={item.image}
          alt={item.title}
          className="blogImage"
        />
        <div className="blogOverlay"></div>
        <span className="blogCategory">
          {item.category}
        </span>
      </Link>
      {/* CONTENT */}
      <div className="blogContent">
        {/* DATE */}
        <div className="blogMeta">
          <FaCalendarAlt />
          <span>{item.date}</span>
        </div>
        {/* TITLE */}
        <Link to={`/blog/${item.id}`}>
          <h3>
            {item.title}
          </h3>
        </Link>
        {/* DESCRIPTION */}
        <p>
          {item.description}
        </p>
        {/* BUTTON */}
        <Link
          to={`/blog/${item.id}`}
          className="readMoreBtn"
        >
          Read More
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;