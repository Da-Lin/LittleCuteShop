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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import MenuList from './menuList';
import { useTranslation } from 'react-i18next';
import AdminMenuList from './adminMenuList';
import UserProfileMenus from './userProfileMenus';

function Bar() {
    // const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElLanguage, setAnchorElLanguage] = React.useState(null);

    const { userLoggedIn, userInfo } = useAuth()
    const welcomeText = userLoggedIn ? "Hello " + userInfo.name ? userInfo.name : userInfo.email : ""

    const { t, i18n } = useTranslation()
    const languages = { zh: t("zh"), en: t("en") };

    const navigate = useNavigate();

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

    const handleLoginButtonClicked = (link) => {
        navigate('login')
    };

    return (
        <AppBar position="relative" sx={{ minWidth: 750, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
                    {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleExitNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {
                                Object.keys(menus).map((menu) => (
                                    menus[menu].map(option => (
                                        <MenuItem key={option.link} onClick={(e) => handleCloseNavMenu(e, option.link)}>
                                            <Typography textAlign="center">{option.name}</Typography>
                                        </MenuItem>
                                    ))
                                ))
                            }
                        </Menu>
                    </Box> */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
                        {userLoggedIn && userInfo.isAdmin && <AdminMenuList />}
                        <MenuList />
                        {userLoggedIn && <MenuItem onClick={() => navigate('orderprocess')}>
                            {t('appBar').menuList.orderProcess.name}
                        </MenuItem>}
                    </Box>
                    <Box >
                        <Tooltip title={t('appBar').changeLanguage}>
                            <IconButton size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
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
                        <Typography display="inline" sx={{ display: { xs: 'none', md:'inline' } }}>{userLoggedIn ? `Hello, ${userInfo.name ? userInfo.name : userInfo.email}` : ""}</Typography>
                        {userLoggedIn ? <UserProfileMenus />
                            : <Button color="inherit" onClick={handleLoginButtonClicked}>{t("login")}</Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Bar;