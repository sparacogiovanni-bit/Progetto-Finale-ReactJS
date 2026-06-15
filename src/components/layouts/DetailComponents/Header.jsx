export default function Header({ game }) {
  return (
    <header className="pt-10 text-nav-gray">
      <h1 className="text-center text-5xl font-electro mb-2 font-bold">
        {game.name}
      </h1>

      <h2 className="text-center text-2xl font-electro">
        Released on: <span className="font-bold">{game.released}</span>
      </h2>

      <section className="grid grid-cols-2 gap-4 mt-10">
        <article className="px-10">
          <p>{game.description_raw}</p>
        </article>

        <article className="text-center">
          <p className="text-xl mb-5">
            <span className="font-bold">Rating:</span> {game.rating}
          </p>

          <p className="text-xl font-bold">Genres:</p>

          <ul className="flex justify-center">
            {game.genres.map((genre) => {
              return (
                <li className="mx-3" key={genre.id}>
                  {genre.name}
                </li>
              );
            })}
          </ul>
        </article>
      </section>
    </header>
  );
}