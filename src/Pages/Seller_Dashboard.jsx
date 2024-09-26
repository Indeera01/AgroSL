/*import React from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import View_Complaints from "../Components/View_Complaints";
import View_Orders from "../Components/View_Orders";
import Post_Item from "../Components/Post_Item";
import View_Reports from "../Components/View_Reports";
import View_Inventory from "../Components/View_Inventory";
import View_Processing_Orders from "../Components/View_Processing_Orders";
import { Box } from "@mui/material";

export default function Seller_Dashboard() {
  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <div style={styles.dashboard}>
        <div style={styles.row}>
          <View_Complaints />
          <View_Orders />
          <View_Inventory />
        </div>
        <div style={styles.row}>
          <Post_Item />
          <View_Reports />
          <View_Processing_Orders />
        </div>
      </div>
    </Box>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignComplaints: "center",
    padding: "20px",
    gap: "20px",
    width: "100%",
    height: "200%",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
};
*/
/*
import React from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function Seller_Dashboard() {
  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <div style={styles.dashboard}>
        <div style={styles.row}>
          <Post_Item />
          <View_Orders />
          <View_Inventory />
        </div>
        <div style={styles.row}>
          <View_Reports />
          <View_Processing_Orders />
          <View_Complaints />
        </div>
      </div>
    </Box>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
    width: "100%",
    height: "200%",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
};

// View Orders Component
function View_Orders() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleViewOrders = () => {
    navigate(`/sellerdashboard/${id}/orders`);
  };

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
        <button style={cardStyles.button} onClick={handleViewOrders}>
          View Orders
        </button>
      </div>
    </div>
  );
}

// View Processing Orders Component
function View_Processing_Orders() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleViewProcessingOrders = () => {
    navigate(`/sellerdashboard/${id}/processingorders`);
  };

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
        <button style={cardStyles.button} onClick={handleViewProcessingOrders}>
          View Processing Orders
        </button>
      </div>
    </div>
  );
}

// View Reports Component
function View_Reports() {
  const navigate = useNavigate();

  const handleViewReports = () => {
    navigate("/reports_seller");
  };

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
        <button style={cardStyles.button} onClick={handleViewReports}>
          View Reports
        </button>
      </div>
    </div>
  );
}

// View Inventory Component
function View_Inventory() {
  const navigate = useNavigate();

  const handleViewInventory = () => {
    navigate("/inventory");
  };

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
        <button style={cardStyles.button} onClick={handleViewInventory}>
          View Inventory
        </button>
      </div>
    </div>
  );
}

function Post_Item() {
  const navigate = useNavigate();

  const handlePostItem = () => {
    const sellerId = window.location.pathname.split("/")[2];
    navigate(`/add_item/${sellerId}`);
  };

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
        <button style={cardStyles.button} onClick={handlePostItem}>
          Post Items
        </button>
      </div>
    </div>
  );
}

function View_Complaints() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleViewComplaints = () => {
    navigate(`/sellerdashboard/${id}/complaints`); // Use template string to navigate
  };

  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.content}>
        <button style={cardStyles.button} onClick={handleViewComplaints}>
          View Compalints
        </button>
      </div>
    </div>
  );
}

// Styles for all components
const cardStyles = {
  container: {
    backgroundColor: "#F4F7F6",
    borderRadius: "20px",
    padding: "30px",
    textAlign: "center",
    width: "300px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4B8412",
    color: "#fff",
    borderRadius: "25px",
    width: "220px",
    height: "55px",
    padding: "15px 25px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
};

*/
import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import axios from "axios";
// Adjust the import based on your Firebase setup

export default function Seller_Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch logged-in user details from Firebase Authentication
    const currentUser = auth.currentUser;
    console.log(currentUser);
    if (currentUser) {
      axios
        .get(`http://localhost:5001/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          console.log("User data:", res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    /*
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <Box sx={{ flex: 1, padding: "20px", display: "flex" }}>
        <Box
          sx={{
            width: "250px",
            backgroundColor: "#F4F7F6",
            borderRadius: "10px",
            padding: "20px",
            marginRight: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: "100vh",
          }}
        >
          <List>
            <ListItem
              button
              onClick={() => handleNavigation(`/add_item/${id}`)}
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="Post Items" primaryTypographyProps={{}} />
            </ListItem>

            <ListItem
              button
              onClick={() => handleNavigation(`/sellerdashboard/${id}/orders`)}
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="View Orders" />
            </ListItem>
            <ListItem
              button
              onClick={() => handleNavigation(`/inventory`)}
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="View Inventory" />
            </ListItem>
            <ListItem
              button
              onClick={() => handleNavigation("/reports_seller")}
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="View Reports" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/sellerdashboard/${id}/processingorders`)
              }
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="View Processing Orders" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/sellerdashboard/${id}/complaints`)
              }
              sx={{
                border: "1px solid #ccc", // Light gray border
                borderRadius: "8px", // Rounded corners
                padding: "10px", // Inner padding
                marginBottom: "10px", // Space between items
                transition: "background-color 0.3s, border-color 0.3s", // Smooth transition
                "&:hover": {
                  backgroundColor: "#e0f7fa", // Change background color on hover
                  borderColor: "#007BFF", // Change border color on hover
                },
              }}
            >
              <ListItemText primary="View Complaints" />
            </ListItem>
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Box sx={{ marginBottom: "20px" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "600", color: "#333" }}
                >
                  Welcome, {user.first_name} {user.last_name}
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: "#F9F9F9",
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Email:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.email}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Mobile Number:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.mobile_number}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  */
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />
      <Box sx={{ flex: 1, padding: "20px", display: "flex" }}>
        <Box
          sx={{
            width: "250px",
            backgroundColor: "#F4F7F6",
            borderRadius: "10px",
            padding: "20px",
            marginRight: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: "100vh",
          }}
        >
          <List>
            {/* Post Items Button */}
            <ListItem
              button
              onClick={() => handleNavigation(`/add_item/${id}`)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff", // Slight blue hover
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)", // Subtle shadow on hover
                },
              }}
            >
              <ListItemText primary="Post Items" />
            </ListItem>

            {/* View Orders Button */}
            <ListItem
              button
              onClick={() => handleNavigation(`/sellerdashboard/${id}/orders`)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Orders" />
            </ListItem>

            {/* View Inventory Button */}
            <ListItem
              button
              onClick={() => handleNavigation(`/inventory`)}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Inventory" />
            </ListItem>

            {/* View Reports Button */}
            <ListItem
              button
              onClick={() => handleNavigation("/reports_seller")}
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Reports" />
            </ListItem>

            {/* View Processing Orders Button */}
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/sellerdashboard/${id}/processingorders`)
              }
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Processing Orders" />
            </ListItem>

            {/* View Complaints Button */}
            <ListItem
              button
              onClick={() =>
                handleNavigation(`/sellerdashboard/${id}/complaints`)
              }
              sx={{
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f5f5f5",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "#d1e7ff",
                  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
                },
              }}
            >
              <ListItemText primary="View Complaints" />
            </ListItem>
          </List>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Box sx={{ marginBottom: "20px" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "600", color: "#333" }}
                >
                  Welcome, {user.first_name} {user.last_name}
                </Typography>

                <Box
                  sx={{
                    padding: "15px",
                    borderRadius: "8px",
                    backgroundColor: "#F9F9F9",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Email:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.email}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: "500", color: "#555" }}
                  >
                    Mobile Number:{" "}
                    <span style={{ fontWeight: "400", color: "#333" }}>
                      {user.mobile_number}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
