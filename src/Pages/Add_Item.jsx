import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Add_Item.css";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";

import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyA6G7lILKQ9c3MQ0umcmi-4RW4r72zkOFk",
  authDomain: "agrosl-7abb2.firebaseapp.com",
  projectId: "agrosl-7abb2",
  storageBucket: "agrosl-7abb2.appspot.com",
  messagingSenderId: "321966335054",
  appId: "1:321966335054:web:33f8ab854a66403434cf1f",
  measurementId: "G-SZKME5P15M",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const AddItem = () => {
  const { sellerId } = useParams();
  const [itemName, setItemName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [unitType, setUnitType] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) return;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `items/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        // Get the download URL once the upload is complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          const itemData = {
            item_name: itemName,
            unit_price: unitPrice,
            quantity: quantity,
            image_url: downloadURL,
            description: description,
            seller_id: sellerId,
            unit_type: unitType,
            average_rating_value: 0,
            category: category,
          };

          fetch("https://backend-rho-three-58.vercel.app/api/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          })
            .then((response) => {
              alert("Item added successfully!");
              setItemName("");
              setUnitPrice("");
              setQuantity("");
              setDescription("");
              setUnitType("");
              setImage(null);
              setCategory("");
            })
            .catch((error) => {
              alert("Failed to add item.");
              console.error("Error adding item:", error);
            });
        });
      }
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#E6F4EA",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Item
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="file"
                label="Upload Image"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setImage(e.target.files[0])}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                variant="outlined"
                required
              >
                <MenuItem value="Seeds">Seeds</MenuItem>
                <MenuItem value="Vegetables">Vegetables</MenuItem>
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Animal Products">Animal Products</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Unit Type"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                variant="outlined"
                required
              >
                <MenuItem value="per kg">Per kg</MenuItem>
                <MenuItem value="per litre">Per litre</MenuItem>
                <MenuItem value="per unit">Per unit</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price (LKR)"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12} align="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddItem;
