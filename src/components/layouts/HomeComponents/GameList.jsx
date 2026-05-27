import GameCard from "./GameCard";

export default function GameList({ children }) {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-5 py-6">
      {children}
    </main>
  );
}

GameList.Card = GameCard;