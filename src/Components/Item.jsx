import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, CardHeader, Rating, IconButton } from "@mui/material";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartCheckoutSharp";
import { useNavigate, useParams } from "react-router-dom";

const Item = ({ item, onCardClick }) => {
  const [storeName, setStoreName] = React.useState("Unknown Seller");
  const buyer_id = useParams().id;
  const navigate = useNavigate(); // To handle redirection

  const handleCardClick = () => {
    onCardClick(item);
  };

  const addToCart = async () => {
    if (buyer_id) {
      try {
        const item_id = item.item_id;
        const price = item.unit_price;

        const response = await axios.post(
          `http://backend-rho-three-58.vercel.app/cart`,
          {
            buyer_id: buyer_id,
            item_id: item_id,
            quantity: 1,
            price: price,
          }
        );

        alert("Item successfully added to the cart");
      } catch (err) {
        if (err.response && err.response.status === 409) {
          alert("This item is already in the cart");
        } else {
          console.error("Error adding item to cart:", err);
        }
      }
    } else {
      // Redirect to login page if the user is not logged in
      navigate("/Sign_In");
    }
  };

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the card
    addToCart();
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
      .get(`http://backend-rho-three-58.vercel.app/getseller/${id}`)
      .then((res) => {
        setStoreName(res.data.store_name || "Unknown Seller");
      })
      .catch((err) => {
        console.error("Error fetching seller:", err);
      });
  };

  return (
    <Card
      sx={{
        width: { md: 260, xs: 350 },
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <CardHeader
        avatar={<Avatar {...stringAvatar(storeName)} />}
        title={storeName}
        sx={{ padding: "8px", marginLeft: "5px" }}
      />

      <div style={{ position: "relative" }}>
        <CardMedia
          component="img"
          alt={item.item_name}
          height="140"
          image={item.image_url}
        />
        <IconButton
          sx={{
            position: "absolute",
            color: "black",
            bottom: "8px",
            right: "8px",
            zIndex: 5,
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "8px",
            "&:hover": {
              backgroundColor: "white",
              scale: 1.2,
            },
          }}
          onClick={handleButtonClick}
        >
          <ShoppingCartIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      </div>

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
          LKR : {item.unit_price} / {item.unit_type}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Available Quantity: {item.quantity}
        </Typography>
        <Typography mb={-2} variant="body2" color="text.secondary">
          {item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Item;
