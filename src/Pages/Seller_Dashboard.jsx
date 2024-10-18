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
    const currentUser = auth.currentUser;
    if (currentUser) {
      axios
        .get(`https://backend-rho-three-58.vercel.app/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });

      axios
        .get(
          `https://backend-rho-three-58.vercel.app/seller/stats/${currentUser.uid}`
        )
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.error("Error fetching stats:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (user?.user_id) {
      const fetchStore = async (userID) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/getseller/${userID}`
          );
          setStore(response.data.store_name);
          console.log("Store", response.data.store_name);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setStore(null);
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchStore(user.user_id);
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navigation_Bar_Seller />
      <Box
        sx={{
          flex: 1,
          padding: { xs: "10px", sm: "20px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "250px" },
            backgroundColor: "#F4F7F6",
            borderRadius: "10px",
            padding: { xs: "10px", sm: "20px" },
            marginBottom: { xs: "20px", md: "0" },
            marginRight: { xs: "0", md: "20px" },
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <List>
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

        <Box
          sx={{
            flex: 1,
            padding: { xs: "10px", sm: "20px" },
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
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                }}
              >
                <Card
                  sx={{
                    width: { xs: "100%", md: "25%" },
                    margin: { xs: "10px 0", md: "20px" },
                    backgroundColor: "#f5f5f5",
                    height: "auto",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100%",
                      height: { xs: "200px", md: "250px" },
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
                      Owner: {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="h6">Email: {user.email}</Typography>
                    <Typography variant="h6">
                      Mobile Number: {user.mobile_number}
                    </Typography>
                  </CardContent>
                </Card>

                <Box
                  sx={{
                    width: { xs: "100%", md: "40%" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      padding: "10px",
                      backgroundColor: "#f5f5f5",
                      height: "200px",
                      margin: "20px",
                      width: "100%",
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
                      width: "100%",
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
              </Box>

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
