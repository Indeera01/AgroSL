import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Link,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/pxfuel.jpg";
import axios from "axios";
import GoogleIcon from "@mui/icons-material/Google";

const provider = new GoogleAuthProvider(); // Initialize Google Provider

const Sign_In = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", email);
      handleUserRedirection(auth.currentUser);
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Error signing in");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google User signed in:", user.email);
      handleUserRedirection(user);
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      alert("Google Sign-In failed");
    }
  };

  const handleUserRedirection = async (currentUser) => {
    try {
      const response = await axios.get(
        `https://backend-rho-three-58.vercel.app/get_user/${currentUser.uid}`
      );

      const userType = response.data.user_type;
      console.log("User type:", userType);
      if (userType === "buyer") {
        navigate(`/Home/${currentUser.uid}`);
      } else if (userType === "seller") {
        navigate(`/seller_dashboard/${currentUser.uid}`);
      } else if (userType === "delivery_rider") {
        navigate(`/delivery_rider_dashboard/${currentUser.uid}`);
      } else {
        alert("User type not recognized");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const admin = await axios.get(
            `https://backend-rho-three-58.vercel.app/admin/${currentUser.uid}`
          );

          if (admin.data && admin.data.user_id) {
            navigate("/admin");
          } else {
            alert("User type not recognized");
          }
        } catch (adminError) {
          console.error("Error checking admin table:", adminError);
          alert("Error signing in");
        }
      } else {
        console.error("Error fetching user data:", error);
        alert("Error signing in");
      }
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "absolute",
        padding: { xs: "30px" },
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 3, sm: 4 },
          borderRadius: 6,
          boxShadow: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          marginTop: { xs: "40%", sm: "10%" },
        }}
      >
        <Typography
          variant="h4"
          fontFamily="open-sans"
          gutterBottom
          mb={2}
          align="center"
        >
          Sign In
        </Typography>
        <TextField
          label="Email Address"
          variant="outlined"
          margin="dense"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="dense"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignIn}
          sx={{ mt: 2, width: { xs: "70%", sm: "40%" }, fontSize: "16px" }}
        >
          Sign In
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleGoogleSignIn}
          sx={{
            mt: 2,
            width: { xs: "70%", sm: "40%" },
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            borderColor: "#4285F4", // Google's primary color
            color: "#4285F4",
            "&:hover": {
              backgroundColor: "rgba(66, 133, 244, 0.1)",
            },
            textTransform: "none",
          }}
        >
          <GoogleIcon sx={{ fontSize: 24 }} />
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }} align="center">
          Don’t have an account?{" "}
          <Box
            display={"flex"}
            flexDirection={{ xs: "column", sm: "row" }}
            width={"100%"}
            gap={2}
            mt={1}
            justifyContent="center"
          >
            <Link
              color="secondary"
              href="/Sign_Up_Buyer"
              style={{ display: "block", marginBottom: "8px" }}
            >
              Sign Up Buyer
            </Link>
            <Link color="secondary" href="/Sign_Up_Delivery_Rider">
              Sign Up Delivery Rider
            </Link>
          </Box>
        </Typography>
      </Container>
    </Box>
  );
};

export default Sign_In;
