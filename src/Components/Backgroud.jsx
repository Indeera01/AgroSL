import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import backgroundImage from '../assets/background.jpg';

const BackgroundBox = styled(Box)({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Background = ({children}) => {
  return (<BackgroundBox>
    {children}
  </BackgroundBox>);
};

export default Background;
