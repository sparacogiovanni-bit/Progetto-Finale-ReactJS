import { useLoaderData, useParams } from "react-router-dom";
import GameList from "../components/layouts/HomeComponents/GameList";

export default function SearchPage() {
  const games = useLoaderData();
  const { slug } = useParams();

  return (
    <>
      <h1 className="text-center text-2xl font-electro">
        Results for "{slug}"
      </h1>

      <GameList>
        {games.map((game) => (
          <GameList.Card key={game.id} game={game} />
        ))}
      </GameList>
    </>
  );
}