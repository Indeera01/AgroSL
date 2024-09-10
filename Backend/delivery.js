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
  const { orderID, riderID } = req.body;

  const count = await pool.query("SELECT COUNT(*) FROM delivery");
  const rid = parseInt(count.rows[0].count) + 1;
  const delivery_id = `r${String(rid).padStart(4, "0")}`;

  try {
    const result = await pool.query(
      "INSERT INTO delivery (delivery_id, order_id, delivery_rider_id, is_delivered_to_buyer) VALUES ($1, $2, $3, $4) RETURNING *",
      [delivery_id, orderID, riderID, false]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Couldn't post to delivery table");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
