import React from 'react'
import Background from '../Components/Backgroud';
import { Container, Typography,Button } from '@mui/material';
import SucessIcon from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <Background>
      <Container
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          borderRadius: 6,
          boxShadow: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Typography variant='h3' align='center'>Your account has been succesfully created</Typography>
        <SucessIcon color="success" sx={{fontSize:150}}/>
        <Button
          variant="contained"
          color="primary"
          onClick={()=>navigate("/")}
          sx={{ mt: 2, width: '60%', fontSize: '16px' }}
        >
          Go to Log In page
        </Button>
        </Container>
        </Background>
  )
}

export default Success