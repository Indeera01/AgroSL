const express = require("express");
const pool = require("./db.js");
const router = express.Router();
require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");

router.post("/send-confirmation", async (req, res) => {
  const { user_email, cartItems } = req.body;

  try {
    // Set up transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "agrosl.marketplace@gmail.com",
        pass: "ygzy moso kwuh japx",
      },
    });

    // Create the email options
    const mailOptions = {
      from: "agrosl.marketplace@gmail.com",
      to: user_email,
      subject: "Order Confirmation",
      html: `
        <h3>Thank you for your purchase!</h3>
        <p>Your order has been confirmed. Here are the details:</p>
        <ul>
          ${cartItems.map((item) => `<li>${item.name} - ${item.quantity}</li>`).join("")}
        </ul>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error during email:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});

module.exports = router;
