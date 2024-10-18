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
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import GoogleIcon from "@mui/icons-material/Google";

const SignUp = () => {
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [reenteredpassword, setReenteredpassword] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhonenumberError] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleFirstNameChange = (e) => {
    setFirstname(e.target.value);
    setFirstNameError(!e.target.validity.valid);
  };

  const handleLastNameChange = (e) => {
    setLastname(e.target.value);
    setLastNameError(!e.target.validity.valid);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!e.target.validity.valid);
  };

  const handlePhoneNumberChange = (e) => {
    setPhonenumber(e.target.value);
    setPhonenumberError(!e.target.validity.valid);
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

      const newUser = {
        user_id: user.uid,
        first_name: firstname,
        last_name: lastname,
        mobile_number: phonenumber,
        email: email,
        address_id: "",
        user_type: "buyer",
      };

      await axios.post(
        "https://backend-rho-three-58.vercel.app/users",
        newUser
      );
      alert("Account created successfully");
      clearFields();
      navigate("/Success");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating account");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const newUser = {
        user_id: user.uid,
        first_name: user.displayName.split(" ")[0] || "",
        last_name: user.displayName.split(" ")[1] || "",
        mobile_number: "",
        email: user.email,
        address_id: "",
        user_type: "buyer",
      };

      console.log("Google user signed in:", newUser);
      await axios.post(
        "https://backend-rho-three-58.vercel.app/users",
        newUser
      );

      alert("Signed in successfully with Google");
      navigate("/Success");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in with Google");
    }
  };

  const clearFields = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPhonenumber("");
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
          Create an Account
        </Typography>

        <TextField
          label="First Name"
          variant="outlined"
          margin="dense"
          fullWidth
          value={firstname}
          onChange={handleFirstNameChange}
          inputProps={{ pattern: "[A-Za-z ]+" }}
          size="small"
          helperText={firstNameError ? "Enter a valid name (a-z, A-Z)" : ""}
        />

        <TextField
          label="Last Name"
          variant="outlined"
          margin="dense"
          fullWidth
          value={lastname}
          onChange={handleLastNameChange}
          inputProps={{ pattern: "[A-Za-z ]+" }}
          size="small"
          helperText={lastNameError ? "Enter a valid name (a-z, A-Z)" : ""}
        />

        <TextField
          label="Phone Number"
          variant="outlined"
          margin="dense"
          fullWidth
          value={phonenumber}
          onChange={handlePhoneNumberChange}
          inputProps={{ pattern: "[0][7][0-9]{8}" }}
          size="small"
          helperText={phoneNumberError ? "Enter a valid phone number" : ""}
        />

        <TextField
          label="Email Address"
          variant="outlined"
          margin="dense"
          fullWidth
          type="email"
          value={email}
          onChange={handleEmailChange}
          size="small"
          helperText={emailError ? "Enter a valid email address" : ""}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="dense"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          size="small"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ mt: 2, width: "50%", fontSize: "16px" }}
        >
          Create Account
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          onClick={handleGoogleSignUp}
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

export default SignUp;
