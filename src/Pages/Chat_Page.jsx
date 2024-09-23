import React, { useEffect, useState } from "react";
import axios from "axios";
import { Client as TwilioChatClient } from "twilio-chat";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Chat from "../Pages/Chat";
import { Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ChatPage = () => {
  const [chatClient, setChatClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [chats, setChats] = useState([]); // Store the chat participants
  const [selectedChat, setSelectedChat] = useState(null); // Store the selected user for modal

  const { userId } = useParams();

  //   useEffect(() => {
  //     const fetchChatTokenAndInitialize = async () => {
  //       try {
  //         const { data } = await axios.post("http://localhost:5001/token", {
  //           identity: userId,
  //         });

  //         // Initialize Twilio Chat Client
  //         const client = await TwilioChatClient.create(data.token);
  //         setChatClient(client);

  //         // Fetch user's channels
  //         const userChannels = await client.getSubscribedChannels();
  //         setChannels(userChannels.items);
  //         console.log(userChannels.items);

  //         // Load messages from each channel
  //         userChannels.items.forEach(async (channel) => {
  //           const messages = await channel.getMessages();
  //           setMessages((prev) => ({
  //             ...prev,
  //             [channel.sid]: messages.items,
  //           }));

  //           // Listen for new messages in each channel
  //           channel.on("messageAdded", (message) => {
  //             setMessages((prev) => ({
  //               ...prev,
  //               [channel.sid]: [...(prev[channel.sid] || []), message],
  //             }));
  //           });
  //         });
  //       } catch (error) {
  //         console.error("Error setting up chat client:", error);
  //       }
  //     };

  //     fetchChatTokenAndInitialize();
  //   }, [userId]);

  const handleOpen = (chat) => {
    setSelectedChat(chat);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchChatTokenAndInitialize = async () => {
      try {
        const { data } = await axios.post("http://localhost:5001/token", {
          identity: userId,
        });

        // Initialize Twilio Chat Client
        const client = await TwilioChatClient.create(data.token);
        setChatClient(client);

        // Fetch user's channels
        const userChannels = await client.getSubscribedChannels();
        setChannels(userChannels.items);

        // Set to store unique usernames
        const uniqueUsernames = new Set();

        // Fetch members (participants) from each channel
        for (const channel of userChannels.items) {
          const members = await channel.getMembers();

          // Add participants to Set (excluding current user)
          members.forEach((member) => {
            if (member.identity !== userId) {
              uniqueUsernames.add(member.identity);
            }
          });
        }

        // Convert Set to array and update the state
        const chatsArray = Array.from(uniqueUsernames);
        setChats(chatsArray);
        console.log(chatsArray); // Log the array of chat participants
      } catch (error) {
        console.error("Error setting up chat client:", error);
      }
    };

    fetchChatTokenAndInitialize();
  }, [userId]);

  return (
    // <div>
    //   <h2>Chats</h2>
    //   {channels.map((channel) => (
    //     <div key={channel.sid}>
    //       <h3>{channel.friendlyName || "Unnamed Channel"}</h3>
    //       {messages[channel.sid]?.map((msg) => (
    //         <div key={msg.sid}>
    //           <strong>{msg.author === userId ? "You" : msg.author}:</strong>{" "}
    //           {msg.body}
    //         </div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.map((chat, index) => (
          <li
            key={index}
            onClick={() => handleOpen(chat)}
            style={{ cursor: "pointer" }}
          >
            {chat}
          </li>
        ))}
      </ul>

      {/* Modal to display the Chat component */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Chat userId={userId} chatPartnerId={selectedChat} />
        </Box>
      </Modal>
    </div>
  );
};

export default ChatPage;
