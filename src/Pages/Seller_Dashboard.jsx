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
  Badge,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import axios from "axios";
import ChatIcon from "@mui/icons-material/Chat";
import Reports_seller from "./Reports_seller";

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
  const [store, setStore] = useState(null);

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

  useEffect(() => {
    // Fetch store name when user data is available
    if (user?.user_id) {
      const fetchStore = async (userID) => {
        try {
          const response = await axios.get(
            `http://localhost:5001/getseller/${userID}`
          );
          setStore(response.data.store_name);
          console.log("Store", response.data.store_name);
        } catch (err) {
          // Handle 404 or any other errors gracefully
          if (err.response && err.response.status === 404) {
            setStore(null); // Set Items to empty array if 404 error
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchStore(user.user_id); // Call the function with user.uid
    }
  }, [user]);

  const handleChatMessagePress = () => {
    if (!user) {
      alert("Please log in to chat with seller");
      return;
    }
    navigate(`/chat_page/${user?.user_id}`);
  };

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
            {/* <ListItem
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
            </ListItem> */}

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
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "600", color: "#333" }}
              >
                Welcome, {user.first_name} {user.last_name}
              </Typography>
              <Box
                sx={{
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Card
                  sx={{
                    width: "25%",
                    margin: "20px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%", // Make sure the image takes the full width of the parent Box
                      height: "auto", // Maintain aspect ratio based on the image's width
                      objectFit: "cover",
                    }}
                    image={
                      user.image_url
                        ? user.image_url
                        : "https://firebasestorage.googleapis.com/v0/b/agrosl-7abb2.appspot.com/o/items%2Fdefault_user.jpg?alt=media&token=9d2d5193-73f0-4ba2-9776-06b91c4ca354"
                    }
                    title={user.first_name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {store}
                    </Typography>
                    <Typography variant="h6">
                      Owner : {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="h6">Emial : {user.email}</Typography>
                    <Typography variant="h6">
                      Mobile Number : {user.mobile_number}
                    </Typography>
                  </CardContent>
                </Card>
                <Box
                  sx={{
                    width: "40%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Card
                    sx={{
                      padding: "10px",
                      backgroundColor: "#f5f5f5",
                      height: "200px",
                      margin: "20px",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        Number of Orders
                      </Typography>
                      <Typography variant="h4">{stats.orders}</Typography>
                    </CardContent>
                  </Card>

                  <Card
                    sx={{
                      padding: "10px",
                      backgroundColor: "#f5f5f5",
                      height: "200px",
                      margin: "20px",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        Number of Items
                      </Typography>
                      <Typography variant="h4">{stats.items}</Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* <Box
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
                </Box> */}
              </Box>

              {/* Statistics Section */}

              <Reports_seller />
            </>
          )}
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom="12%"
        right="4%"
        zIndex="1000"
        bgcolor="white"
        padding={2}
        borderRadius="50%"
        boxShadow="0px 8px 10px rgba(0, 0, 0, 0.8)"
        onClick={() => handleChatMessagePress()}
        sx={{
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)",
          },
        }}
      >
        <Badge badgeContent={0} color="error">
          <ChatIcon fontSize="large" color="black" />
        </Badge>
      </Box>
    </Box>
  );
}
