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
    `https://api.rawg.io/api/games?key=${import.meta.env.VITE_API_KEY}&search=${(params.slug)}&page_size=28`
  );

  const json = await promise.json();
  return json.results;
}