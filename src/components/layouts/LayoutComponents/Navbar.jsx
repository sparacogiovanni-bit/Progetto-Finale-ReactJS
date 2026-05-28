import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
  e.preventDefault();

  if (!search.trim()) return;

  const slug = search
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  navigate(`/search/${slug}`);
  setSearch("");
};
  
  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
    
    
    <Link
    to="/"
    className="text-3xl font-electro cursor-pointer"
    >
    Reactor
    </Link>
    
    
    <div className="flex items-center gap-3">
    
    
    <form
    onSubmit={handleSearch}
    className="flex items-center"
    >
    <input
    type="text"
    placeholder="Cerca i giochi..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
              input
              input-bordered
              rounded-r-none
              w-64
              bg-nav-gray
              text-white
              placeholder-white
              border-gray-700
              focus:outline-none
            "
    />
    
    <button
    type="submit"
    className="btn btn-square rounded-l-none bg-nav-dark border-gray-700 hover:bg-gray-700 text-white"
    >
    <FaSearch />
    </button>
    </form>
    
    
    <img
    src="https://i.pravatar.cc/40"
    alt="profile"
    className="w-10 h-10 rounded-full border border-gray-500"
    />
    </div>
    </nav>
  );
}