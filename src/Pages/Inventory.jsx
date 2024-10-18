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
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Inventory_item from "../Components/Inventory_item";
import AddCardIcon from "@mui/icons-material/AddCard";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);

  const navigate = useNavigate();

  const handlePostItemClick = () => {
    const sellerId = window.location.pathname.split("/")[2];

    navigate(`/add_item/${sellerId}`);
  };

  useEffect(() => {
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
    }
  }, []); // Empty dependency array, runs once on mount

  useEffect(() => {
    // Fetch items when user data is available
    if (user?.user_id) {
      const fetchItems = async (userID) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/items_seller/${userID}`
          );
          setItems(response.data);
          console.log("Cart items:", response.data);
        } catch (err) {
          // Handle 404 or any other errors
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
    // Fetch store name when user data is available
    if (user?.user_id) {
      const fetchStore = async (userID) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/getseller/${userID}`
          );
          setStore(response.data.store_name);
          console.log("Store", response.data.store_name);
        } catch (err) {
          // Handle 404 or any other errors
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
      await axios.delete(`https://backend-rho-three-58.vercel.app/items/${id}`);
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
    <Box sx={{ backgroundColor: "#e6ffe6" }}>
      <Navigation_Bar_Seller />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            margin: "0 auto",
            marginTop: "20px",
            marginBottom: "20px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{ color: "#4B8412", textAlign: "center", margin: "10px" }}
          >
            Your Inventory
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: "20px",
            }}
          >
            <Box sx={{ width: "75%" }}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ backgroundColor: "#DFF2BF" }}
                  aria-label="simple table"
                >
                  <TableHead sx={{}}>
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
            <Box sx={{ width: "25%" }}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ backgroundColor: "#F08080" }}
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
        <Box
          sx={{
            margin: "20px",
            backgroundColor: "white",
            padding: "10px",
            display: "inline-flex",
            flexDirection: "column",
            width: "auto",
            minWidth: 0,
            borderRadius: "10px",
            minWidth: "90%",
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{ color: "#4B8412", textAlign: "center", margin: "20px" }}
          >
            Update Your Inventory
          </Typography>
          <Box>
            <Grid
              container
              spacing={2}
              direction="row"
              alignItems="flex-start"
              justifyContent="flex-start"
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
                  No items in the Inventory
                </Typography>
              )}
              <Box
                sx={{
                  width: "250px",
                  height: "400px",
                  backgroundColor: "#98BC74",
                  margin: "20px",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handlePostItemClick}
              >
                <AddCardIcon
                  sx={{
                    fontSize: "80px",
                    color: "black",
                  }}
                />
                <Typography variant="h6" color={"black"}>
                  Add New Product
                </Typography>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Inventory;
