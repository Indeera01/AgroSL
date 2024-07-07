import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Link } from '@mui/material';
import Background from '../Components/Backgroud';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [reenteredpassword, setReenteredpassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log('Email:', email);
    console.log('Fullname:', firstname + ' ' + lastname);
    console.log('Password:', password);
    console.log('Phonenumber:', phonenumber);
    console.log('Reenteredpassword:', reenteredpassword);
    alert('Account created successfully')
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhonenumber('');
    setPassword('');
    setReenteredpassword('');
    navigate("/Success")
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
          Create an Account
        </Typography>
        <TextField
          label="First Name"
          variant="outlined"
          margin="dense"
          fullWidth
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          
        />
        <TextField
          label="Last Name"
          variant="outlined"
          margin="dense"
          fullWidth
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          margin="dense"
          fullWidth
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          required
        />
        <TextField
          label="Email Address"
          variant="outlined"
          margin="dense"
          fullWidth
          type="email"
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
        <TextField
          label="Re-Enter Password"
          variant="outlined"
          type="password"
          margin="dense"
          fullWidth
          value={reenteredpassword}
          onChange={(e) => setReenteredpassword(e.target.value)}
          required
        />
        <Link color="secondary" href="/Sign_Up_Seller" >Create as seller</Link>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ mt: 2, width: '50%', fontSize: '16px' }}
        >
          Create Account
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link color="secondary" href="/Sign_In">Sign in</Link>
        </Typography>
      </Container>
    </Background>
  );
};

export default SignUp;
