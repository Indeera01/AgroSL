import React, { Children } from 'react'
import {Box,Container} from '@mui/material'
import Navigation_Bar from './Components/Navigation_Bar'
import Items from './Components/Items'

const Layout = ({Children}) => {
  return (
    <Box>
        <Navigation_Bar/>
        <Items />
        {Children} 
    </Box>
  )
}

export default Layout