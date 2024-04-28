import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { getProductCategories } from '../../firebase/firestore/product';

export default function MenuList() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function getAndSetCategories() {
      setCategories(await getProductCategories())
    }
    getAndSetCategories()
  }, [])

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  // [{ name: '产品展示', link: 'products' }]

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (e, index, link) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    navigate(`/products?category=${link}`)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          aria-label='小可爱精选'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary='小可爱精选'
          />
        </ListItemButton>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {categories.map((category, index) => (
          <MenuItem
            key={category}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index, category)}
          >
            {category}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}