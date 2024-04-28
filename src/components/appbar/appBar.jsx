import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../assets/logo.png';
import avatar from '../../assets/avatar.jpg';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { isAdmin } from '../../firebase/firestore/authentication';
import MenuList from './menuList';
import { useTranslation } from 'react-i18next';
import AdminMenuList from './adminMenuList';

function Bar() {
    // const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElLanguage, setAnchorElLanguage] = React.useState(null);

    const { userLoggedIn, isAdminUser } = useAuth()

    const { t, i18n } = useTranslation()
    const languages = { zh: t("zh"), en: t("en") };

    const menus = userLoggedIn ? { '小可爱精选': [{ link: 'products', name: '产品展示' }] } : {};
    const settings = { logout: t("appBar").settings.logout };

    const navigate = useNavigate();

    // const handleOpenNavMenu = (event) => {
    //     setAnchorElNav(event.currentTarget);
    // };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenLanguageMenu = (event) => {
        setAnchorElLanguage(event.currentTarget);
    };
    const handleCloseLanguageMenu = (e, lng) => {
        i18n.changeLanguage(lng)
        setAnchorElLanguage(null);
    };

    // const handleCloseNavMenu = (e, link) => {
    //     navigate(`/${link.toLowerCase().replace(/\s/g, '')}`)
    //     setAnchorElNav(null);
    // };

    // const handleExitNavMenu = (e) => {
    //     setAnchorElNav(null);
    // };

    const handleCloseUserMenu = (e, setting) => {
        if (e.target.innerText) {
            navigate(`/${setting.toLowerCase().replace(/\s/g, '')}`)
        }
        setAnchorElUser(null);
    };

    const handleLoginButtonClicked = (link) => {
        navigate('login')
    };

    return (
        <AppBar position="static">
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
                        {isAdminUser && <AdminMenuList />}
                        <MenuList menus={menus} />
                    </Box>
                    <Box >
                        <Tooltip title="Change Language">
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
                            onClose={handleCloseLanguageMenu}
                        >
                            {Object.keys(languages).map((lng) => (
                                <MenuItem key={lng} onClick={(e) => handleCloseLanguageMenu(e, lng)}>
                                    <Typography textAlign="center">{languages[lng]}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                        {userLoggedIn ?
                            <>
                                <Tooltip title="Edit Profile">
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
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {Object.keys(settings).map((setting) => (
                                        <MenuItem key={setting} onClick={(e) => handleCloseUserMenu(e, setting)}>
                                            <Typography textAlign="center">{settings[setting]}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                            : <Button color="inherit" onClick={handleLoginButtonClicked}>{t("login")}</Button>}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Bar;