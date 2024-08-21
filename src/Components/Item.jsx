import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, CardHeader, Rating } from '@mui/material';
import axios from 'axios';
import backgroundImg from '../assets/background.jpg';

const Item = ({ item }) => {
  const [storeName, setStoreName] = React.useState('Unknown Seller');

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

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name) => {
    const initials = name.split(' ').map((word) => word[0]).join('');
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 50,
        height: 50,
      },
      children: initials,
    };
  };

  const getseller = (id) => {
    axios.get(`http://localhost:5001/getseller/${id}`)
      .then((res) => {
        setStoreName(res.data.store_name || 'Unknown Seller');
        console.log(storeName);
      })
      .catch((err) => {
        console.error('Error fetching seller:', err);
      });
  };

  return (
    <Card sx={{ minWidth: { md: 260, xs: 350 } }}>
      <CardHeader
        avatar={<Avatar {...stringAvatar(storeName)} />}
        title={storeName}
        subheader="September 14, 2016"
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
          {item.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" variant="contained" color="primary" fullWidth>
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default Item;
