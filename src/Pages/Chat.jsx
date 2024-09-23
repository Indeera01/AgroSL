import { useEffect, useState } from "react";
import axios from "axios";
import { Client as TwilioConversationsClient } from "@twilio/conversations";

const Chat = ({ userId, chatPartnerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    const setupChat = async () => {
      try {
        // Request token from the backend
        const { data: tokenData } = await axios.post(
          "http://localhost:5001/token",
          {
            identity: userId,
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
  }, [userId, chatPartnerId]);

  const handleSendMessage = async () => {
    if (conversation && newMessage.trim()) {
      await conversation.sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.index}>
            <strong>{msg.author === userId ? "You" : "Other"}:</strong>{" "}
            {msg.body}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
