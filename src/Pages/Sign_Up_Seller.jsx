import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Link } from '@mui/material';
import backgroundImage from '../assets/background.jpg'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase'
import axios from 'axios';


const SignUp = () => {
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [reenteredpassword, setReenteredpassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== reenteredpassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);

      const userId = user.uid;
      const newUser = {
        id: userId,
        first_name: firstname,
        last_name: lastname,
        mobile_number: phonenumber,
        email: email,
        password: password,
        address_id:"",
        user_type: "Seller"
      };
      alert('Account created successfully');
      clearFields();
      navigate("/Success");
      axios.post('http://localhost:5000/users', newUser)
      .then(response => {
        alert('Account created successfully');
        clearFields();
        navigate("/Success");
      })
      .catch(error => {
        console.error('Error creating account:', error);
      });
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating account');
    }
  };

  const clearFields = () => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhonenumber('');
    setPassword('');
    setReenteredpassword('');
  };

  return (
    <Box width={'100%'} height={'100vh'} sx={{backgroundImage:`url(${backgroundImage})`}} position={'absolute'} padding={8}>
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
    </Box>
  );
};

export default SignUp;
