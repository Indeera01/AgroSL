import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import User_Profile from "../Pages/User_Profile";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../assets/white logo.png";

const pages = [
  "Become a Seller",
  "Become a Delivery Rider",
  // "Contact us",
  // "About",
];
const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showUserProfile, setShowUserProfile] = React.useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const res = await axios.get(
            `https://backend-rho-three-58.vercel.app/users/${currentUser.uid}`
          );
          setUser(res.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch cart items when user data is available
    if (user?.user_id) {
      const fetchCartItems = async (userID) => {
        try {
          const response = await axios.get(
            `https://backend-rho-three-58.vercel.app/cart/${userID}`
          );
          setCart(response.data);
          console.log("Cart items:", response.data);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setCart([]);
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchCartItems(user.user_id); // Call the function with user.uid
    }
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page === "Become a Seller") {
      navigate("/Sign_Up_Seller");
    } else if (page === "Become a Delivery Rider") {
      navigate("/Sign_Up_Delivery_Rider");
    } else if (page === "Contact us") {
      navigate("/Contact_us");
    } else if (page === "About") {
      navigate("/About");
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (setting) => {
    if (setting === "Profile") {
      handleProfilePopUp();
    } else if (setting === "Logout") {
      handleLogout();
    }
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleProfilePopUp = () => {
    setShowUserProfile(true);
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              onClick={() => navigate(user ? `/Home/${user.user_id}` : "/")}
              component="img"
              src={Logo}
              alt="AgroSL Logo"
              sx={{
                display: { xs: "block", md: "block" },
                height: 90,
              }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                gap: { md: 8 },
                marginLeft: { md: "80px" },
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: "0",
                      height: "2px",
                      bottom: "-2px", // Adjust the underline position
                      left: "0",
                      backgroundColor: "white",
                      transition: "width 0.3s ease-in-out",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {user && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "60px",
                }}
                mr={9}
              >
                <Badge badgeContent={cart.length} color="action">
                  <ShoppingCartIcon
                    fontSize="large"
                    onClick={() => navigate("/cart")}
                  />
                </Badge>
              </Box>
            )}
            {!user && (
              <Button
                onClick={() => navigate("/Sign_In")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0",
                    height: "2px",
                    bottom: "-2px", // Adjust the underline position
                    left: "0",
                    backgroundColor: "white",
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Login
              </Button>
            )}
            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={user?.image_url} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleCloseUserMenu(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {showUserProfile && (
        <User_Profile onClose={() => setShowUserProfile(false)} />
      )}
    </>
  );
}

export default ResponsiveAppBar;
