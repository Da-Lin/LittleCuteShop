import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProductCategories } from '../../firebase/firestore/product';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';

export default function MenuListXS() {
    const [anchorEl, setAnchorEl] = useState(null);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [categories, setCategories] = useState([])

    const { i18n } = useTranslation()
    const isChinese = i18n.language === 'zh'

    const location = useLocation();

    useEffect(() => {
        async function getAndSetCategories() {
            setCategories(await getProductCategories())
        }
        getAndSetCategories()
    }, [])

    useEffect(() => {
        if (location.pathname !== '/products') {
            setSelectedIndex(null)
        }
    }, [location])

    const handleClickMenu = (event) => {
        console.log('clicked')
        setAnchorEl(event.currentTarget)
    };

    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleMenuItemClick = (e, index, link) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if (link) {
            navigate(`/products?category=${link}`)
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div key={'littlecute'}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleClickMenu}
            >
                <MenuIcon />
            </IconButton>
            {
                isChinese ?
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    >
                        {categories.map((category, index) => (
                            <MenuItem
                                key={category}
                                selected={selectedIndex !== null ? index === selectedIndex : null}
                                onClick={(event) => handleMenuItemClick(event, index, category)}
                            >
                                {category}
                            </MenuItem>
                        ))}
                    </Menu> :

                    // English
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem
                            selected={true}
                            onClick={(event) => handleMenuItemClick(event, 0, '点心')}
                        >
                            Pastry
                        </MenuItem>
                    </Menu>
            }
        </div>
    )
}