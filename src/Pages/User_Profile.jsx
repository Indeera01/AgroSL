import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Avatar, List, ListItem, ListItemText, Button, TextField, Divider } from '@mui/material';
import axios from 'axios';

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 70,
      height: 70
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const User_Profile = ({onClose}) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setUpdatedUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
  };

  const handlePopUpCloseClick = () => {

  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    axios.put(`http://localhost:5000/users/${id}`, updatedUser)
      .then((res) => {
        setUser(res.data);
        setIsEditing(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        width="100%"
        bgcolor="rgba(255, 255, 255, 0.8)" 
        zIndex={9999} 
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        width="100%"
        bgcolor="rgba(255, 255, 255, 0.8)" 
        zIndex={9999} 
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      bgcolor="rgba(255, 255, 255, 0.8)" 
      zIndex={9999} 
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'white', padding: 4, borderRadius: 10, boxShadow: 3 }}
        alignItems="center"
        width="30%"
      >
        <Typography variant="h3" align="center">Profile</Typography>
        <Avatar {...stringAvatar(`${user.first_name} ${user.last_name}`)} />
        {isEditing ? (
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} width={'100%'}>
            <TextField
              label="First Name"
              name="firstName"
              value={updatedUser.first_name}
              onChange={handleInputChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={updatedUser.last_name}
              onChange={handleInputChange}
            />
            <TextField
              label="Phone Number"
              name="mobile_number"
              value={updatedUser.mobile_number}
              onChange={handleInputChange}
            />
            <TextField
              label="Email"
              name="email"
              value={updatedUser.email}
              onChange={handleInputChange}
            />
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCloseClick}>
              Close
            </Button>
          </Box>
        ) : (
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
              <ListItemText primary="First Name" secondary={user.first_name} />
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary="Last Name" secondary={user.last_name} />
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary="Phone Number" secondary={user.mobile_number} />
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <Box display={'flex'} justifyContent={'space-evenly'}>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="contained" color="secondary" onClick={handleEditClick}>
              Edit
            </Button>
            </Box>
          </List>
        )}
      </Box>
    </Box>
  );
};

export default User_Profile;
