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
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/authContext';
import { isAdminUser } from '../../firebase/firestore/authentication';
import { Link } from '@mui/material';
import MenuList from './menuList';

function Bar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const { userLoggedIn, userPrivileges } = useAuth()

    const menus = userLoggedIn ? isAdminUser(userPrivileges) ? { 'Admin Dashboard': ['Manage Products'] } : { Products: [] } : {};
    Object.keys(menus).map((menu) => {
        console.log(menus[menu])
    })
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (e) => {
        navigate(`/${e.target.innerText.toLowerCase().replace(/\s/g, '')}`)
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (e) => {
        navigate(`/${e.target.innerText.toLowerCase().replace(/\s/g, '')}`)
        setAnchorElUser(null);
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
                        onClick={handleCloseNavMenu}
                    />
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {
                                Object.keys(menus).map((menu) => (
                                    <MenuItem key={menu} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{menus[menu]}</Typography>
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <MenuList menus={menus} />
                    </Box>

                    {userLoggedIn ?
                        <Box sx={{ flexGrow: 0 }}>
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
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        : <Button color="inherit" onClick={handleCloseUserMenu}>Login</Button>}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Bar;