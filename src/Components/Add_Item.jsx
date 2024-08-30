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
import { Category } from "@mui/icons-material";
import Navigation_Bar_Seller from "./Navigation_Bar_Seller";
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
          fetch("http://localhost:5001/api/items", {
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
