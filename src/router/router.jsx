import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/layouts/Layout";
import AuthenticationLayout from "../components/layouts/LayoutComponents/AuthenticationLayout";

import Homepage from "../views/Homepage";
import SearchPage from "../views/SearchPage";
import GenrePage from "../views/GenrePage";
import DetailPage from "../views/DetailPage";

import LoginPage from "../views/auth/LoginPage";
import RegisterPage from "../views/auth/RegisterPage";
import ProfilePage from "../views/auth/ProfilePage";
import ProfileSettingsPage from "../views/auth/ProfileSettingsPage";

import routes from "./routes";

import {
  getAllGamesLoader,
  searchGamesLoader,
  getAllGenres,
  getFilteredByGenreGames,
  getGameDetails,
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
      {
        path: routes.detail,
        Component: DetailPage,
        loader: getGameDetails,
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
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "profile/settings",
        Component: ProfileSettingsPage,
      },
    ],
  },
]);

export default router;