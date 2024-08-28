import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Item from "./Item";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

  useEffect(() => {
    axios
      .get("http://localhost:5001/items")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (item) => {
    // Replace this with your navigation or display logic
    console.log("Item clicked:", item);
    navigate(`/item/${item.item_id}`, { state: { user } });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
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
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box ml={5} mt={12} sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {items.map((item) => (
        <Item key={item.id} item={item} onCardClick={handleCardClick} />
      ))}
    </Box>
  );
};

export default Items;
