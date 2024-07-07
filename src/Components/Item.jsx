import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import backgroundImage from '../assets/background.jpg';

const Item = ({item}) => {
  return (
    <Card sx={{ minWidth: { md: 200, xs: 320 },maxWidth:250 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="100"
        image={backgroundImage}
      />
      <CardContent sx={{ p: 0 }}>
        <Typography gutterBottom variant="h6" component="div">
          {item.price}
        </Typography>
        <Typography gutterBottom variant="h7" component="div">
          Quantity :{item.quantity}
        </Typography>
        <Typography gutterBottom variant="h7" component="div">
          Seller : {item.seller}
        </Typography>
      </CardContent>
      <CardActions sx={{justifyContent:'space-between'}}>
        <Button size="small" variant="contained" color="primary">Buy</Button>
        <Button size="small" variant="contained" color="primary">Add To Cart</Button>
      </CardActions>
    </Card>
  )
}

export default Item