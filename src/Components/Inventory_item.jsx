import React, { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Inventory_item = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity.toString()); // Store as string initially
  const [error, setError] = useState(null);

  const updateQuantity = async () => {
    const newQuantity = parseInt(quantity, 10);

    if (!isNaN(newQuantity) && newQuantity > 0) {
      try {
        const response = await axios.put(
          `http://localhost:5001/items_update/${item.item_id}`,
          { quantity: newQuantity }
        );
        setQuantity(response.data.quantity.toString()); // Keep quantity as string
        onQuantityChange(item.item_id, response.data.quantity);
      } catch (err) {
        console.error("Error updating quantity:", err);
        setError(err.message);
      }
    } else {
      setError("Quantity must be a positive number.");
      alert("Quantity must be a positive number.");
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    // Allow empty input, or numbers only
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setQuantity(value); // Keep the value as string for now
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
          width: "100%",
          height: "50%",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Typography gutterBottom variant="h6" component="div">
          {item.item_name}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Quantity:
          <TextField
            size="small"
            type="text" // Allow text input to handle empty string
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 0 }}
            sx={{ width: "80px", marginLeft: "10px" }}
          />
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={updateQuantity}
        >
          Update
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => onRemove(item.item_id)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default Inventory_item;
