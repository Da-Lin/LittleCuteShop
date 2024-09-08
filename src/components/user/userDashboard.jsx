import React from "react";
import Contact from "./contact";
import About from "./feedback";
import { useNavigate, useRoutes } from "react-router-dom";
import { Box } from "@mui/material";

import UserDrawer from "./drawer";
import Security from "./security";
import { useAuth } from "../../contexts/authContext";
import { useEffect } from "react";

export default function UserDashboard() {

    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/home')
        }
    })

    const routesArray = [
        {
            path: "about",
            element: <About />,
        },
        {
            path: "contact",
            element: <Contact />,
        },
        {
            path: "*",
            element: <Security />,
        },
    ];
    let routesElement = useRoutes(routesArray);
    return (
        <Box sx={{ display: 'flex' }}>
            <UserDrawer />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {routesElement}
            </Box>
        </Box>
    );
}
