import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import Navigation_Bar from "../Components/Navigation_Bar";
import axios from "axios";
import Cart_item from "../Components/Cart_item";
import { auth } from "../../firebase";

const ShoppingCart = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []); // Empty dependency array, runs once on mount

  useEffect(() => {
    // Fetch cart items when user data is available
    if (user?.user_id) {
      const fetchCartItems = async (userID) => {
        try {
          const response = await axios.get(
            `http://localhost:5001/cart/${userID}`
          );
          setCartItems(response.data);
          console.log("Cart items:", response.data);
        } catch (err) {
          console.error("Error fetching cart items:", err);
          setError(err.message);
        }
      };

      fetchCartItems(user.user_id); // Call the function with user.uid
    }
  }, [user]); // Dependency array includes user

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/cart/${user.user_id}/${id}`);
      setCartItems(cartItems.filter((item) => item.item_id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    console.log("Calculating total with cartItems:", cartItems);
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box>
      <Navigation_Bar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Cart_item
                key={item.item_id}
                item={item}
                onRemove={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
              />
            ))
          ) : (
            <div>No items in the cart</div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 2, backgroundColor: "#98BC74", margin: "20px" }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="h6" gutterBottom>
                Total: LKR {calculateTotal()}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Delivery Fee: LKR
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" fullWidth>
                Checkout
              </Button>
              <Button variant="contained" color="primary" fullWidth>
                Continue Shopping
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShoppingCart;
