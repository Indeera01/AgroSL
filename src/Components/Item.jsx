import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, CardHeader, Rating } from "@mui/material";
import axios from "axios";
import backgroundImg from "../assets/background.jpg";

const Item = ({ item, onCardClick }) => {
  const [storeName, setStoreName] = React.useState("Unknown Seller");

  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    console.log("add to cart clicked");
  };

  useEffect(() => {
    if (item.seller_id) {
      getseller(item.seller_id);
    }
  }, [item.seller_id]);

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 45,
        height: 45,
      },
      children: initials,
    };
  };

  const getseller = (id) => {
    axios
      .get(`http://localhost:5001/getseller/${id}`)
      .then((res) => {
        setStoreName(res.data.store_name || "Unknown Seller");
        console.log(storeName);
      })
      .catch((err) => {
        console.error("Error fetching seller:", err);
      });
  };

  return (
    <Card
      sx={{
        minWidth: { md: 260, xs: 350 },
        borderRadius: "10px", // Optional: rounded corners
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional: soft shadow
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardHeader
        avatar={<Avatar {...stringAvatar(storeName)} />}
        title={storeName}
        sx={{ padding: "8px", marginLeft: "5px" }}
      />
      <CardMedia
        component="img"
        alt={item.item_name}
        height="140"
        image={item.image_url}
      />
      <CardContent sx={{ p: 2 }}>
        <Rating
          name="rating"
          value={parseFloat(item.average_rating_value)}
          precision={0.1}
          readOnly
        />
        <Typography gutterBottom variant="h6" component="div">
          {item.item_name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          LKR : {item.unit_price} / unit
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Available Quantity: {item.quantity}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </Typography>
      </CardContent>

      {/* Add to Cart Button */}
      <CardActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={handleCardClick}
        >
          View Item
        </Button>
      </CardActions>
    </Card>

    /*
    <Card
      sx={{
        minWidth: { md: 260, xs: 350 },
        borderRadius: "10px", // Rounded corners for a modern look
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for elegance
        transition: "transform 0.3s, box-shadow 0.3s", // Smooth transition
        "&:hover": {
          transform: "scale(1.05)", // Slight zoom on hover
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Stronger shadow on hover
        },
        cursor: "pointer", // Indicate that it's clickable
      }}
      onClick={handleCardClick}
    >
      <CardHeader
        avatar={<Avatar {...stringAvatar(storeName)} />}
        title={storeName}
        sx={{
          padding: "8px",
          marginLeft: "5px",
          fontWeight: "bold", // Make the store name bold
        }}
      />
      <CardMedia
        component="img"
        alt={item.item_name}
        height="140"
        image={item.image_url}
        sx={{
          borderRadius: "10px 10px 0 0", // Rounded top corners to match the card
          transition: "transform 0.3s", // Smooth image scaling
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom on image hover
          },
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Rating
          name="rating"
          value={parseFloat(item.average_rating_value)}
          precision={0.1}
          readOnly
        />
        <Typography gutterBottom variant="h6" component="div">
          {item.item_name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          LKR : {item.unit_price} / unit
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Available Quantity: {item.quantity}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </Typography>
      </CardContent>
    </Card>*/
  );
};

export default Item;
