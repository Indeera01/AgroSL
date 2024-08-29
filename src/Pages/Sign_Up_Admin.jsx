import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Link,
} from "@mui/material";
import backgroundImage from "../assets/pxfuel.jpg";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";

const Sign_Up_Admin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [reenteredpassword, setReenteredpassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.validity.valid) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleSignUp = async () => {
    if (password !== reenteredpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user);

      const userId = user.uid;
      const newUser = {
        user_id: userId,
        email: email,
      };
      alert("Account created successfully");
      clearFields();
      navigate("/Success");
      axios
        .post("http://localhost:5001/admins", newUser)
        .then((response) => {
          alert("Account created successfully");
          clearFields();
          navigate("/Success");
        })
        .catch((error) => {
          console.error("Error creating account:", error);
        });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating account");
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setReenteredpassword("");
  };

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      position={"absolute"}
      padding={8}
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
        }}
      >
        <Typography variant="h4" fontFamily="open-sans" gutterBottom mb={2}>
          Create an Admin Account
        </Typography>
        <TextField
          label="Email Address"
          variant="outlined"
          margin="dense"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e)}
          required
          helperText={
            emailError ? "Enter a valid email address ie: dummy@gmail.com" : ""
          }
          inputProps={{
            pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}",
          }}
          size="small"
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
          size="small"
        />
        <TextField
          label="Re-Enter Password"
          variant="outlined"
          type="password"
          margin="dense"
          fullWidth
          value={reenteredpassword}
          onChange={(e) => setReenteredpassword(e.target.value)}
          required
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ mt: 2, width: "50%", fontSize: "16px" }}
        >
          Create an Admin
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link color="secondary" href="/Sign_In">
            Sign in
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Sign_Up_Admin;
