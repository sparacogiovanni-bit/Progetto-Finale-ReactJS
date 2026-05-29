import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import Homepage from "../views/Homepage";
import SearchPage from "../views/SearchPage";
import GenrePage from "../views/GenrePage";
import routes from "./routes";
import {
  getAllGamesLoader,
  searchGamesLoader,
  getAllGenres,
  getFilteredByGenreGames,
} from "./loaders";

const router = createBrowserRouter([
  {
    path: routes.home,
    Component: Layout,
    loader: getAllGenres,

    children: [
      {
        index: true,
        Component: Homepage,
        loader: getAllGamesLoader,
      },

      {
        path: routes.search,
        Component: SearchPage,
        loader: searchGamesLoader,
      },

      {
        path: routes.genre,
        Component: GenrePage,
        loader: getFilteredByGenreGames,
      },
    ],
  },
]);

export default router;