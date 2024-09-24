import { useEffect, useState } from "react";
import axios from "axios";
import { Client as TwilioConversationsClient } from "@twilio/conversations";
import { Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ userId, chatPartnerId, partnerName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Error fetching user");
        // setLoading(false);
      });
  }, []);

  useEffect(() => {
    const setupChat = async () => {
      try {
        // Request token from the backend
        const { data: tokenData } = await axios.post(
          "http://localhost:5001/token",
          {
            identity: userId,
            friendlyName: user.first_name,
          }
        );

        // Initialize Twilio Conversations client
        const client = await TwilioConversationsClient.create(tokenData.token);

        // Request conversation SID
        const { data: convData } = await axios.post(
          "http://localhost:5001/conversation",
          {
            user1Id: userId,
            user2Id: chatPartnerId,
          }
        );

        // Get conversation by SID
        const conv = await client.getConversationBySid(
          convData.conversationSid
        );
        setConversation(conv);

        // Load existing messages
        const existingMessages = await conv.getMessages();
        setMessages(existingMessages.items);

        // Listen for new messages
        conv.on("messageAdded", (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
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
    }
  };

  return (
    <Box>
      <div>
        {messages.map((msg) => (
          <div key={msg.index}>
            <strong>{msg.author === userId ? "You" : partnerName}:</strong>{" "}
            {msg.body}
          </div>
        ))}
      </div>
      <Box marginTop={2}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
