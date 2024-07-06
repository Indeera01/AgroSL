import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Link } from '@mui/material';
import Background from '../Components/Backgroud';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    console.log('Username:', username);
    console.log('Password:', password);
  };

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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography variant="h4" fontFamily="open-sans" gutterBottom mb={2}>
          Sign In
        </Typography>
        <TextField
          label="Email Address"
          variant="outlined"
          margin="dense"
          // fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            sx: {
              padding: '0px 60px',
            },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="dense"
          // fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            sx: {
              padding: '0px 60px',
            },
          }}
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
          Don’t have an account? <Link color="secondary" href="/Sign_Up">Sign Up</Link>
        </Typography>
      </Container>
    </Background>
  );
};

export default SignIn;