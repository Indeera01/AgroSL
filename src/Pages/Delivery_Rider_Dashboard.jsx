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

export default function Seller_Dashboard() {
  const navigate = useNavigate();
  const { riderId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    console.log(currentUser);
    if (currentUser) {
      axios
        .get(`https://backend-rho-three-58.vercel.app/users/${currentUser.uid}`)
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
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                transition: "background-color 0.3s",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#007BFF",
                  color: "#fff",
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
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                transition: "background-color 0.3s",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#007BFF",
                  color: "#fff",
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
