const express = require("express");
const pool = require("./db.js");
const router = express.Router();

const twilio = require("twilio");
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

// Environment variables setup
const accountSid = "AC91e9232068fb91a526ead78bca30c730";
const apiKey = "SK82f2964b50a266755f8cce85dad1eea7";
const apiSecret = "0eF0lkuXSiSJH4CHV0tO5danRhoSPtqp";
const chatServiceSid = "IS247e8c1e0a684eff86dd30bdc58d11f2";

// Generate token for chat access
router.post("/token", (req, res) => {
  const identity = req.body.identity; // Get the user identity from the request
  const token = new twilio.jwt.AccessToken(accountSid, apiKey, apiSecret, {
    identity: identity,
  });

  const chatGrant = new twilio.jwt.AccessToken.ChatGrant({
    serviceSid: chatServiceSid,
  });

  token.addGrant(chatGrant);
  res.send({ token: token.toJwt() });
});

// Create or fetch conversation between two users
router.post("/conversation", async (req, res) => {
  const { user1Id, user2Id } = req.body;
  const client = twilio(accountSid, "61a61c8ff61c612cda666495658de29f");

  try {
    // Check if conversation between users already exists (you may want to store conversation SIDs in your database)
    let conversation = await client.conversations.v1.conversations
      .list({
        limit: 20,
      })
      .then((conversations) =>
        conversations.find(
          (conv) =>
            conv.uniqueName === `${user1Id}-${user2Id}` ||
            conv.uniqueName === `${user2Id}-${user1Id}`
        )
      );

    if (!conversation) {
      // Create new conversation
      conversation = await client.conversations.v1.conversations.create({
        uniqueName: `${user1Id}-${user2Id}`,
        friendlyName: `Chat between ${user1Id} and ${user2Id}`,
      });

      // Add users to the conversation
      await client.conversations.v1
        .conversations(conversation.sid)
        .participants.create({ identity: user1Id });
      await client.conversations.v1
        .conversations(conversation.sid)
        .participants.create({ identity: user2Id });
    }

    res.json({ conversationSid: conversation.sid });
  } catch (error) {
    res.status(500).send("Error creating or fetching conversation");
  }
});

module.exports = router;
