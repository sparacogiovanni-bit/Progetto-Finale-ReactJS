import { useLoaderData, useParams } from "react-router-dom";
import GameList from "../components/layouts/HomeComponents/GameList";

export default function GenrePage() {
  const games = useLoaderData();
  const { slug } = useParams();

  const key = slug?.toLowerCase().replace(/-/g, " ").trim();

  return (
    <>
      <h1 className="text-center font-electro text-3xl mt-10">
        Genre: {slug}
      </h1>

      <GameList>
        {games.map((game) => {
          return <GameList.Card key={game.id} game={game} />;
        })}
      </GameList>
    </>
  );
}