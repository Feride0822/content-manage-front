import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/Layout";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Notification from "../pages/Notification";
import Profile from "../pages/Profile";
import Logut from "../pages/Logut";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/login", element: <Login />,
    },
    {
      path: "/register", element: <Register />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "chat", element: <Chat /> },
        { path: "notification", element: <Notification /> },
        { path: "explore", element: <Explore /> },
        { path: "profile", element: <Profile /> },
        { path: "log-out", element: <Logut /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRouter;
