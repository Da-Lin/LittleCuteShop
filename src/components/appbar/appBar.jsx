import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../assets/logo.png';
import LanguageIcon from '@mui/icons-material/Language';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import MenuList from './menuList';
import { useTranslation } from 'react-i18next';
import AdminMenuList from './adminMenuList';
import UserProfileMenus from './userProfileMenus';
import MenuListXS from './menuListXS';
import { Badge } from '@mui/material';
import { useEffect } from 'react';
import { getCart } from '../../firebase/firestore/order';
import { useState } from 'react';

function Bar() {
    // const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElLanguage, setAnchorElLanguage] = React.useState(null);

    const { userLoggedIn, userInfo } = useAuth()

    const { t, i18n } = useTranslation()
    const languages = { zh: t("zh"), en: t("en") };

    const navigate = useNavigate();

    const [userCart, setUserCart] = useState([])
    const [isLoadingCart, setIsLoadingCart] = useState([])

    useEffect(() => {
        setIsLoadingCart(true)
        async function getUserCart() {
            await getCart().then((cart) => {
                setIsLoadingCart(false)
                setUserCart(cart)
            }).catch((error) => {
                setIsLoadingCart(false)
                console.log(error)
            })
        }
        getUserCart()
    }, [userCart])

    // const handleOpenNavMenu = (event) => {
    //     setAnchorElNav(event.currentTarget);
    // };

    const handleOpenLanguageMenu = (event) => {
        setAnchorElLanguage(event.currentTarget);
    };

    const handleCloseLanguageMenu = (e, lng) => {
        if (lng) {
            i18n.changeLanguage(lng)
        }
        setAnchorElLanguage(null);
    };

    // const handleCloseNavMenu = (e, link) => {
    //     navigate(`/${link.toLowerCase().replace(/\s/g, '')}`)
    //     setAnchorElNav(null);
    // };

    // const handleExitNavMenu = (e) => {
    //     setAnchorElNav(null);
    // };


    return (
        <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        sx={{
                            height: '100%',
                            width: 50,
                            '&:hover': {
                                cursor: 'pointer',
                            }
                        }}
                        alt="logo"
                        src={logo}
                        onClick={() => navigate('/home')}
                    />
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <MenuListXS />
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {userLoggedIn && userInfo.isAdmin && <AdminMenuList />}
                        <MenuList />
                        {userLoggedIn && <MenuItem onClick={() => navigate('orderprocess')}>
                            {t('appBar').menuList.orderProcess.name}
                        </MenuItem>}
                    </Box>
                    <Box >
                        <Tooltip title={t('appBar').changeLanguage}>
                            <IconButton size="large"
                                color="inherit" onClick={handleOpenLanguageMenu} >
                                <LanguageIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElLanguage}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElLanguage)}
                            onClose={e => handleCloseLanguageMenu(e, null)}
                        >
                            {Object.keys(languages).map((lng) => (
                                <MenuItem key={lng} onClick={(e) => handleCloseLanguageMenu(e, lng)}>
                                    <Typography >{languages[lng]}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                        {userLoggedIn ?
                            <Box display="inline">
                                <Tooltip title={t('appBar').cart}>
                                    <IconButton size="large"
                                        color="inherit" onClick={() => { navigate('cart') }} >
                                        <Badge badgeContent={userCart && Object.keys(userCart).length} color="secondary">
                                            <ShoppingCartIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <Typography sx={{ display: { xs: 'none', md: 'inline' } }}>{userLoggedIn ? `Hello, ${userInfo.name ? userInfo.name : userInfo.email}` : ""}</Typography>
                                <UserProfileMenus />
                            </Box>
                            : <Button color="inherit" onClick={() => { navigate('login') }}>{t("login")}</Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}
export default Bar;