import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const Cart_item = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <Card
      sx={{
        minWidth: { md: 260, xs: 260 },
        maxWidth: { md: 500, xs: 500 },
        backgroundColor: "#98BC74",
        margin: "20px",
      }}
    >
      <CardMedia
        component="img"
        alt={item.item_name}
        image={
          "https://firebasestorage.googleapis.com/v0/b/agrosl-7abb2.appspot.com/o/items%2FItem_1.webp?alt=media&token=ef3c838f-c361-46f1-bdbc-d0ee0a27f349"
        }
        sx={{
          maxWidth: "100px",
          maxHeight: "100px",
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
        <Typography gutterBottom variant="body2" color="text.secondary">
          Quantity:
          <Button
            size="small"
            disabled={quantity <= 1} // Disable button if quantity is 1
          >
            <RemoveIcon />
          </Button>
          {quantity}
          <Button size="small">
            <AddIcon />
          </Button>
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Total: LKR {item.unit_price * item.quantity}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => onRemove(item.id)} // Trigger remove function on button click
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default Cart_item;
