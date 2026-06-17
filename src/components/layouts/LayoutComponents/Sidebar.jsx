import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ genres }) {
  const location = useLocation();

  return (
    <nav className="overflow-x-auto md:overflow-visible font-electro">
      
      <h2 className="text-xs opacity-50 mt-2 mb-1 text-center md:text-left md:px-5">
          GENRES
        </h2>
      
      <ul className="flex md:flex-col gap-2 p-2 whitespace-nowrap">

        {genres.map((genre) => (
          <li className="flex-shrink-0" key={genre.id}>
            <Link
              className={`block px-3 py-2 rounded-lg transition text-white ${
                location.pathname === `/genre/${genre.slug || genre.id}`
                  ? "bg-primary"
                  : "hover:bg-gray-700"
              }`}
              to={`/genre/${genre.slug || genre.id}`}
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}