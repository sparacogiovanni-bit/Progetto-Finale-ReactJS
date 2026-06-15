import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <Link to={`/detail/${game.id}`}>
      <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition duration-300"
        />

        <div className="absolute inset-0 flex items-end p-4">
          <p className="text-white text-xl font-bold">
            {game.name}
          </p>
        </div>
      </div>
    </Link>
  );
}