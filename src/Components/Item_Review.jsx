import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, CardHeader, Rating } from "@mui/material";

const Item_Review = ({ review }) => {
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
        width: 50,
        height: 50,
      },
      children: initials,
    };
  };

  return (
    <Card
      sx={{
        minWidth: { md: 260, xs: 350 },
        border: "2px solid black",
        marginRight: "20px",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            {...stringAvatar(review.first_name + " " + review.last_name)}
          />
        }
        title={review.first_name + " " + review.last_name}
      />
      <CardContent sx={{ p: 2 }}>
        <Rating
          name="rating"
          value={parseFloat(review.rating)}
          precision={0.1}
          readOnly
        />
        <Typography gutterBottom variant="h6" component="div">
          {review.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Item_Review;
