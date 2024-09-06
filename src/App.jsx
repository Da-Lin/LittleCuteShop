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
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import UserDashboard from "./components/user/userDashboard";
import OrderProcess from "./components/order/orderProcess";
import Cart from "./components/order/cart";
import { OrderProvider } from "./contexts/orderContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Orders from "./components/order/orders";
import OrderTabs from "./components/order/orderTabs";

const THEME = responsiveFontSizes(createTheme({
  typography: {
    "fontFamily": `"kaiti", "Roboto", "Helvetica", "Arial", sans-serif`,
    "fontSize": 18,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    button: {
      textTransform: 'none'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1636,
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#90caf9'
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          '&:hover': {
            backgroundColor: '#54A7F7'
          },
        }),
      },
    },
  }
}));

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
      path: "/orderprocess",
      element: <OrderProcess />,
    },
    {
      path: "/orders",
      element: <OrderTabs />,
    },
    {
      path: "/cart",
      element: <Cart />,
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
      path: "/userdashboard/*",
      element: <UserDashboard />,
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <OrderProvider>
          <AuthProvider>
            <Bar />
            {routesElement}
          </AuthProvider>
        </OrderProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;