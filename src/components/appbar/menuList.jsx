import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../../contexts/authContext';
import { isAdminUser } from '../../firebase/firestore/authentication';
import { useNavigate } from 'react-router-dom';

const options = [
  'Show some love to MUI',
  'Show all notification content',
  'Hide sensitive notification content',
  'Hide all notification content',
];

export default function MenuList({ menus }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const topMenus = Object.keys(menus)
  const menuLists = Object.keys(menus).map((menu) => menus[menu])

  const { userLoggedIn, userPrivileges } = useAuth()

  const isAdmin = isAdminUser(userPrivileges)

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (e, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    navigate(`/${e.target.innerText.toLowerCase().replace(/\s/g, '')}`)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<>
    {
      topMenus.map((topMenu) => (
        <div>
          <List
            component="nav"
            aria-label="menus"
          >
            <ListItemButton
              id="lock-button"
              aria-haspopup="listbox"
              aria-controls="lock-menu"
              aria-label={topMenu}
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickListItem}
            >
              <ListItemText
                primary={topMenu}
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
            {menus[topMenu].map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ))
    }
  </>
  );
}