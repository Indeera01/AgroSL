import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import axios from "axios";

export default function Seller_Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    orders: 0,
    deliveries: 0,
    items: 0,
  });

  useEffect(() => {
    // Fetch logged-in user details
    const currentUser = auth.currentUser;
    if (currentUser) {
      axios
        .get(`http://localhost:5001/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });

      // Fetch seller statistics (e.g., number of orders, deliveries, and items)
      axios
        .get(`http://localhost:5001/seller/stats/${currentUser.uid}`)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.error("Error fetching stats:", err);
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
            {/* Post Items Button */}
            <ListItem
              button
              onClick={() => handleNavigation(`/add_item/${id}`)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="Post Items" />
            </ListItem>

            {/* View Orders Button */}
            <ListItem
              button
              onClick={() => handleNavigation(`/sellerdashboard/${id}/orders`)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Orders" />
            </ListItem>

            {/* View Inventory Button */}
            <ListItem
              button
              onClick={() => handleNavigation(`/inventory`)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Inventory" />
            </ListItem>

            {/* View Reports Button */}
            <ListItem
              button
              onClick={() => handleNavigation("/reports_seller")}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Reports" />
            </ListItem>

            {/* View Complaints Button */}
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/sellerdashboard/${id}/complaints`)
              }
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Complaints" />
            </ListItem>
          </List>
        </Box>

        {/* Main Content */}
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
                    padding: "15px",
                    borderRadius: "8px",
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

              {/* Statistics Section */}
              <Box sx={{ display: "flex", gap: "20px" }}>
                <Card
                  sx={{ flex: 1, padding: "10px", backgroundColor: "#f5f5f5" }}
                >
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Number of Orders
                    </Typography>
                    <Typography variant="h4">{stats.orders}</Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{ flex: 1, padding: "10px", backgroundColor: "#f5f5f5" }}
                >
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Number of Items
                    </Typography>
                    <Typography variant="h4">{stats.items}</Typography>
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
