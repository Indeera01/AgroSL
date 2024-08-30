import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "../assets/image.png"; // Replace with the path to your image

const NoItems = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="70vh"
      textAlign="center"
      width={"70%"}
    >
      <img src={Image} alt="No Items" width={300} height={300} />
      <Typography variant="h6" mt={2}>
        No items found.
      </Typography>
    </Box>
  );
};

export default NoItems;
