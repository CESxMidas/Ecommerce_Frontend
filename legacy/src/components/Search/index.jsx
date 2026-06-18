import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import "./index.css";

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = query.trim();
    const params = new URLSearchParams();

    if (trimmed) {
      params.set("q", trimmed);
    }

    navigate(
      `/productListing${params.toString() ? `?${params.toString()}` : ""}`
    );
  };

  return (
    <form className="searchBox" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products..."
        className="searchBox__input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button type="submit" className="searchBox__btn">
        <IoMdSearch className="text-[18px]" />
        <span>Search</span>
      </button>
    </form>
  );
};

export default SearchBox;
