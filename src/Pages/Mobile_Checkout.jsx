import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PwNGE05CsRawMoqM7YEL8tcA6xpOuDUJJ1oRSImOq9ndmJxlWHlqvlYLIg7aXlxJCXAQqCHbWAOVakInuTx4ql100M5xx4oan"
);

const Mobile_Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const { user_id } = useParams();

  useEffect(() => {
    if (user_id) {
      const fetchCartItems = async (user_id) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/cart/${user_id}`
          );
          setCartItems(response.data);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setCartItems([]);
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchCartItems(user_id);
    }
  }, [user_id]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleCheckout = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("Card Element not found");
      return;
    }

    try {
      const chargeAmount = Math.round(calculateTotal() * 100);
      const chargeResponse = await axios.post(
        "https://backend-rho-three-58.vercel.app/create-charge",
        {
          amount: chargeAmount,
        }
      );

      if (!chargeResponse.data.success) {
        throw new Error("Charge was not successful");
      }

      const response = await axios.post(
        "https://backend-rho-three-58.vercel.app/create-payment-intent",
        {
          user_id: user_id,
          cartItems: cartItems,
        }
      );

      const { clientSecret, transferData } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          await axios.post(
            "https://backend-rho-three-58.vercel.app/transfer-payment",
            {
              paymentIntentId: result.paymentIntent.id,
              transferData,
            }
          );

          try {
            console.log(user);
            console.log("for the email:", cartItems);
            const responseMail = await axios.post(
              "https://backend-rho-three-58.vercel.app/send-confirmation",
              {
                user_email: user.email,
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

          for (const item of cartItems) {
            await axios.delete(
              `https://backend-rho-three-58.vercel.app/cart/${user_id}/${item.item_id}`
            );
            await axios.post(`https://backend-rho-three-58.vercel.app/orders`, {
              buyer_id: user_id,
              item_id: item.item_id,
              is_confirmed: true,
              seller_id: item.seller_id,
              order_quantity: item.quantity,
            });
          }

          setCartItems([]);
          alert("Order placed successfully!");
          navigate("/Success");
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f0f8ff",
        padding: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: "90%",
          maxWidth: "400px",
          padding: 3,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#4B8412", textAlign: "center" }}
        >
          Order Summary
        </Typography>
        <Typography variant="body1" gutterBottom>
          SubTotal ({cartItems.length} items): {calculateTotal()}.00 LKR
        </Typography>
        <Typography variant="body1" gutterBottom>
          Delivery Fee: 400.00 LKR
        </Typography>
        <Typography variant="body1" gutterBottom>
          Discount: _
        </Typography>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ color: "#4B8412" }}
        >
          Total: {calculateTotal() + 400}.00 LKR
        </Typography>
        <CardElement
          style={{
            marginBottom: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ padding: "12px", fontSize: "1.1rem" }}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </Card>
    </Box>
  );
};

export default Mobile_Checkout;
