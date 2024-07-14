import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Link } from '@mui/material';
import backgroundImage from '../assets/background.jpg'

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    console.log('Username:', email);
    console.log('Password:', password);
  };

  return (
    <Box width={'100%'} height={'100vh'} sx={{backgroundImage:`url(${backgroundImage})`}} position={'absolute'}>
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          marginTop:'10%',
        }}
      >
        <Typography variant="h4" fontFamily="open-sans" gutterBottom mb={2}>
          Sign In
        </Typography>
        <TextField
          label="Email Address"
          variant="outlined"
          margin="dense"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="dense"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ mt: 2, width: '40%', fontSize: '16px' }}
        >
          Sign In
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account? <Link color="secondary" href="/Sign_Up_Buyer">Sign Up</Link>
        </Typography>
      </Container>
      </Box>
  );
};

export default SignIn;
