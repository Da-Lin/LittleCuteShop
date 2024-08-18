import { Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

const Cart = () => {

    const { t, i18n } = useTranslation()
    const isChinese = i18n.language === 'zh'

    return (
        <Grid container justifyContent="center" direction="column"
            alignItems="center">
            <Typography pt={2} width={1000}>
                {<Trans
                    i18nKey={t("appBar").menuList.orderProcess.orderWay}
                    values={{ link: isChinese ? "此页面" : "this page" }}
                    components={{ anchor: <Link to={"/userdashboard/contact"} /> }}
                />}
            </Typography>
            <Typography pt={2} width={1000}>{t("appBar").menuList.orderProcess.pickUpLocationSatuday}</Typography>
            <Typography pt={2} width={1000}>{t("appBar").menuList.orderProcess.pickUpTimeSatuday}</Typography>
            <Typography pt={2} width={1000}>{t("appBar").menuList.orderProcess.pickUpLocationOtherDays}</Typography>
            <Typography pt={2} width={1000}>{t("appBar").menuList.orderProcess.pickUpTimeOtherDays}</Typography>
        </Grid>
    )
};

export default Cart;