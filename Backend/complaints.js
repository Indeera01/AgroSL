const express = require("express");
const pool = require("./db.js");

const router = express.Router();

router.get("/complaints", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM complaint");
    if (result.rows.length === 0) {
      return res.status(404).send("No complaints found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

router.get("/complaints/:buyer_id", async (req, res) => {
  const buyer_id = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM complaint WHERE buyer_id = $1",
      [buyer_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("No complaints found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

router.get("/complaints/:/seller_id", async (req, res) => {
  const seller_id = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM complaint WHERE seller_id = $1",
      [seller_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("No complaints found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

router.get("/get_seller_complaints/:sellerID", async (req, res) => {
  const sellerID = req.params.sellerID;
  console.log(sellerID);
  try {
    const result = await pool.query(
      "SELECT * FROM complaint WHERE seller_id = $1",
      [sellerID]
    );
    console.log("result", { result });
    if (result.rows.length === 0) {
      return res.status(404).send("No complaints found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

router.get("/api/complaints", async (req, res) => {
  const { seller_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM complaint_users WHERE seller_id = $1`,
      [seller_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/all_complaints_for_admins", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM complaint_users`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/api/complaints/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(
      `UPDATE complaint
         SET complaint_status_seller = $1
         WHERE complaint_id = $2`,
      [status, id]
    );
    res.status(200).json({ message: "Complaint status updated successfully" });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
