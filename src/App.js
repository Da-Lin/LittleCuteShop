import Authentication from "./components/authentication/signin";
// import Register from "./components/authentication/register";
import Bar from "./components/appbar/appBar";
import Home from "./components/home/home";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import React from "react";
import Logout from "components/authentication/logout";
import ForgotPassword from "components/authentication/forgotPassword";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Authentication />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    // {
    //   path: "/register",
    //   element: <Register />,
    // },
    {
      path: "/home",
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Bar />
      {routesElement}
    </AuthProvider>
  );
}

export default App;