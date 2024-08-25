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

const Cart_item = ({ item, onRemove, onQuantityChange }) => {
  console.log(item);
  const [quantity, setQuantity] = useState(item.quantity);
  const [fullItem, setFullItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async (itemID) => {
      try {
        const response = await axios.get(
          `http://localhost:5001/items/${itemID}`
        );
        setFullItem(response.data[0]);
        console.log("Item:", response.data[0]);
      } catch (err) {
        console.error("Error fetching the item:", err);
        setError(err.message);
      }
    };

    if (item.item_id) {
      fetchItem(item.item_id); // Fetch item details if item_id is available
    }
  }, [item.item_id]);

  const updateQuantity = async (newQuantity) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/cart/${item.buyer_id}/${item.item_id}`,
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
      onRemove(item.item_id); // Remove the item if quantity is 1
    }
  };

  if (!fullItem) {
    return <div>Loading item details...</div>; // Show loading state while fetching
  }

  const total = quantity * item.price;

  return (
    <Card
      sx={{
        minWidth: { md: 260, xs: 260 },
        maxWidth: { md: 500, xs: 500 },
        backgroundColor: "#98BC74",
        margin: "20px",
      }}
    >
      <CardMedia
        component="img"
        alt={fullItem.item_name}
        image={fullItem.image_url}
        sx={{
          maxWidth: "100px",
          maxHeight: "100px",
          objectFit: "cover",
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Typography gutterBottom variant="h6" component="div">
          {fullItem.item_name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          LKR : {item.price} / unit
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
        <Typography gutterBottom variant="body2" color="text.secondary">
          Total: LKR {total}
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

export default Cart_item;
