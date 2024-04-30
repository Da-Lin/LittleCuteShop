import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import avatar from '../../assets/avatar.jpg';

export default function UserProfileMenus() {

    const [anchorEl, setAnchorEl] = useState(null);

    const { t } = useTranslation()
    const menus = { userdashboard: t("appBar").userProfileMenus.userDashboard, logout: t("appBar").userProfileMenus.logout };

    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (e, link) => {
        if (e.target.innerText) {
            navigate(`/${link}`)
        }
        setAnchorEl(null);
    };

    return (<>
        <>
            <Tooltip title={t('appBar').editProfile}>
                <IconButton size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit" onClick={handleOpenUserMenu} >
                    <Avatar alt="User Name" src={avatar} />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                {Object.keys(menus).map((link) => (
                    <MenuItem key={link} onClick={(e) => handleCloseMenu(e, link)}>
                        <Typography textAlign="center">{menus[link]}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    </>)
}