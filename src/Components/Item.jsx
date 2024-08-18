import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import backgroundImage from '../assets/background.jpg';
import { Avatar, CardHeader,Rating } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';


const Item = ({ item }) => {
  const [value, setValue] = React.useState(2);

  function stringToColor(string) {
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
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 50,
        height: 50
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }



  return (
    <Card sx={{ minWidth: { md: 260, xs: 350 } }} >
      <CardHeader
        avatar={
           <Avatar {...stringAvatar(`${item.seller? item.seller : 'Unknown Seller'}`)} />
        }
        title= {item.seller? item.seller : 'Unknown Seller'}
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={backgroundImage}
      />
      <CardContent sx={{ p: 2 }}>
        <Rating
        name="simple-controlled"
        value={item.average_rating_value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
       />
        <Typography gutterBottom variant="h6" component="div">
        {item.name}
        </Typography>
        
        <Typography gutterBottom variant="h6" component="div">
          LKR : {item.price}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary" component="div">
          Quantity: {item.quantity}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" variant="contained" color="primary" fullWidth>Add To Cart</Button>
      </CardActions>
    </Card>
  )
}

export default Item
