import React, { Children } from 'react'
import {Box,Container} from '@mui/material'
import Navigation_Bar from './Components/Navigation_Bar'

const Layout = ({Children}) => {
  return (
    <Box>
        <Navigation_Bar/>
        <Container>
            {Children}
        </Container>
    </Box>
  )
}

export default Layout