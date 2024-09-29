import React, { useEffect, useState } from "react";
import { Badge, Box } from "@mui/material";
import Navigation_Bar from "./Components/Navigation_Bar";
import Items from "./Components/Items";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Layout = ({ Children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleChatMessagePress = () => {
    if (!user) {
      alert("Please log in to chat with seller");
      return;
    }
    navigate(`/chat_page/${user?.uid}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar />
      <Items />
      {Children}
      <Box
        position="fixed"
        bottom="12%"
        right="4%"
        zIndex="1000"
        bgcolor="white"
        padding={2}
        borderRadius="50%"
        boxShadow="0px 8px 10px rgba(0, 0, 0, 0.8)"
        onClick={() => handleChatMessagePress()}
        sx={{
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)",
          },
        }}
      >
        <Badge badgeContent={0} color="error">
          <ChatIcon fontSize="large" color="black" />
        </Badge>
      </Box>
    </Box>
  );
};

export default Layout;
