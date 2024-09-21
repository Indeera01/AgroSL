const express = require("express");
const pool = require("./db.js");

const router = express.Router();

router.get("/sellers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seller");
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

router.get("/getseller/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM seller WHERE user_id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("No seller found");
    } else {
      return res.status(200).json(result.rows[0]);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

router.post("/sellers", async (req, res) => {
  const { user_id, NIC, store_name, stripe_account_id } = req.body;

  try {
    // Validate input
    if (!user_id || !NIC || !store_name || !stripe_account_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert new seller into the database
    const result = await pool.query(
      `INSERT INTO "seller" (
            "user_id", "NIC", "store_name", "stripe_account_id"
          ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, NIC, store_name, stripe_account_id]
    );
    console.log("details stored successfully");
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting seller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
