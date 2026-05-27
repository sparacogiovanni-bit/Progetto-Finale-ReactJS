import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search/${search}`);
    setSearch("");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
      

      <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        Reactor
      </h1>


      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Cerca i giochi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-l-md text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white w-64"
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded-r-md font-semibold hover:bg-gray-200 transition"
        >
          Cerca
        </button>
      </form>
    </nav>
  );
}