import React from 'react'
import { Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText ,Box,Toolbar} from '@mui/material';
import {StorefrontOutlined,ShoppingCartOutlined,FeedbackOutlined,HistoryOutlined} from '@mui/icons-material';
const drawerWidth = 240;


const Side_Drawer = () => {
  return (
    <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' ,backgroundColor: '#98BC74'},
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <List>
            {[
                { name: 'Items', icon: <StorefrontOutlined /> },
                { name: 'Cart', icon: <ShoppingCartOutlined /> },
                { name: 'Complaint', icon: <FeedbackOutlined /> },
                { name: 'History', icon: <HistoryOutlined /> }
            ].map((item, index) => (
                <ListItem key={item.name} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                    {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
        </Box>
      </Drawer>
  )
}

export default Side_Drawer