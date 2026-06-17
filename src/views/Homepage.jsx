import { useLoaderData } from "react-router-dom";
import GameList from "../components/layouts/HomeComponents/GameList";

export default function Homepage() {
  const games = useLoaderData();

  return (
    <>
      <h1 className="font-electro text-3xl text-center font-bold">
        Games
      </h1>

      <GameList>
        {games.map((game) => {
          return (
            <GameList.Card
              key={game.id}
              game={game}
            />
          );
        })}
      </GameList>
    </>
  );
}