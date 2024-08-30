import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Item from "./Item";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import NoItems from "./NoItem";

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log(searchTerm, category, rating);
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
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5001/items")
      .then((res) => {
        setItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = items;
    console.log(searchTerm, category, rating);
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.item_name &&
          item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (rating) {
      filtered = filtered.filter((item) => item.average_rating_value >= rating);
    }

    setFilteredItems(filtered);
  }, [searchTerm, category, rating, items]);

  const handleCardClick = (item) => {
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
    <Box ml={5} mt={3}>
      <Box mb={4} sx={{ display: "flex", gap: 3 }} width={"70%"}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Fruits">Fruits</MenuItem>
            <MenuItem value="Seeds">Seeds</MenuItem>
            <MenuItem value="Seeds">Vegetables</MenuItem>
            <MenuItem value="Animal Products">Animal Products</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Rating</InputLabel>
          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            label="Rating"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="1">1+</MenuItem>
            <MenuItem value="2">2+</MenuItem>
            <MenuItem value="3">3+</MenuItem>
            <MenuItem value="4">4+</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {filteredItems.length === 0 ? (
          <NoItems />
        ) : (
          filteredItems.map((item) => (
            <Item key={item.id} item={item} onCardClick={handleCardClick} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Items;
