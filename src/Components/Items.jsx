import React from 'react'
import {Box} from '@mui/material';
import Item from './Item'
const Items = () => {
  const itemlist = [1,2,3,4,5,6,7,8,9,10,11]
  return (
    <Box
    ml={3}
    mt={12}
    sx={{display:'flex',gap:3,flexWrap: 'wrap'}}
    >
      {itemlist.map((i)=><Item/>)}
    </Box>

  )
}

export default Items