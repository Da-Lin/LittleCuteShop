import { Grid } from "@mui/material";
import React from "react";
import logo from '../../assets/logo.png';

export default function LogoSide() {

    return (
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage: `url(${logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: '70%',
                backgroundPosition: 'center',
            }}
        />
    )
}