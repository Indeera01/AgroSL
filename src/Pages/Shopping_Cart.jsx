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
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          // Handle 404 or any other errors gracefully
          if (err.response && err.response.status === 404) {
            setCartItems([]); // Set cartItems to empty array if 404 error
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
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

  const handleContinueShopping = () => {
    navigate(-1); // Navigate to the previous page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ backgroundColor: "#e6ffe6", height: "300vh" }}>
      <Navigation_Bar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
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
            <Box margin={20}>
              <Typography variant="h4" component="h2">
                No items in the cart
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleContinueShopping}
              >
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
