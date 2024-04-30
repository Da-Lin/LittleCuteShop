import React from "react";

import ChatIcon from '@mui/icons-material/Chat';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, ListItemButton, Divider } from "@mui/material";

const drawerWidth = 200;

const UserDrawer = () => {
    const navigate = useNavigate()

    const primayItemsList = [
        {
            text: "安全信息",
            icon: <SecurityIcon />,
            onClick: () => navigate("secuirty")
        }
    ];

    const secondaryItemsList = [
        {
            text: "联系我们",
            icon: <ChatIcon />,
            onClick: () => navigate("contact")
        },
        {
            text: "提交反馈",
            icon: <FeedbackIcon />,
            onClick: () => navigate("about")
        }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {primayItemsList.map((item, index) => {
                        const { text, icon, onClick } = item;
                        return (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={onClick}>
                                    {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
                <Divider />
                <List>
                    {secondaryItemsList.map((item, index) => {
                        const { text, icon, onClick } = item;
                        return (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={onClick}>
                                    {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        </Drawer>
    );
};

export default UserDrawer;
