import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Grid,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

const Tracking = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleConfirmDelivery = () => {
    const formatDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
  
    const confirmationDate = formatDate();
    axios.patch(`http://localhost:5000/delivery/${delivery[0].id}`, { is_delivered_to_buyer: true, Confirmation: confirmationDate })
      .then((res) => {
        setDelivery(prevDelivery => {
          const updatedDelivery = { ...prevDelivery[0], is_delivered_to_buyer: true, Confirmation: confirmationDate };
          return [updatedDelivery];
        });
        alert('Delivery confirmed');
      })
      .catch((err) => {
        alert('Error confirming delivery: ' + err.message);
      });
  };

  useEffect(() => {
    axios.get('http://localhost:5000/delivery')
      .then((res) => {
        setDelivery(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
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

  if (!delivery) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          No delivery data found
        </Typography>
      </Box>
    );
  }

  const steps = [
    {
      title: 'Seller',
      description: `${delivery[0].delivered_to_sc ? 'Handed over to the nearby center' : 'Preparing Your Order'}`,
      isCompleted: delivery[0].delivered_to_sc,
    },
    {
      title: `Delivered to nearby Center : ${delivery[0].starting_center_id}`,
      description: `Time: ${delivery[0].delivered_to_sc ? delivery[0].delivered_to_sc : 'Not yet delivered'}`,
      isCompleted: delivery[0].delivered_to_sc,
    },
    {
      title: `Delivered to the Center near you : ${delivery[0].destination_center_id}`,
      description: `Time: ${delivery[0].delivered_to_dc ? delivery[0].delivered_to_dc : 'Not yet delivered'}`,
      isCompleted: delivery[0].delivered_to_dc,
    },
    {
      title: 'Delivered to Buyer',
      description: `Time: ${delivery[0].is_delivered_to_buyer ? delivery[0].Confirmation : 'Not yet delivered'}`,
      isCompleted: delivery[0].is_delivered_to_buyer,
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
    <Box width={isMobile ? '95%' : '80%'} ml={isMobile ? '2.5%' : '10%'}>
      <Box p={isMobile ? 1 : 3} display="flex" flexDirection="column" height="auto" bgcolor="yellow">
        <Typography variant="h6" gutterBottom align='center' mb={4}>
          Delivery Progress
        </Typography>
        <Typography variant='body1' gutterBottom mb={4}> 
          Your Order Delivery Id : {delivery[0].delivery_id}<br/>
          Your Order Id : {delivery[0].order_id}<br/>
          Delivery Man : {delivery[0].delivery_rider_id ? delivery[0].delivery_rider_id : 'Not Yet Assigned'}        </Typography>
        <Stepper activeStep={getCurrentStep()} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((step, index) => (
            <Step key={index} completed={step.isCompleted}>
              <StepLabel>
                <div>
                  <strong>{step.title}</strong>
                  <div>{step.description}</div>
                </div>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4}>
          {steps.map((step, index) => (
            step.isCompleted ? 
              <React.Fragment key={index}>
                <Typography variant="h6">{step.title}</Typography>
                <Typography variant="h7">{step.description}</Typography>
                <Divider />
              </React.Fragment>
            : null
          ))}
        </Box>
        <Button
          variant='contained'
          sx={{ width: 'auto', borderRadius: 3, marginTop: 5, alignSelf: 'center' }}
          onClick={handleConfirmDelivery}
          disabled={delivery[0].is_delivered_to_buyer}
        >
          Confirm Delivery
        </Button>
      </Box>
    </Box>
  );
};

export default Tracking;
