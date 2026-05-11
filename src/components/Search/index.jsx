import { IoMdSearch } from "react-icons/io";
import "./index.css";
const SearchBox = () => {
  return (
    <div className="flex w-full">
      <input
        type="text"
        placeholder="Search products..."
        className="flex-1 px-3 py-2 text-sm bg-[var(--card)] border border-[var(--border)] outline-none"
      />

      <button className="px-4 flex items-center gap-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition">
        <IoMdSearch />
        Search
      </button>
    </div>
  );
};

export default SearchBox;
