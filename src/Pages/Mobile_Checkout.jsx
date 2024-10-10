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
import axios from "axios";
import Cart_item from "../Components/Cart_item";
import { auth } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import emptyImage from "../assets/empty cart.jpg";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PwNGE05CsRawMoqM7YEL8tcA6xpOuDUJJ1oRSImOq9ndmJxlWHlqvlYLIg7aXlxJCXAQqCHbWAOVakInuTx4ql100M5xx4oan"
);

const Mobile_Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const stripe = useStripe();
  const elements = useElements();

  const { user_id } = useParams();

  useEffect(() => {
    // Fetch cart items when user data is available
    if (user_id) {
      const fetchCartItems = async (user_id) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/cart/${user_id}`
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
  }, [user_id]); // Dependency array includes user
  //added by damitha

  const calculateTotal = () => {
    console.log("Calculating total with cartItems:", cartItems);
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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

  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ padding: 2, backgroundColor: "white", margin: "20px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ color: "#4B8412" }}>
            Order Summary
          </Typography>
          <Typography variant="h6" gutterBottom>
            SubTotal ({cartItems.length} items) : {calculateTotal()}.00 LKR
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
        </CardActions>
      </Card>
    </Box>
  );
};

export default Mobile_Checkout;
