import Sign_Up from './Pages/Sign_Up';
import Sign_In from './Pages/Sign_In';
import Navigation_Bar from './Components/Navigation_Bar';
import Side_Drawer from './Components/Side_Drawer';
import React from 'react';
import {Box} from '@mui/material';
import Items from './Components/Items'

const App = () => {
  return (
    <Box>
        <Navigation_Bar/>
        <Items/>
    </Box>
  );
};

export default App
