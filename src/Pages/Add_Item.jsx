/*import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Add_Item.css";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Category } from "@mui/icons-material";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { Box } from "@mui/material";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA6G7lILKQ9c3MQ0umcmi-4RW4r72zkOFk",
  authDomain: "agrosl-7abb2.firebaseapp.com",
  projectId: "agrosl-7abb2",
  storageBucket: "agrosl-7abb2.appspot.com",
  messagingSenderId: "321966335054",
  appId: "1:321966335054:web:33f8ab854a66403434cf1f",
  measurementId: "G-SZKME5P15M",
  // Your Firebase configuration object
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const AddItem = () => {
  const { sellerId } = useParams(); // Extract seller ID from the URL
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

          // Prepare the item data including the image URL
          const itemData = {
            item_name: itemName,
            unit_price: unitPrice,
            quantity: quantity,
            image_url: downloadURL, // Set the image_url to the Firebase Storage URL
            description: description,
            seller_id: sellerId, // Use extracted seller ID
            unit_type: unitType,
            average_rating_value: 0, // Assuming default value
            category: category,
          };

          // Send the data to the backend API
          fetch("https://backend-rho-three-58.vercel.app/api/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          })
            .then((response) => {
              if (response.ok) {
                alert("Item added successfully!");
              } else {
                alert("Failed to add item.");
              }
            })
            .catch((error) => {
              console.error("Error adding item:", error);
            });
        });
      }
    );
  };

  return (
    <Box bgcolor={"#e6ffe6 "} height={"110vh"}>
      <Navigation_Bar_Seller />
      <Box mt={3} mb={3}>
        <div className="add-item-container">
          <form className="add-item-form" onSubmit={handleSubmit}>
            <label htmlFor="itemName">Item Name:</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />

            <label htmlFor="unitPrice">Unit Price:</label>
            <input
              type="number"
              step="0.01"
              id="unitPrice"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
            />

            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <label htmlFor="imageUrl">Image:</label>
            <input
              type="file"
              id="imageUrl"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="unitType">Unit Type:</label>
            <select
              id="unitType"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              required
            >
              <option value="per kg">Per kg</option>
              <option value="per litre">Per litre</option>
              <option value="per unit">Per unit</option>
            </select>

            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Seeds">Seeds</option>
              <option value="Vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="Animal Products">Animal Products</option>
            </select>

            <button type="submit">Add Item</button>
          </form>
        </div>
      </Box>
    </Box>
  );
};

export default AddItem;
*/
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

// Initialize Firebase
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
  const { sellerId } = useParams(); // Extract seller ID from the URL
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

          // Prepare the item data including the image URL
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

          // Send the data to the backend API
          fetch("https://backend-rho-three-58.vercel.app/api/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          })
            .then((response) => {
              if (response.ok) {
                alert("Item added successfully!");
                setItemName("");
                setUnitPrice("");
                setQuantity("");
                setDescription("");
                setUnitType("");
                setImage(null);
                setCategory("");
              } else {
                alert("Failed to add item.");
              }
            })
            .catch((error) => {
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
            {/* Image Upload */}
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

            {/* Item Name */}
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

            {/* Category */}
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

            {/* Unit Type */}
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

            {/* Unit Price */}
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

            {/* Quantity */}
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

            {/* Description */}
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

            {/* Submit Button */}
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
