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
import { auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";

const SignUp = () => {
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [NIC, setNIC] = useState("");
  const [storeName, setStoreName] = useState("");
  const [reenteredpassword, setReenteredpassword] = useState("");
  const [image, setImage] = useState(null);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhonenumberError] = useState(false);
  const [NICError, setNICError] = useState(false);
  const navigate = useNavigate();

  // Handle Image Change
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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
      let imageUrl = ""; // Store the image URL if uploaded

      // Upload image to Firebase Storage
      if (image) {
        const imageRef = ref(storage, `users/${userId}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef); // Get the download URL
        console.log("Image uploaded:", imageUrl);
      }

      const newUser = {
        user_id: userId,
        first_name: firstname,
        last_name: lastname,
        mobile_number: phonenumber,
        email: email,
        address_id: "",
        user_type: "seller",
        image_url: imageUrl, // Store image URL in the user data
      };

      const newSeller = {
        user_id: userId,
        NIC: NIC,
        store_name: storeName,
      };

      // Create a Stripe connected account for the seller
      const stripeAccountResponse = await axios.post(
        "https://backend-rho-three-58.vercel.app/create-connected-account",
        {
          email: email, // Passing the user's email here
        }
      );
      const stripeAccountId = stripeAccountResponse.data.stripeAccountId; // Get the connected account ID
      console.log(stripeAccountId);

      // Add Stripe account ID to the seller data
      newSeller.stripe_account_id = stripeAccountId; // Store Stripe account ID
      console.log(newSeller);

      alert("Account created successfully");

      axios
        .post("https://backend-rho-three-58.vercel.app/users", newUser)
        .then((response) => {
          console.log("User added:", response);
        })
        .catch((error) => {
          console.error("Error creating account:", error);
        });

      axios
        .post("https://backend-rho-three-58.vercel.app/sellers", newSeller)
        .then((response) => {
          console.log("Seller added:", response);
        })
        .catch((error) => {
          console.error("Error creating seller:", error);
        });

      window.location.href = stripeAccountResponse.data.accountLink;
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating account");
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
              ? "Please enter a valid name. It should be [a-z,A-Z]"
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
          size="small"
          helperText={
            phoneNumberError ? "Enter a valid phone number  ie: 07xxxxxxxx" : ""
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
          label="Store Name"
          variant="outlined"
          margin="dense"
          fullWidth
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
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
          margin="dense"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          size="small"
        />
        <TextField
          label="Re-enter Password"
          variant="outlined"
          margin="dense"
          fullWidth
          type="password"
          value={reenteredpassword}
          onChange={(e) => setReenteredpassword(e.target.value)}
          required
          size="small"
        />

        {/* Image Upload Input */}
        <TextField
          type="file"
          label="Upload Profile Image"
          InputLabelProps={{
            shrink: true,
          }}
          margin="dense"
          fullWidth
          onChange={handleImageChange} // Image file handler
        />

        <Button
          sx={{ mt: 3, backgroundColor: "#28a745", color: "white" }}
          variant="contained"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>

        <Typography mt={2}>
          Already have an account?{" "}
          <Link href="/Sign_In" color={"#000"}>
            Sign In
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignUp;
