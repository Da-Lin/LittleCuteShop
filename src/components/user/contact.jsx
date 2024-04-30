import { Grid, Typography } from "@mui/material";
import React from "react";
import qr from '../../assets/qr.jpg';

const Contact = () => {
    return (
        <Grid container justifyContent="center" direction="column"
            alignItems="center">
            <Typography pt={2}>请扫描下方二维码添加客服微信</Typography>
            <Grid item pt={5}
                component="img"
                sx={{
                    height: '50vh',
                    '&:hover': {
                        cursor: 'pointer',
                    }
                }}
                alt="qr"
                src={qr}
            />
        </Grid>
    )
};

export default Contact;
