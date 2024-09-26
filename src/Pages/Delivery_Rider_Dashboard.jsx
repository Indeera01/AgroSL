/*import React from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import View_Complaints from "../Components/View_Complaints";
import View_Orders from "../Components/View_Orders";
import View_Deliveries from "../Components/View_Deliveries";
import View_Orders_Rider from "../Components/View_Orders_Rider";
export default function Delivery_Rider_Dashboard() {
  return (
    <div>
      <Navigation_Bar_Seller />
      <div style={styles.dashboard}>
        <div style={styles.row}>
          <View_Orders_Rider />
          <View_Deliveries />
        </div>
        <div style={styles.row}></div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignComplaints: "center",
    padding: "20px",
    gap: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
};
*/

import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import axios from "axios";
// Adjust the import based on your Firebase setup

export default function Seller_Dashboard() {
  const navigate = useNavigate();
  const { riderId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch logged-in user details from Firebase Authentication
    const currentUser = auth.currentUser;
    console.log(currentUser);
    if (currentUser) {
      axios
        .get(`http://localhost:5001/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          console.log("User data:", res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    /*
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <Box sx={{ flex: 1, padding: "20px", display: "flex" }}>
        <Box
          sx={{
            width: "250px",
            backgroundColor: "#F4F7F6",
            borderRadius: "10px",
            padding: "20px",
            marginRight: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: "100vh",
          }}
        >
          <List>
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/delivery_rider_dashboard/${riderId}/orders`)
              }
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="View Orders" primaryTypographyProps={{}} />
            </ListItem>

            <ListItem
              button
              onClick={() =>
                handleNavigation(
                  `/delivery_rider_dashboard/${riderId}/deliveries`
                )
              }
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText
                primary="View Deliveries"
                primaryTypographyProps={{}}
              />
            </ListItem>
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Box sx={{ marginBottom: "20px" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "600", color: "#333" }}
                >
                  Welcome, {user.first_name} {user.last_name}
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: "#F9F9F9",
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Email:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.email}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Mobile Number:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.mobile_number}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
    */

    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <Box sx={{ flex: 1, padding: "20px", display: "flex" }}>
        <Box
          sx={{
            width: "250px",
            backgroundColor: "#F4F7F6",
            borderRadius: "10px",
            padding: "20px",
            marginRight: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: "100vh",
          }}
        >
          <List>
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/delivery_rider_dashboard/${riderId}/orders`)
              }
              sx={{
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s", // Smooth transition
                backgroundColor: "#fff", // Remove border, default bg color
                "&:hover": {
                  backgroundColor: "#007BFF", // Change background color on hover
                  color: "#fff", // White text on hover
                },
              }}
            >
              <ListItemText primary="View Orders" />
            </ListItem>

            <ListItem
              button
              onClick={() =>
                handleNavigation(
                  `/delivery_rider_dashboard/${riderId}/deliveries`
                )
              }
              sx={{
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s", // Smooth transition
                backgroundColor: "#fff", // Remove border, default bg color
                "&:hover": {
                  backgroundColor: "#007BFF", // Change background color on hover
                  color: "#fff", // White text on hover
                },
              }}
            >
              <ListItemText primary="View Deliveries" />
            </ListItem>
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Box sx={{ marginBottom: "20px" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "600", color: "#333" }}
                >
                  Welcome, {user.first_name} {user.last_name}
                </Typography>

                <Box
                  sx={{
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: "#F9F9F9",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Email:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.email}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Mobile Number:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.mobile_number}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
