import React from "react";
import backgroundImage from "../assets/background.jpg";
import { Container, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <Box
      width="100%"
      height="100vh"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)", // Add dark overlay on background image
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          borderRadius: 4,
          boxShadow: 4,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.9))",
          position: "relative",
          zIndex: 2, // Ensures container is above the background overlay
        }}
      >
        <CheckCircleIcon color="success" sx={{ fontSize: 100, mb: 2 }} />

        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
        >
          Account Created Successfully!
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 3, color: "#555" }}
        >
          You can now log in and start using your account.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/Sign_In")}
          sx={{
            mt: 2,
            width: "100%",
            backgroundColor: "#007bff",
            fontSize: "16px",
            py: 1.5,
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
        >
          Go to Log In Page
        </Button>
      </Container>
    </Box>
  );
};

export default Success;
