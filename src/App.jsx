import Authentication from "./components/authentication/signin";
// import Register from "./components/authentication/register";
import Bar from "./components/appbar/appBar";
import Home from "./components/home/home";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import React from "react";
import Logout from "./components/authentication/logout";
import ForgotPassword from "./components/authentication/forgotPassword";
import ManageProduct from "./components/product/manageProduct";
import Products from "./components/product/products";
import Product from "./components/product/product";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const THEME = createTheme({
  typography: {
    "fontFamily": `cursive, "kaiti", "Roboto", "Helvetica", "Arial", sans-serif`,
    "fontSize": 15,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  }
});

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/manageproducts",
      element: <ManageProduct />,
    },
    {
      path: "/products",
      element: <Products />,
    },
    {
      path: "/product",
      element: <Product />,
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
    <ThemeProvider theme={THEME}>
      <AuthProvider>
        <Bar />
        {routesElement}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;