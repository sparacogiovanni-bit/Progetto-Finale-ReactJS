import { useLoaderData, useParams } from "react-router-dom";
import GameList from "../components/layouts/HomeComponents/GameList";

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

export default function GenrePage() {
  const games = useLoaderData();
  const { slug } = useParams();

  const key = slug?.toLowerCase().replace(/-/g, " ").trim();

  return (
    <>
      <h1 className="text-center font-electro text-3xl mt-10">
        Filtro per genere: {genreLabels[key] || slug}
      </h1>

      <GameList>
        {games.map((game) => {
          return <GameList.Card key={game.id} game={game} />;
        })}
      </GameList>
    </>
  );
}