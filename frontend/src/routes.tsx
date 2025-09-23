import type { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Test from "./pages/sample/Test";
import Users from "./pages/sample/Users";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sample/test/*",
    element: <Test />,
  },
  {
    path: "/sample/users",
    element: <Users />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
