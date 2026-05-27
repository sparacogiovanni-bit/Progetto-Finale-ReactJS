import { useLoaderData } from "react-router-dom";
import GameList from "../components/layouts/HomeComponents/GameList";

export default function SearchPage() {
  const games = useLoaderData();

  return (
    <>
      <h1 className="text-center text-2xl font-bold">
        Risultati
      </h1>

      <GameList>
        {games.map((game) => (
          <GameList.Card key={game.id} game={game} />
        ))}
      </GameList>
    </>
  );
}