import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';

export default function AdminMenuList() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const menus = [{ name: '管理产品', link: 'manageprodcuts' }]

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (e, index, link) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        navigate(`/${link}`)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<>
        <div key='Admin Dashboard'>
            <List
                component="nav"
                aria-label="menus"
            >
                <ListItemButton
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label={'管理员面板'}
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                >
                    <ListItemText
                        primary={'管理员面板'}
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
                {menus.map((option, index) => (
                    <MenuItem
                        key={option.link}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index, option.link)}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    </>
    );
}