import { Link } from "react-router-dom";

const genreLabels = {
  action: "Azione",
  indie: "Indie",
  adventure: "Avventura",
  rpg: "GDR",
  strategy: "Strategia",
  shooter: "Sparatutto",
  casual: "Casual",
  simulation: "Simulazione",
  puzzle: "Puzzle",
  arcade: "Arcade",
  platformer: "Platform",
  "massively multiplayer": "Multigiocatore Massivo",
  racing: "Corse",
  sports: "Sport",
  fighting: "Picchiaduro",
  family: "Famiglia",
  "board games": "Giochi da Tavolo",
  card: "Carte",
  educational: "Educativi",
};

export default function Sidebar({ genres }) {
  return (
    <nav className="overflow-x-auto md:overflow-visible font-electro">
      <ul className="flex md:flex-col gap-2 p-3 whitespace-nowrap">
        {genres.map((genre) => {
          const key = genre.name?.toLowerCase().trim().replace(/\s+/g, " ");

          return (
            <li className="flex-shrink-0" key={genre.id}>
              <Link
                className="block px-3 py-2 rounded-lg hover:bg-gray-700 transition text-white"
                to={`/genre/${genre.slug || genre.id}`}
              >
                {genreLabels[key] || genre.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}