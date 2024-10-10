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
import { Box } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

const Cart_item = ({ item, onRemove, onQuantityChange }) => {
  console.log(item);
  const [quantity, setQuantity] = useState(item.quantity);
  const [fullItem, setFullItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async (itemID) => {
      try {
        const response = await axios.get(
          `https://backend-rho-three-58.vercel.app/items/${itemID}`
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
        `https://backend-rho-three-58.vercel.app/cart/${item.buyer_id}/${item.item_id}`,
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

  console.log("frull item:", fullItem.quantity);

  return (
    <Card
      sx={{
        display: "flex", // Use flex layout for side-by-side arrangement
        flexDirection: { xs: "row", sm: "row" }, // Stack on small screens, side by side on larger screens
        backgroundColor: "white",
        marginLeft: "100px",
        marginRight: "100px",
        marginTop: "5px",
        height: { xs: "150px", sm: "150px" },
        width: { xs: "80%", sm: "80%" },
        borderRadius: "5px", // Set the border radius for rounded edges
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        alt={fullItem.item_name}
        image={fullItem.image_url}
        sx={{
          width: { xs: "40%", sm: "40%" }, // Full width on small screens, 40% on larger screens
          height: { xs: "100%", sm: "100%" }, // Maintain aspect ratio
          objectFit: "cover",
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
        <CardContent sx={{ flex: "1 0 auto", p: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {fullItem.item_name}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ color: "#4B8412" }}
          >
            {item.price} LKR
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
            <Button
              size="small"
              onClick={handleAdd}
              disabled={quantity >= fullItem.quantity}
            >
              <AddIcon />
            </Button>
            <Button onClick={() => onRemove(item.item_id)}>
              <DeleteForeverOutlinedIcon />
            </Button>
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            color="text.secondary"
            sx={{ color: "#4B8412" }}
          >
            Total: LKR {total}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Cart_item;
