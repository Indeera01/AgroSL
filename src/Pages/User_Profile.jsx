import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import axios from "axios";
import { auth } from "../../firebase";

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

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
      width: 90,
      height: 90,
      fontSize: "2rem",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const User_Profile = ({ onClose }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [addressup, setAddressup] = useState({
    pb_number: "Not set yet",
    street_name: "Not set yet",
    city: "Not set yet",
    district: "Not set yet",
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      axios
        .get(`https://backend-rho-three-58.vercel.app/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          setUpdatedUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (updatedUser?.address_id) {
      const currentUser = auth.currentUser;
      axios
        .get(
          `https://backend-rho-three-58.vercel.app/get_user_address/${currentUser.uid}`
        )
        .then((res) => {
          console.log(res.data);
          setAddressup({
            pb_number: res.data.user_address.pb_number,
            street_name: res.data.user_address.street_name,
            city: res.data.user_address.city,
            district: res.data.user_address.district,
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [updatedUser]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
  };

  const handleCloseClickHome = () => {
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressup((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    const combinedData = {
      ...updatedUser,
      addressup,
    };
    axios
      .put(`https://backend-rho-three-58.vercel.app/users/${id}`, combinedData)
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
      bgcolor="rgba(240, 240, 240, 0.9)"
      zIndex={9999}
      p={3}
    >
      <Card
        sx={{
          width: { xs: "90%", sm: "80%", md: "60%", lg: "40%" },
          maxHeight: "80vh",
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 8,
          boxShadow: 5,
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            overflowY: "auto",
            maxHeight: "calc(80vh - 80px)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Typography variant="h4" gutterBottom>
              User Profile
            </Typography>
            <Avatar
              {...stringAvatar(`${user.first_name} ${user.last_name}`)}
              src={user?.image_url}
            />
          </Box>
          <Divider sx={{ my: 3 }} />

          {isEditing ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={updatedUser.first_name}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={updatedUser.last_name}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="mobile_number"
                    value={updatedUser.mobile_number}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" align="left" sx={{ mt: 3 }}>
                Address:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="P.B Number"
                    name="pb_number"
                    value={addressup.pb_number}
                    onChange={handleAddressChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Street Name"
                    name="street_name"
                    value={addressup.street_name}
                    onChange={handleAddressChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={addressup.city}
                    onChange={handleAddressChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    name="district"
                    value={addressup.district}
                    onChange={handleAddressChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <CardActions sx={{ justifyContent: "center", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveClick}
                  sx={{
                    paddingX: 3,
                    "&:hover": {
                      backgroundColor: "#4CAF50",
                    },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseClick}
                  sx={{
                    paddingX: 3,
                    "&:hover": {
                      backgroundColor: "#FF5252",
                    },
                  }}
                >
                  Cancel
                </Button>
              </CardActions>
            </Box>
          ) : (
            <List>
              <ListItem>
                <ListItemText
                  primary="First Name"
                  secondary={user.first_name}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Last Name" secondary={user.last_name} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Phone Number"
                  secondary={user.mobile_number}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Email" secondary={user.email} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="P.B Number"
                  secondary={addressup.pb_number}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Street"
                  secondary={addressup.street_name}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="City" secondary={addressup.city} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="District"
                  secondary={addressup.district}
                />
              </ListItem>
            </List>
          )}
        </CardContent>

        {!isEditing && (
          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
              sx={{
                "&:hover": {
                  backgroundColor: "#03A9F4",
                },
              }}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseClickHome}
              sx={{
                paddingX: 3,
                "&:hover": {
                  backgroundColor: "#FF5252",
                },
              }}
            >
              Cancel
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default User_Profile;
