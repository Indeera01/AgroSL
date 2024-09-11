const express = require("express");
const pool = require("./db.js");

const router = express.Router();

router.get("/delivery", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM delivery");

    if (result.rows.length === 0) {
      return res.status(404).send("No items found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

router.post("/delivery", async (req, res) => {
  const { delivery_id, order_id, delivery_rider_id, is_delivered_to_buyer } =
    req.body;

  try {
    // Insert into delivery table
    const result = await pool.query(
      `INSERT INTO delivery (delivery_id, order_id, delivery_rider_id, is_delivered_to_buyer) 
       VALUES ($1, $2, $3, $4)`,
      [delivery_id, order_id, delivery_rider_id, is_delivered_to_buyer]
    );
    res
      .status(201)
      .json({ message: "Delivery record added successfully", result });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add delivery record" });
  }
});

module.exports = router;
