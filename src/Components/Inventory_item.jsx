import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const Inventory_item = ({ item, onRemove, onQuantityChange }) => {
  console.log(item);
  const [quantity, setQuantity] = useState(item.quantity);
  const [error, setError] = useState(null);

  const updateQuantity = async (newQuantity) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/items_update/${item.item_id}`,
        { quantity: newQuantity }
      );
      setQuantity(response.data.quantity);
      onQuantityChange(item.item_id, response.data.quantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.message);
    }
  };

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    updateQuantity(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      updateQuantity(newQuantity);
    } else {
      onRemove(item.item_id);
    }
  };

  return (
    <Card
      sx={{
        width: "250px",
        height: "400px",
        backgroundColor: "#98BC74",
        margin: "20px",
      }}
    >
      <CardMedia
        component="img"
        alt={item.item_name}
        image={item.image_url}
        sx={{
          width: "100%", // Make sure the image takes the full width of the parent Box
          height: "50%", // Maintain aspect ratio based on the image's width
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Typography gutterBottom variant="h6" component="div">
          {item.item_name}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Quantity:
          <Button
            size="small"
            disabled={quantity <= 1} // Disable button if quantity is 1
            onClick={handleDecrease}
          >
            <RemoveIcon />
          </Button>
          {quantity}
          <Button size="small" onClick={handleAdd}>
            <AddIcon />
          </Button>
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => onRemove(item.item_id)} // Trigger remove function on button click
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default Inventory_item;
