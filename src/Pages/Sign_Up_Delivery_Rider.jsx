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
  const [NIC, setNIC] = useState("");
  const [reenteredpassword, setReenteredpassword] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhonenumberError] = useState(false);
  const [NICError, setNICError] = useState(false);
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

  const handleNICChange = (e) => {
    setNIC(e.target.value);
    if (e.target.validity.valid) {
      setNICError(false);
    } else {
      setNICError(true);
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
        user_type: "delivery_rider",
      };

      const newDeliveryRider = {
        user_id: userId,
        NIC: NIC,
      };
      alert("Account created successfully");
      clearFields();
      navigate("/Success");
      axios
        .post("http://backend-rho-three-58.vercel.app/users", newUser)
        .then((response) => {
          alert("Account created successfully");
          clearFields();
          navigate("/Success");
        })
        .catch((error) => {
          console.error("Error creating account:", error);
        });

      axios
        .post(
          "http://backend-rho-three-58.vercel.app/delivery_riders",
          newDeliveryRider
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("Error creating rider:", error);
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
    setNIC("");
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
          p: 2,
          borderRadius: 6,
          boxShadow: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          gap: 0,
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
          size="small"
          inputProps={{
            pattern: "[A-Za-z ]+",
          }}
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
          size="small"
          inputProps={{
            pattern: "[A-Za-z ]+",
          }}
          helperText={
            lastNameError
              ? "Please enter a valid name . It should be [a-z,A-Z]"
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
          size="small"
          helperText={
            phoneNumberError
              ? "Enter a valid phone number  ie: 07xxxxxxxx  "
              : ""
          }
          inputProps={{
            pattern: "[0][7][0-9]{8}",
          }}
        />
        <TextField
          label="NIC"
          variant="outlined"
          margin="dense"
          fullWidth
          value={NIC}
          onChange={(e) => handleNICChange(e)}
          required
          size="small"
          inputProps={{
            pattern: "^[0-9]{9}[vV]$|^[0-9]{12}$",
          }}
          helperText={
            NICError
              ? "Enter a valid NIC number ie: 123456789V or 200156789123"
              : ""
          }
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
          size="small"
          helperText={
            emailError ? "Enter a valid email address ie: dummy@gmail.com" : ""
          }
          inputProps={{
            pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}",
          }}
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
