import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography, Grid } from "@mui/material";
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

const Item_View = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
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

  useEffect(() => {
    axios
      .get(`http://localhost:5001/items/${id}`)
      .then((res) => {
        setItem(res.data[0]);
        console.log("Fetched item data:", res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/reviews/${id}`)
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
    if (reviewText.trim() && ratingValue > 0) {
      try {
        const response = await axios.post("http://localhost:5001/reviews", {
          item_id: id,
          description: reviewText,
          rating: ratingValue,
          buyer_id: user.user_id,
        });

        if (response.status === 200) {
          setReviews([...reviews, response.data]);

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
    try {
      const buyer_id = user.user_id;
      const item_id = item.item_id;
      const price = item.unit_price * quantity;

      const response = await axios.post(`http://localhost:5001/cart`, {
        buyer_id: buyer_id,
        item_id: item_id,
        quantity: quantity,
        price: price,
      });
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError(err.message);
    }
  };

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
    <Box>
      <Navigation_Bar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            width: "25%",
            margin: "0 auto",
            marginTop: "20px",
          }}
        >
          <Box>
            <Card
              sx={{
                width: "100%",
                border: "2px solid black",
              }}
            >
              <CardMedia
                component="img"
                alt={item.item_name}
                image={item.image_url}
                sx={{
                  width: "100%", // Make sure the image takes the full width of the parent Box
                  height: "auto", // Maintain aspect ratio based on the image's width
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {item.item_name}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  LKR : {item.unit_price} / unit
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  Units left: {item.quantity}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Quantity:
                  <Button size="small" onClick={handleDecrease}>
                    <RemoveIcon />
                  </Button>
                  {quantity}
                  <Button size="small" onClick={handleAdd}>
                    <AddIcon />
                  </Button>
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Total: {item.unit_price * quantity} LKR
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={addToCart}
                >
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Box
            sx={{
              backgroundColor: "#98BC74",
              padding: "5px",
              border: "2px solid black",
              marginTop: "20px",
            }}
          >
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Add a Review"
                variant="outlined"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </Box>
            <Stack spacing={1}>
              <Rating
                name="half-rating"
                value={ratingValue}
                onChange={handleRatingChange}
                precision={0.1}
              />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReviewSubmit}
              sx={{ mt: 2 }}
            >
              Submit Review
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: "50%" }}>
          <Grid sx={{ width: "100%" }}>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Item_Review key={review.review_id} review={review} />
              ))
            ) : (
              <Typography variant="h6" sx={{ mt: 2 }}>
                No reviews yet
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Item_View;
