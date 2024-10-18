import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const Tracking = () => {
  const { orderID } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Helper function to format the current date and time
  const formatDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Confirm delivery by making an API call
  const handleConfirmDelivery = () => {
    const confirmationDate = formatDate();
    axios
      .patch(
        `https://backend-rho-three-58.vercel.app/delivery/${orderData.delivery_id}`,
        {
          is_delivered_to_buyer: true,
          confirmation_date: confirmationDate,
        }
      )
      .then(() => {
        setOrderData((prevOrderData) => ({
          ...prevOrderData,
          is_delivered_to_buyer: true,
          confirmation_date: confirmationDate,
        }));
        alert("Delivery confirmed");
      })
      .catch((err) => {
        alert("Error confirming delivery: " + err.message);
      });
  };

  useEffect(() => {
    let isMounted = true; // Prevent state update if the component unmounts

    axios
      .get(
        `https://backend-rho-three-58.vercel.app/delivery-by-orderID/${orderID}`
      )
      .then((res) => {
        console.log(res.data);
        if (isMounted) {
          setOrderData(res.data[0]);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "No delivery data found"
              : err.message
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // Cleanup function to prevent memory leak
    };
  }, [orderID]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={10}
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

  const steps = [
    {
      title: "Order Processed",
      description: "The order has been processed.",
      isCompleted: orderData?.delivery_status !== "Delivery Processing", // Fix
    },
    {
      title: "Sent to Delivery Rider",
      description: orderData?.delivered_to_sc
        ? `Delivered to delivery rider (${orderData.delivery_rider_id}) on ${orderData.delivered_to_sc}`
        : "Not yet delivered to delivery rider",
      isCompleted: orderData?.delivered_to_sc !== null,
    },
    {
      title: "Delivered to Buyer",
      description: orderData?.is_delivered_to_buyer
        ? `Delivered to buyer on ${orderData.confirmation_date}`
        : "Not yet delivered to buyer",
      isCompleted: orderData?.is_delivered_to_buyer,
    },
  ];

  const getCurrentStep = () => {
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].isCompleted) {
        return i;
      }
    }
    return steps.length;
  };

  return (
    <Box
      width={isMobile ? "95%" : "60%"}
      ml={isMobile ? "2.5%" : "20%"}
      mt={8}
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "16px",
        boxShadow: 3,
        p: 4,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Delivery Progress
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 2, fontSize: "1.2rem" }}
        >
          Order ID: <strong>{orderData.order_id}</strong>
          <br />
          Delivery ID: <strong>{orderData.delivery_id}</strong>
        </Typography>

        <Stepper
          activeStep={getCurrentStep()}
          alternativeLabel={!isMobile}
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{ width: "100%", mt: 2, mb: 4 }}
        >
          {steps.map((step, index) => (
            <Step key={index} completed={step.isCompleted}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: isMobile ? "1rem" : "1.2rem",
                    fontWeight: step.isCompleted ? "bold" : "normal",
                  },
                }}
              >
                {step.title}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: "#f5f5f5",
            width: "100%",
            mb: 4,
          }}
        >
          {steps.map(
            (step, index) =>
              step.isCompleted && (
                <React.Fragment key={index}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {step.description}
                  </Typography>
                  {index !== steps.length - 1 && <Divider sx={{ my: 2 }} />}
                </React.Fragment>
              )
          )}
        </Paper>

        <Button
          variant="contained"
          onClick={handleConfirmDelivery}
          disabled={orderData.is_delivered_to_buyer}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 8,
            textTransform: "none",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {orderData.is_delivered_to_buyer
            ? "Delivery Confirmed"
            : "Confirm Delivery"}
        </Button>
      </Box>
    </Box>
  );
};

export default Tracking;
