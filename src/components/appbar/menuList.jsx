import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { getProductCategories } from '../../firebase/firestore/product';
import { useTranslation } from 'react-i18next';

export default function MenuList() {
  const [anchorEl, setAnchorEl] = useState(null);
  let currentlyHovering = false;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [categories, setCategories] = useState([])

  const { t, i18n } = useTranslation()
  const isChinese = i18n.language === 'zh'

  useEffect(() => {
    async function getAndSetCategories() {
      setCategories(await getProductCategories())
    }
    getAndSetCategories()
  }, [])

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClickListItem = (event) => {
    currentlyHovering = false
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  function handleHover() {
    currentlyHovering = true
  }

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

  function handleCloseHover() {
    currentlyHovering = false
    setTimeout(() => {
      if (!currentlyHovering) {
        handleClose();
      }
    }, 50);
  }

  return (
    <div key={'littlecute'}>
      <List
        component="nav"
        aria-label="menus"
      >
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label={t('appBar').menuList.featured}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
          onMouseOver={handleClickListItem}
          onMouseLeave={handleCloseHover}
        >
          <ListItemText
            primary={t('appBar').menuList.featured}
          />
        </ListItemButton>
      </List>
      {
        isChinese ?
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'lock-button',
              role: 'listbox',
              onMouseEnter: handleHover,
              onMouseLeave: handleCloseHover,
              style: { pointerEvents: "auto" }
            }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            style={{ pointerEvents: "none" }}
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
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'lock-button',
              role: 'listbox',
              onMouseEnter: handleHover,
              onMouseLeave: handleCloseHover,
              style: { pointerEvents: "auto" }
            }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            style={{ pointerEvents: "none" }}
          >
            <MenuItem
              onClick={(event) => handleMenuItemClick(event, 0, null)}>
              English menus are not supported yet
            </MenuItem>
          </Menu>
      }
    </div>
  )
}