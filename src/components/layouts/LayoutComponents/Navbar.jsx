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
    <nav className="bg-nav-bluegray text-white px-4 py-4 flex items-center justify-between gap-3">
    
    
    <Link
    to="/"
    className="text-3xl font-electro cursor-pointer"
    >
    Reactor
    </Link>
    
    
    <div className="flex items-center gap-2 flex-1 justify-end">
    
    
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
    w-full
    max-w-[160px]
    sm:max-w-xs
    bg-nav-bluegray
    text-white
    placeholder-white
    border-gray-700
    focus:outline-none
    font-electro
            "
    />
    
    <button
    type="submit"
    className="btn btn-square rounded-l-none bg-nav-bluegray border-gray-700 hover:bg-gray-700 text-white"
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