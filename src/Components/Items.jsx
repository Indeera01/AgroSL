import React from 'react'
import {Box} from '@mui/material';
import Item from './Item'
const Items = () => {
  return (
    <Box
    sx={{display:'flex',margin:10,flexWrap:'wrap'}}
    >
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
    </Box>

  )
}

export default Items