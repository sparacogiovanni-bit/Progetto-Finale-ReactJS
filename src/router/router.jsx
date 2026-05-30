import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import Homepage from "../views/Homepage";
import SearchPage from "../views/SearchPage";
import GenrePage from "../views/GenrePage";
import routes from "./routes";
import AuthenticationLayout from "../components/layouts/LayoutComponents/AuthenticationLayout";
import LoginPage from "../views/auth/LoginPage";
import RegisterPage from "../views/auth/RegisterPage";

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
  
  {
    path: "/auth",
    Component: AuthenticationLayout,
    
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
    ],
  },
]);

export default router;