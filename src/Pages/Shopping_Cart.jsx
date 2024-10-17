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
import emptyImage from "../assets/empty cart.jpg";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PwNGE05CsRawMoqM7YEL8tcA6xpOuDUJJ1oRSImOq9ndmJxlWHlqvlYLIg7aXlxJCXAQqCHbWAOVakInuTx4ql100M5xx4oan"
);

const ShoppingCart = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Fetch logged-in user details from Firebase Authentication
    const currentUser = auth.currentUser;
    console.log(currentUser);
    if (currentUser) {
      axios
        .get(`https://backend-rho-three-58.vercel.app/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          console.log("User data:", res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      navigate("/Sign_in");
    }
  }, []); // Empty dependency array, runs once on mount

  useEffect(() => {
    // Fetch cart items when user data is available
    if (user?.user_id) {
      const fetchCartItems = async (userID) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/cart/${userID}`
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
  //added by damitha

  const handleViewPastOrders = () => {
    navigate(`/orders_for_buyer/${user.user_id}`); // Use template string to navigate
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(
        `https://backend-rho-three-58.vercel.app/cart/${user.user_id}/${id}`
      );
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

  const handleCheckout = async () => {
    if (!stripe || !elements) return; // Ensure Stripe.js is loaded

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("Card Element not found");
      return; // Exit if Card Element is not found
    }

    try {
      const chargeAmount = Math.round(calculateTotal() * 100); // Total amount in cents
      const chargeResponse = await axios.post(
        "https://backend-rho-three-58.vercel.app/create-charge",
        {
          amount: chargeAmount,
        }
      );

      console.log("Charge Response:", chargeResponse.data);

      // Only proceed if the charge was successful
      if (!chargeResponse.data.success) {
        throw new Error("Charge was not successful");
      }

      // Step 1: Create payment intent and get clientSecret + transferData
      const response = await axios.post(
        "https://backend-rho-three-58.vercel.app/create-payment-intent",
        {
          user_id: user.user_id,
          cartItems: cartItems, // Include cart items in the request body
        }
      );

      const { clientSecret, transferData } = response.data;

      // Step 2: Confirm payment with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // Step 3: Transfer payment to sellers
          await axios.post(
            "https://backend-rho-three-58.vercel.app/transfer-payment",
            {
              paymentIntentId: result.paymentIntent.id,
              transferData,
            }
          );

          console.log("Payment and transfer successful!");
          alert("Order placed succssesfully!");

          // const mail = await axios.post(
          //   "https://backend-rho-three-58.vercel.app/send-confirmation",
          //   {
          //     user_email: user.user_email,
          //     cartItems: cartItems, // Include cart items in the request body
          //   }
          // );

          try {
            const responseMail = await axios.post(
              "https://backend-rho-three-58.vercel.app/send-confirmation",
              {
                user_email: user.user_email,
                cartItems: cartItems,
              },
              {
                withCredentials: true, // Include cookies/auth headers
                headers: { "Content-Type": "application/json" },
              }
            );
            console.log("Email sent:", responseMail.data);
          } catch (error) {
            console.error("Error during email:", error);
          }

          try {
            for (const item of cartItems) {
              await axios.delete(
                `https://backend-rho-three-58.vercel.app/cart/${user.user_id}/${item.item_id}`
              );

              console.log(item);

              await axios.post(
                `https://backend-rho-three-58.vercel.app/orders`,
                {
                  buyer_id: user.user_id,
                  item_id: item.item_id,
                  is_confirmed: true,
                  seller_id: item.seller_id,
                  order_quantity: item.quantity,
                }
              );
            }
            // Optionally clear cartItems state
            setCartItems([]);
            console.log("Payment and transfer successful, cart cleared!");
          } catch (deleteError) {
            console.error("Error deleting cart items:", deleteError);
          }
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // const handleCheckout = async () => {
  //   if (!stripe || !elements) return; // Ensure Stripe.js is loaded

  //   try {
  //     // Step 1: Create checkout session
  //     const response = await axios.post(
  //       "https://backend-rho-three-58.vercel.app/create-checkout-session",
  //       {
  //         user_id: user.user_id,
  //         cartItems: cartItems, // Include cart items in the request body
  //       }
  //     );

  //     const { id: sessionId } = response.data; // Get the session ID

  //     // Step 2: Redirect to Stripe Checkout
  //     const result = await stripe.redirectToCheckout({ sessionId });

  //     if (result.error) {
  //       console.error("Error redirecting to checkout:", result.error.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //   }
  // };

  /*return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar />
      <Grid container spacing={2} marginTop={5} marginBottom={5}>
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
            <Box
              margin={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <img
                src={emptyImage}
                alt="Empty Cart"
                style={{ width: "100%", marginBottom: "20px" }}
              />
            </Box>
          )}
        </Grid>

        {cartItems.length > 0 ? (
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
            }}
          >
            <Card sx={{ padding: 2, backgroundColor: "white", margin: "20px" }}>
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ color: "#4B8412" }}>
                  Order Summary
                </Typography>
                <Typography variant="h6" gutterBottom>
                  SubTotal ({cartItems.length} items) : {calculateTotal()} LKR
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Delivery Fee : 400 LKR
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Discount : _
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{ color: "#4B8412" }}
                >
                  Total: {calculateTotal() + 400} LKR
                </Typography>
                <CardElement />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCheckout}
                >
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

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleViewPastOrders}
                >
                  view past orders
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{ height: "40px", marginTop: "200px" }}
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        )}
      </Grid>
    </Box>
  );*/

  //added by damitha.new return func to display the continue shopping and view past orders when cart is empty
  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar />
      <Grid container spacing={2} marginTop={"20px"} marginBottom={5}>
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
            <Box
              margin={5}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <img
                src={emptyImage}
                alt="Empty Cart"
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                Your cart is empty.
              </Typography>
            </Box>
          )}
        </Grid>

        {cartItems.length > 0 ? (
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
            }}
          >
            <Card sx={{ padding: 2, backgroundColor: "white", margin: "20px" }}>
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ color: "#4B8412" }}>
                  Order Summary
                </Typography>
                <Typography variant="h6" gutterBottom>
                  SubTotal ({cartItems.length} items) : {calculateTotal()}.00
                  LKR
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Delivery Fee : 400.00 LKR
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Discount : _
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{ color: "#4B8412" }}
                >
                  Total: {calculateTotal() + 400}.00 LKR
                </Typography>
                <CardElement />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCheckout}
                >
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

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleViewPastOrders}
                >
                  View Past Orders
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            {/* Display Continue Shopping and View Past Orders buttons even when cart is empty */}
            <Card sx={{ padding: 2, backgroundColor: "white", margin: "20px" }}>
              <CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginBottom: "10px" }}
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleViewPastOrders}
                >
                  View Past Orders
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ShoppingCart;
