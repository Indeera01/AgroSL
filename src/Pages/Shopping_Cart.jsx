import React, { useState } from "react";
import { Box } from "@mui/material";
import Navigation_Bar from "../Components/Navigation_Bar";
import axios from "axios";
import Cart_item from "../Components/Cart_item";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    // Sample items
    {
      id: 1,
      item_name: "Item 1",
      unit_price: 100,
      quantity: 2,
      image_url: "/path/to/image.jpg",
    },
    {
      id: 2,
      item_name: "Item 2",
      unit_price: 200,
      quantity: 1,
      image_url: "/path/to/image2.jpg",
    },
  ]);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <Box>
      <Navigation_Bar />
      <div>
        {cartItems.map((item) => (
          <Cart_item key={item.id} item={item} onRemove={handleRemoveItem} />
        ))}
      </div>
    </Box>
  );
};

export default ShoppingCart;
