import { IoMdSearch } from "react-icons/io";

import "./index.css";

const SearchBox = () => {
  return (
    <div className="searchBox">
      {/* INPUT */}
      <input
        type="text"
        placeholder="Search products..."
        className="searchBox__input"
      />

      {/* BUTTON */}
      <button className="searchBox__btn">
        <IoMdSearch className="text-[18px]" />

        <span>Search</span>
      </button>
    </div>
  );
};

export default SearchBox;