import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Link,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/pxfuel.jpg";
import axios from "axios";

const Sign_In = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", email);
      const currentUser = auth.currentUser;

      try {
        // Attempt to fetch user details from the users table
        const response = await axios.get(
          `http://localhost:5001/get_user/${currentUser.uid}`
        );

        const userType = response.data.user_type;
        console.log("User type:", userType);
        if (userType === "buyer") {
          navigate(`/Home/${currentUser.uid}`);
        } else if (userType === "seller") {
          navigate(`/seller_dashboard/${currentUser.uid}`);
        } else {
          alert("User type not recognized");
        }
      } catch (error) {
        // If a 404 error occurs, check the admin table
        if (error.response && error.response.status === 404) {
          console.log("User not found in users table, checking admin table...");
          try {
            const admin = await axios.get(
              `http://localhost:5001/admin/${currentUser.uid}`
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
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Error signing in");
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-Repeat",
        backgroundSize: "cover",
      }}
      position={"absolute"}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          borderRadius: 6,
          boxShadow: 3,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          marginTop: "10%",
        }}
      >
        <Typography variant="h4" fontFamily="open-sans" gutterBottom mb={2}>
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
          sx={{ mt: 2, width: "40%", fontSize: "16px" }}
        >
          Sign In
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link color="secondary" href="/Sign_Up_Buyer">
            Sign Up
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Sign_In;
