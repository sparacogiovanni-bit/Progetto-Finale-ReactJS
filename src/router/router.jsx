import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import Homepage from "../views/Homepage";
import SearchPage from "../views/SearchPage";
import routes from "./routes";
import { getAllGamesLoader, searchGamesLoader } from "./loaders";

const router = createBrowserRouter([
  {
    path: routes.home,
    Component: Layout,
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
    ],
  },
]);

export default router;