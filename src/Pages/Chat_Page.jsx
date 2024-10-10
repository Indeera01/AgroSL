// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Client as TwilioChatClient } from "twilio-chat";
// import { useNavigate, useParams } from "react-router-dom";
// import Modal from "@mui/material/Modal";
// import Chat from "../Pages/Chat";
// import {
//   Box,
//   Typography,
//   Paper,
//   Avatar,
//   CircularProgress,
// } from "@mui/material"; // Import CircularProgress
// import Navigation_Bar from "../Components/Navigation_Bar";
// import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { md: "35%", xs: "90%" },
//   bgcolor: "background.paper",
//   borderRadius: 3,
//   boxShadow: 24,
//   p: 4,
// };

// const ChatPage = () => {
//   const [chatClient, setChatClient] = useState(null);
//   const [channels, setChannels] = useState([]);
//   const [messages, setMessages] = useState({});
//   const navigate = useNavigate();

//   const [open, setOpen] = React.useState(false);
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState({
//     id: " ",
//     friendlyName: "Other",
//     lastMessage: "",
//     author: "",
//   });
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { userId } = useParams();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`https://backend-rho-three-58.vercel.app/users/${userId}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };

//     fetchUser();
//   }, [userId]);

//   const handleOpen = (chat) => {
//     setSelectedChat(chat);
//     setOpen(true);
//   };
//   const handleClose = () => setOpen(false);

//   useEffect(() => {
//     const fetchChatTokenAndInitialize = async () => {
//       if (!user) return; // Ensure user is loaded

//       try {
//         setLoading(true); // Start loading
//         const { data } = await axios.post("https://backend-rho-three-58.vercel.app/token", {
//           identity: userId,
//           friendlyName: user.first_name,
//         });

//         const client = await TwilioChatClient.create(data.token);
//         setChatClient(client);

//         const userChannels = await client.getSubscribedChannels();
//         setChannels(userChannels.items);

//         const uniqueUserDetails = new Map();

//         for (const channel of userChannels.items) {
//           const members = await channel.getMembers();
//           const messages = await channel.getMessages();

//           const lastMessage =
//             messages.items.length > 0
//               ? messages.items[messages.items.length - 1]
//               : null;

//           for (const member of members) {
//             if (member.identity !== userId) {
//               const userDetails = await member.getUser();
//               const lastMessageBody = lastMessage
//                 ? lastMessage.body
//                 : "No messages yet";
//               const lastMessageAuthor = lastMessage ? lastMessage.author : null;

//               uniqueUserDetails.set(member.identity, {
//                 friendlyName: userDetails.friendlyName,
//                 lastMessage: lastMessageBody,
//                 lastMessageAuthor: lastMessageAuthor,
//               });
//             }
//           }
//         }

//         const chatsArray = Array.from(
//           uniqueUserDetails,
//           ([id, { friendlyName, lastMessage, lastMessageAuthor }]) => ({
//             id,
//             friendlyName,
//             lastMessage,
//             lastMessageAuthor,
//           })
//         );

//         setChats(chatsArray);
//       } catch (error) {
//         console.error("Error setting up chat client:", error);
//       } finally {
//         setLoading(false); // End loading, even on error
//       }
//     };

//     fetchChatTokenAndInitialize();
//   }, [user, userId]);

//   const stringToColor = (string) => {
//     let hash = 0;
//     for (let i = 0; i < string.length; i += 1) {
//       hash = string.charCodeAt(i) + ((hash << 5) - hash);
//     }

//     let color = "#";
//     for (let i = 0; i < 3; i += 1) {
//       const value = (hash >> (i * 8)) & 0xff;
//       color += `00${value.toString(16)}`.slice(-2);
//     }

//     return color;
//   };

//   const stringAvatar = (name) => {
//     const initials = name
//       .split(" ")
//       .map((word) => word[0])
//       .join("");
//     return {
//       sx: {
//         bgcolor: stringToColor(name),
//         width: 45,
//         height: 45,
//       },
//       children: initials,
//     };
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#e6ffe6",
//         height: "100%",
//         paddingBottom: "1px",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         filter: open ? "blur(4px)" : "none",
//         transition: "filter 0.3s ease",
//       }}
//     >
//       {user?.user_type === "seller" ? (
//         <Navigation_Bar_Seller />
//       ) : (
//         <Navigation_Bar />
//       )}
//       <Box
//         sx={{
//           width: "50%",
//           backgroundColor: "white",
//           marginTop: "20px",
//           padding: "10px",
//           borderRadius: "10px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           minHeight: "400px",
//         }}
//       >
//         <Typography variant="h5" color="primary" gutterBottom mb={5}>
//           Your Chats
//         </Typography>
//         {loading ? ( // Conditional rendering for loading state
//           <CircularProgress />
//         ) : (
//           <Box
//             sx={{
//               width: "100%",
//               marginTop: "10px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             {chats.map((chat, index) => (
//               <Paper
//                 key={index}
//                 sx={{
//                   minWidth: "70%",
//                   padding: "10px",
//                   margin: "5px 0",
//                   cursor: "pointer",
//                   transition: "background-color 0.3s",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-start",
//                 }}
//                 elevation={6}
//                 onClick={() => handleOpen(chat)}
//               >
//                 <Box display="flex" alignItems="center">
//                   <Avatar {...stringAvatar(chat.friendlyName)} />
//                   <Typography variant="body1" sx={{ marginLeft: "10px" }}>
//                     {chat.friendlyName}
//                   </Typography>
//                 </Box>
//                 <Typography
//                   variant="body2"
//                   sx={{ color: "gray", marginLeft: "55px" }}
//                 >
//                   {chat.lastMessage
//                     ? `${chat.lastMessageAuthor === userId ? "You" : chat.friendlyName}: ${chat.lastMessage}`
//                     : "No messages yet"}
//                 </Typography>
//               </Paper>
//             ))}
//           </Box>
//         )}
//       </Box>

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Chat
//             userId={userId}
//             chatPartnerId={selectedChat.id}
//             partnerName={selectedChat.friendlyName}
//           />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default ChatPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Client as TwilioChatClient } from "twilio-chat";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../Pages/Chat";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Navigation_Bar from "../Components/Navigation_Bar";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";

const ChatPage = () => {
  const [chatClient, setChatClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // Keep selected chat as null initially
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

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
    const fetchChatTokenAndInitialize = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data } = await axios.post(
          "https://backend-rho-three-58.vercel.app/token",
          {
            identity: userId,
            friendlyName: user.first_name,
          }
        );

        const client = await TwilioChatClient.create(data.token);
        setChatClient(client);

        const userChannels = await client.getSubscribedChannels();
        setChannels(userChannels.items);

        const uniqueUserDetails = new Map();

        for (const channel of userChannels.items) {
          const members = await channel.getMembers();
          const messages = await channel.getMessages();

          const lastMessage =
            messages.items.length > 0
              ? messages.items[messages.items.length - 1]
              : null;

          for (const member of members) {
            if (member.identity !== userId) {
              const userDetails = await member.getUser();
              const lastMessageBody = lastMessage
                ? lastMessage.body
                : "No messages yet";
              const lastMessageAuthor = lastMessage ? lastMessage.author : null;

              uniqueUserDetails.set(member.identity, {
                friendlyName: userDetails.friendlyName,
                lastMessage: lastMessageBody,
                lastMessageAuthor: lastMessageAuthor,
              });
            }
          }
        }

        const chatsArray = Array.from(
          uniqueUserDetails,
          ([id, { friendlyName, lastMessage, lastMessageAuthor }]) => ({
            id,
            friendlyName,
            lastMessage,
            lastMessageAuthor,
          })
        );

        setChats(chatsArray);
      } catch (error) {
        console.error("Error setting up chat client:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatTokenAndInitialize();
  }, [user, userId]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat); // Select the chat and show it on the right
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name) => {
    if (!name)
      return {
        sx: { bgcolor: "#cccccc", width: 45, height: 45 },
        children: "?",
      }; // Default avatar when name is null or undefined

    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");

    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 45,
        height: 45,
      },
      children: initials,
    };
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {user?.user_type === "seller" ? (
        <Navigation_Bar_Seller />
      ) : (
        <Navigation_Bar />
      )}

      <Box
        sx={{
          display: "flex",
          width: "90%",
          height: "80vh", // Ensures both columns take up available height
          backgroundColor: "white",
          marginTop: "20px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Left Side (Chat List) */}
        <Box
          sx={{
            width: "40%", // 40% for chat list
            backgroundColor: "#f0f0f0",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "scroll",
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Your Chats
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            chats.map((chat, index) => (
              <Paper
                key={index}
                sx={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  backgroundColor:
                    selectedChat?.id === chat.id ? "#e0f7fa" : "white", // Highlight selected chat
                }}
                elevation={6}
                onClick={() => handleChatSelect(chat)}
              >
                <Box display="flex" alignItems="center">
                  <Avatar {...stringAvatar(chat.friendlyName)} />
                  <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                    {chat.friendlyName}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "gray", marginLeft: "55px" }}
                >
                  {chat.lastMessage
                    ? `${chat.lastMessageAuthor === userId ? "You" : chat.friendlyName}: ${chat.lastMessage}`
                    : "No messages yet"}
                </Typography>
              </Paper>
            ))
          )}
        </Box>

        {/* Right Side (Selected Chat) */}
        <Box
          sx={{
            width: "60%", // 60% for selected chat
            padding: "20px",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedChat ? (
            <Chat
              userId={userId}
              chatPartnerId={selectedChat.id}
              partnerName={selectedChat.friendlyName}
            />
          ) : (
            <Typography variant="h6" color="textSecondary">
              Select a chat to start messaging
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
