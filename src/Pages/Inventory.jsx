import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { Box, Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Inventory_item from "../Components/Inventory_item";

const Inventory = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);

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
    // Fetch items when user data is available
    if (user?.user_id) {
      const fetchItems = async (userID) => {
        try {
          const response = await axios.get(
            `http://localhost:5001/items_seller/${userID}`
          );
          setItems(response.data);
          console.log("Cart items:", response.data);
        } catch (err) {
          // Handle 404 or any other errors gracefully
          if (err.response && err.response.status === 404) {
            setItems([]); // Set Items to empty array if 404 error
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchItems(user.user_id); // Call the function with user.uid
    }
  }, [user]);

  useEffect(() => {
    // Fetch items when user data is available
    if (user?.user_id) {
      const fetchStore = async (userID) => {
        try {
          const response = await axios.get(
            `http://localhost:5001/getseller/${userID}`
          );
          setStore(response.data.store_name);
          console.log("Store", response.data.store_name);
        } catch (err) {
          // Handle 404 or any other errors gracefully
          if (err.response && err.response.status === 404) {
            setStore(null); // Set Items to empty array if 404 error
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchStore(user.user_id); // Call the function with user.uid
    }
  }, [user]);

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/items/${id}`);
      setItems(items.filter((item) => item.item_id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.item_id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box>
      <Navigation_Bar_Seller />
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
            backgroundColor: "#4B8412",
            padding: "2px",
          }}
        >
          <Card sx={{ backgroundColor: "#DFF2BF" }}>
            <CardMedia
              component="img"
              sx={{
                width: "100%", // Make sure the image takes the full width of the parent Box
                height: "auto", // Maintain aspect ratio based on the image's width
                objectFit: "cover",
              }}
              image={
                user.image_url
                  ? user.image_url
                  : "https://firebasestorage.googleapis.com/v0/b/agrosl-7abb2.appspot.com/o/items%2Fdefault_user.jpg?alt=media&token=9d2d5193-73f0-4ba2-9776-06b91c4ca354"
              }
              title={user.first_name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {store}
              </Typography>
              <Typography variant="h6">
                Owner : {user.first_name} {user.last_name}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            width: "50%",
            margin: "0 auto",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Box>
            <Box>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650, backgroundColor: "#DFF2BF" }}
                  aria-label="simple table"
                >
                  <TableHead sx={{ backgroundColor: "#4B8412" }}>
                    <TableRow>
                      <TableCell align="center">Item Name</TableCell>
                      <TableCell align="center">Unit price</TableCell>
                      <TableCell align="center">Available quantity</TableCell>
                      <TableCell align="center">Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow
                        key={item.item_name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{item.item_name}</TableCell>
                        <TableCell align="center">{item.unit_price}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="center">
                          {item.average_rating_value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box sx={{ marginTop: "40px" }}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650, backgroundColor: "#F08080" }}
                  aria-label="simple table"
                >
                  <TableHead sx={{ backgroundColor: "#E31837" }}>
                    <TableRow>
                      <TableCell align="center">Low Stocks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.filter((item) => item.quantity < 20).length === 0 ? (
                      <TableRow>
                        <TableCell align="center" colSpan={4}>
                          Everything is full!
                        </TableCell>
                      </TableRow>
                    ) : (
                      items
                        .filter((item) => item.quantity < 20)
                        .map((item) => (
                          <TableRow
                            key={item.item_name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">
                              {item.item_name}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          margin: "20px",
          backgroundColor: "#4B8412",
          padding: "10px",
          display: "inline-flex", // Allows the Box to adjust its size based on content
          flexDirection: "column", // Ensures that the Grid is contained within the Box
          width: "auto", // Allows the Box to grow with its content
          minWidth: 0,
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{ color: "white", textAlign: "center", margin: "20px" }}
        >
          Update Inventory
        </Typography>
        <Box>
          <Grid
            container
            spacing={2} // Adjust spacing between items as needed
            direction="row" // Display items in a row
            alignItems="flex-start" // Align items to the start of the container vertically
            justifyContent="flex-start" // Align items to the start of the container horizontally
          >
            {items.length > 0 ? (
              items.map((item) => (
                <Inventory_item
                  key={item.item_id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              ))
            ) : (
              <Typography variant="h4" component="h2">
                No items in the cart
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Inventory;
