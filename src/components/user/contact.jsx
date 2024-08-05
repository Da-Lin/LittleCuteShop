import { Grid, Typography } from "@mui/material";
import React from "react";
import qr from '../../assets/qr.jpg';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation()
    return (
        <Grid container justifyContent="center" direction="column"
            alignItems="center">
            <Typography pt={2}>{t('drawer').contractUs.title}</Typography>
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
