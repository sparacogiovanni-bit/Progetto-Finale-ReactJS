import { Link } from "react-router-dom";

export default function Sidebar({ genres }) {
  return (
    <nav
      className="
        overflow-x-auto
        md:overflow-visible
        font-electro
      "
    >
      <ul
        className="
          flex 
          md:flex-col
          gap-2
          p-3
          whitespace-nowrap
        "
      >
        {genres.map((genre) => {
          return (
            <li
              className="flex-shrink-0"
              key={genre.id}
            >
              <Link
                className="
                  block
                  px-3
                  py-2
                  rounded-lg
                  hover:bg-gray-700
                  transition
                  text-white
                "
                to={`/genre/${genre.slug}`}
              >
                {genre.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}