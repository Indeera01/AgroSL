import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography, Grid, Badge } from "@mui/material";
import Navigation_Bar from "./Navigation_Bar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Item_Review from "./Item_Review";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Item from "./Item";
import Modal from "@mui/material/Modal";
import Chat from "../Pages/Chat";
import ChatIcon from "@mui/icons-material/Chat";
import { ClockIcon } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";

const Item_View = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  console.log(id);

  const location = useLocation(); // Access useLocation
  const user = location.state?.user;
  console.log(user);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get(`https://backend-rho-three-58.vercel.app/items/${id}`)
      .then((res) => {
        setItem(res.data[0]);
        console.log("Fetched item data:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, reviews]);

  useEffect(() => {
    axios
      .get(`https://backend-rho-three-58.vercel.app/reviews/${id}`)
      .then((res) => {
        setReviews(res.data);
        console.log("Fetched reviews:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError("Error fetching reviews");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://backend-rho-three-58.vercel.app/getseller/${item?.seller_id}`
      )
      .then((res) => {
        setStore(res.data.store_name);
        console.log("Fetched store:", res.data.store_name);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching store:", err);
        setError("Error fetching store");
        setLoading(false);
      });
  }, [item]);

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    } else {
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      alert("Please log in to submit reviews for items");
      return;
    }

    if (reviewText.trim() && ratingValue > 0) {
      try {
        const response = await axios.post(
          "https://backend-rho-three-58.vercel.app/reviews",
          {
            item_id: id,
            description: reviewText,
            rating: ratingValue,
            buyer_id: user.user_id,
          }
        );

        if (response.status === 201) {
          setReviews([
            ...reviews,
            {
              item_id: id,
              description: reviewText,
              rating: ratingValue,
              buyer_id: user.user_id,
              first_name: user.first_name,
              last_name: user.last_name,
            },
          ]);
          console.log(response.data);
          // Alert the user about the successful submission
          alert("Review submitted successfully!");
          // Clear the input fields
          setReviewText("");
          setRatingValue(0);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    } else {
      alert("Please provide a review and rating");
    }
  };

  const handleRatingChange = (event, newValue) => {
    setRatingValue(newValue);
  };

  const addToCart = async () => {
    if (!user) {
      alert("Please log in to add items to the cart");
      return;
    }
    try {
      const buyer_id = user.user_id;
      const item_id = item.item_id;
      const price = item.unit_price;

      const response = await axios.post(
        `https://backend-rho-three-58.vercel.app/cart`,
        {
          buyer_id: buyer_id,
          item_id: item_id,
          quantity: quantity,
          price: price,
        }
      );

      alert("Item Succssfully added to the cart");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("This item is already in the cart");
      } else {
        console.error("Error adding item to cart:", err);
      }
      setError(err.message);
    }
  };

  const getRatingCounts = (reviews) => {
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(({ rating }) => {
      const roundedRating = Math.floor(rating); // You can change this to `Math.round` if needed
      if (roundedRating >= 5) {
        ratingCounts[5]++;
      } else if (roundedRating >= 4) {
        ratingCounts[4]++;
      } else if (roundedRating >= 3) {
        ratingCounts[3]++;
      } else if (roundedRating >= 2) {
        ratingCounts[2]++;
      } else {
        ratingCounts[1]++;
      }
    });

    return ratingCounts;
  };

  const ratingCounts = getRatingCounts(reviews);

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
      <Box
        sx={{
          padding: { xs: "10px", md: "20px" }, // Adjust padding for mobile and larger screens
          backgroundColor: "white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack elements on mobile
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "20px",
          marginBottom: "20px",
          marginX: { xs: "10px", md: "200px" }, // Adjust margins for mobile
          borderRadius: "10px",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "70%" } }}>
          <img
            src={item.image_url}
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </Box>
        <Box
          sx={{ width: { xs: "100%", md: "30%" }, marginLeft: { md: "40px" } }}
        >
          <Typography variant="h6" gutterBottom>
            {store}
          </Typography>
          <Typography variant="h6">{item.item_name}</Typography>
          <Rating
            name="rating"
            value={parseFloat(item.average_rating_value)}
            precision={0.1}
            readOnly
          />
          <Typography>{reviews.length} ratings</Typography>
          <Typography variant="h7">{item.description}</Typography>
          <Typography gutterBottom variant="h6" component="div">
            LKR : {item.unit_price} / {item.unit_type}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Units left: {item.quantity}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            Quantity:
            <Button
              size="small"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </Button>
            {quantity}
            <Button
              size="small"
              onClick={handleAdd}
              disabled={quantity >= item.quantity}
            >
              <AddIcon />
            </Button>
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            Total: {item.unit_price * quantity} LKR
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box marginTop={2}>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={addToCart}
              >
                Add to cart
              </Button>
            </Box>

            <Box marginTop={2}>
              <Button onClick={handleOpen}>Chat with Seller</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          padding: { xs: "10px", md: "20px" }, // Adjust padding for mobile and larger screens
          backgroundColor: "white",
          marginTop: "20px",
          marginBottom: "20px",
          marginX: { xs: "10px", md: "200px" }, // Adjust margins for mobile
          borderRadius: "10px",
          justifyContent: "center",
        }}
      >
        <Typography gutterBottom variant="h5" color="primary">
          Reviews and Ratings
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
            width: { xs: "100%", md: "70%" }, // Adjust width for mobile
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography variant="h4" gutterBottom>
              {item.average_rating_value}/5
            </Typography>
            <Rating
              name="rating"
              value={parseFloat(item.average_rating_value)}
              precision={0.1}
              readOnly
            />
            <Typography>{reviews.length} ratings</Typography>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {Object.entries(ratingCounts).map(([rating, count]) => (
              <Box
                key={rating}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Rating
                  name={`rating-${rating}`}
                  value={parseInt(rating)}
                  precision={0.1}
                  readOnly
                />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  ({count})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Grid item xs={12} sm={6} key={review.review_id}>
                  <Item_Review review={review} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 2, ml: 4 }}>
                No reviews yet
              </Typography>
            )}
          </Grid>

          {/* Review submission form */}
          <Stack spacing={2} mt={3}>
            <TextField
              label="Write a review"
              multiline
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(event, newValue) => setRatingValue(newValue)}
            />
            <Button variant="contained" onClick={handleReviewSubmit}>
              Submit Review
            </Button>
          </Stack>
        </Box>
      </Box>
      {open && (
        <Box
          sx={{
            position: "fixed",
            top: "70%",
            left: "85%",
            bottom: "20%",
            transform: "translate(-50%, -50%)",
            width: { md: "25%", xs: "60%" },
            height: "50%", // Add height so the chat box has a fixed size
            maxHeight: "600px", // You can control the max height of the outer box
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 1,
            display: "flex", // Ensure that the content inside can be flexed
            flexDirection: "column", // Align the content in a column (close button and chat)
            overflow: "hidden", // Prevent the outer box itself from scrolling
          }}
        >
          <Button
            onClick={handleClose}
            sx={{ alignSelf: "flex-end", color: "red" }}
          >
            {" "}
            {/* Align Close button to the top right */}
            <CloseIcon />
          </Button>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <Chat
              userId={user?.user_id}
              chatPartnerId={item?.seller_id}
              partnerName={store}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Item_View;
