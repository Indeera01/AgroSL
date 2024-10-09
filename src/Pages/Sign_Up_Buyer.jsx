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

  const handleFirstNameChange = (e) => {
    setFirstname(e.target.value);
    if (e.target.validity.valid) {
      setFirstNameError(false);
    } else {
      setFirstNameError(true);
    }
  };

  const handleLastNameChange = (e) => {
    setLastname(e.target.value);
    if (e.target.validity.valid) {
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.validity.valid) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handlePhoneNumberChange = (e) => {
    setPhonenumber(e.target.value);
    if (e.target.validity.valid) {
      setPhonenumberError(false);
    } else {
      setPhonenumberError(true);
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
        first_name: firstname,
        last_name: lastname,
        mobile_number: phonenumber,
        email: email,
        address_id: "",
        user_type: "buyer",
      };
      alert("Account created successfully");
      clearFields();
      navigate("/Success");
      axios
        .post("http://localhost:5001/users", newUser)
        .then((response) => {
          alert("Account created successfully");
          clearFields();
          navigate("/Success");
        })
        .catch((error) => {
          console.error("Error creating account:", error);
        });

      axios
        .post("http://localhost:5001/buyer", newUser)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("Error creating buyer:", error);
        });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating account");
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
          onChange={(e) => handleFirstNameChange(e)}
          inputProps={{
            pattern: "[A-Za-z ]+",
          }}
          size="small"
          helperText={
            firstNameError
              ? "Please enter a valid name . It should be [a-z,A-Z]"
              : ""
          }
        />
        <TextField
          label="Last Name"
          variant="outlined"
          margin="dense"
          fullWidth
          value={lastname}
          onChange={(e) => handleLastNameChange(e)}
          required
          inputProps={{
            pattern: "[A-Za-z ]+",
          }}
          size="small"
          helperText={
            lastNameError
              ? "Please enter a valid name. It should be [a-z,A-Z]"
              : ""
          }
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          margin="dense"
          fullWidth
          value={phonenumber}
          onChange={(e) => handlePhoneNumberChange(e)}
          required
          helperText={
            phoneNumberError
              ? "Enter a valid phone number  ie: 07xxxxxxxx  "
              : ""
          }
          inputProps={{
            pattern: "[0][7][0-9]{8}",
          }}
          size="small"
        />
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
        <Link color="secondary" href="/Sign_Up_Seller">
          Create as seller
        </Link>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          sx={{ mt: 2, width: "50%", fontSize: "16px" }}
        >
          Create Account
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
