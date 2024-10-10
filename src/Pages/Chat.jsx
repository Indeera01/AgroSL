import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Client as TwilioConversationsClient } from "@twilio/conversations";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const Chat = ({ userId, chatPartnerId, partnerName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    console.log("trigggeerrr");
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://backend-rho-three-58.vercel.app/users/${userId}`
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const setupChat = async () => {
      if (!user) return; // Ensure user is loaded

      try {
        const { data: tokenData } = await axios.post(
          "https://backend-rho-three-58.vercel.app/token",
          {
            identity: userId,
            friendlyName: user.first_name,
          }
        );

        const client = await TwilioConversationsClient.create(tokenData.token);

        const { data: convData } = await axios.post(
          "https://backend-rho-three-58.vercel.app/conversation",
          {
            user1Id: userId,
            user2Id: chatPartnerId,
          }
        );

        const conv = await client.getConversationBySid(
          convData.conversationSid
        );
        setConversation(conv);

        // Load existing messages
        const existingMessages = await conv.getMessages();
        setMessages(existingMessages.items);
        setLoadingMessages(false);

        // Listen for new messages
        const messageHandler = (message) => {
          // Check if the message is already in state
          setMessages((prevMessages) => {
            if (!prevMessages.find((msg) => msg.sid === message.sid)) {
              return [...prevMessages, message];
            }
            return prevMessages; // Prevent duplication
          });
        };

        conv.on("messageAdded", messageHandler);

        // Cleanup function to remove listener
        return () => {
          conv.off("messageAdded", messageHandler);
        };
      } catch (error) {
        console.error("Error setting up chat:", error);
      }
    };

    setupChat();
  }, [user, userId, chatPartnerId]);

  const handleSendMessage = async () => {
    if (conversation && newMessage.trim()) {
      await conversation.sendMessage(newMessage);
      setNewMessage("");
      scrollToBottom();
    }
  };

  return (
    // <Box
    //   sx={{
    //     padding: 1,
    //     backgroundColor: "#f9f9f9",
    //     borderRadius: 2,
    //     width: "100%",
    //   }}
    // >
    //   <Typography variant="h6" gutterBottom>
    //     Chat with {partnerName}
    //   </Typography>

    //   {loadingMessages ? (
    //     <CircularProgress />
    //   ) : (
    //     <Box
    //       sx={{
    //         maxHeight: "350px",
    //         overflowY: "auto",
    //         scrollbarWidth: "none",
    //         marginBottom: 2,
    //         display: "flex", // Add this line
    //         flexDirection: "column", // Add this line
    //         gap: "5px", // Add spacing between messages
    //       }}
    //     >
    //       {messages.map((msg) => (
    //         <Paper
    //           key={msg.index}
    //           sx={{
    //             padding: 1,
    //             borderRadius: 2,
    //             backgroundColor: msg.author === userId ? "#e1f5fe" : "#fff",
    //             alignSelf: msg.author === userId ? "flex-end" : "flex-start",
    //             width: "fit-content",
    //           }}
    //         >
    //           <strong>{msg.author === userId ? "You" : partnerName}:</strong>{" "}
    //           <Typography variant="body2">{msg.body}</Typography>
    //         </Paper>
    //       ))}
    //       <div ref={messagesEndRef} /> {/* Scroll target */}
    //     </Box>
    //   )}

    //   <Box display="flex" alignItems="center" marginTop={2}>
    //     <TextField
    //       variant="outlined"
    //       placeholder="Type your message..."
    //       fullWidth
    //       value={newMessage}
    //       onChange={(e) => setNewMessage(e.target.value)}
    //       sx={{ marginRight: 1 }}
    //     />
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       onClick={handleSendMessage}
    //       disabled={!newMessage.trim()}
    //     >
    //       <SendIcon />
    //     </Button>
    //   </Box>
    // </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Make it take the full height of the outer box
        maxHeight: "500px", // Adjust this to the required max height
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        width: "100%",
        padding: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Chat with {partnerName}
      </Typography>

      {/* Chat messages container */}
      <Box
        sx={{
          flexGrow: 1, // Takes up remaining space
          overflowY: "auto", // Allow scrolling
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          marginBottom: 2,
        }}
      >
        {loadingMessages ? (
          <CircularProgress />
        ) : (
          messages.map((msg) => (
            <Paper
              key={msg.index}
              sx={{
                padding: 1,
                borderRadius: 2,
                backgroundColor: msg.author === userId ? "#e1f5fe" : "#fff",
                alignSelf: msg.author === userId ? "flex-end" : "flex-start",
                width: "fit-content",
              }}
            >
              <strong>{msg.author === userId ? "You" : partnerName}:</strong>{" "}
              <Typography variant="body2">{msg.body}</Typography>
            </Paper>
          ))
        )}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </Box>

      {/* Message input */}
      <Box display="flex" alignItems="center" marginTop={2}>
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ marginRight: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
