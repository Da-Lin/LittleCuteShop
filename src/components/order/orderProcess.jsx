import { Grid, Typography } from "@mui/material";
import React from "react";
import qr from '../../assets/qr.jpg';
import { useNavigate } from "react-router-dom";

const OrderProcess = () => {


    return (
        <Grid container justifyContent="center" direction="column"
            alignItems="center">
            <Typography  pt={2} width={500}>订餐方式：联系客服微信或者邮箱</Typography>
            <Typography pt={2} width={500}>自取地点：4401 Fairfax Dr, Arlington, VA 22203</Typography>
            <Typography pt={2} width={500}>取餐时间：除周六外每日11am-8pm </Typography>
        </Grid>
    )
};

export default OrderProcess;