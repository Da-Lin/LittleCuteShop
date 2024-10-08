import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/authContext";

const OrderProcess = () => {
    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    const { t, i18n } = useTranslation()
    const isChinese = i18n.language === 'zh'

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/home')
        }
    })

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
            <Typography color="secondary" pt={2} width={1000}>{t("appBar").menuList.orderProcess.pickUpNote}</Typography>
        </Grid>
    )
};

export default OrderProcess;