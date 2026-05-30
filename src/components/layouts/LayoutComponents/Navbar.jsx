import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";
import routes from "../../../router/routes";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const linkStyle =
    "inline-block px-3 py-2 rounded-lg hover:bg-gray-700 transition text-white font-electro";

  return (
    <nav className="bg-nav-bluegray text-white px-4 py-4 flex items-center justify-between gap-3 relative">
      
  
      <Link to="/" className="text-3xl font-electro cursor-pointer">
        Reactor
      </Link>

  
      <div className="flex items-center gap-3 flex-1 justify-end">

        
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Cerca i giochi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              input input-bordered
              rounded-r-none
              w-full max-w-[140px]
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

        
        <ul className="hidden md:flex items-center gap-3 font-electro">
          <li>
            <Link to={routes.register} className={linkStyle}>
              Registrati
            </Link>
          </li>

          <li>
            <Link to={routes.login} className={linkStyle}>
              Accedi
            </Link>
          </li>
        </ul>

        
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full border border-gray-500"
        />

        
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </div>

      
      {menuOpen && (
        <div className="absolute top-full right-0 w-full bg-nav-bluegray flex flex-col gap-2 p-4 md:hidden z-50">
          
          <Link
            to={routes.register}
            className={linkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Registrati
          </Link>

          <Link
            to={routes.login}
            className={linkStyle}
            onClick={() => setMenuOpen(false)}
          >
            Accedi
          </Link>
        </div>
      )}
    </nav>
  );
}