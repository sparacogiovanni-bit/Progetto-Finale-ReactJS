export async function getAllGamesLoader() {
  const promise = await fetch(
    `https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&dates=2024-01-01,2024-12-30&page_size=28`
  );

  const json = await promise.json();
  return json.results;
}

export async function searchGamesLoader({ params }) {

  const query = params.slug.replace(/-/g, " ");

  const promise = await fetch(
    `https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&search=${query}&page_size=28`
  );

  const json = await promise.json();
  return json.results;
}

export async function getAllGenres() {
  const promise = await fetch(`https://api.rawg.io/api/genres?key=${import.meta.env.VITE_API_KEY}`
  );

  const json = await promise.json();
  return json.results;
}

export async function getFilteredByGenreGames({ params }) {
  const promise = await fetch(
    `https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&genres=${params.slug}`
  );

  const json = await promise.json();
  return json.results;
}