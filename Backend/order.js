const express = require("express");
const pool = require("./db.js");

const router = express.Router();

router.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM order");

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

router.post("/orders", async (req, res) => {
  const {
    order_id,
    buyer_id,
    item_id,
    order_date,
    is_confirmed,
    seller_id,
    order_quantity,
  } = req.body;
  try {
    const result = await pool.query(
      'insert into "order" (order_id, buyer_id, item_id, order_date, is_confirmed, seller_id, order_quantity) values ($1, $2, $3, $4, $5, $6,$7) returning *',
      [
        order_id,
        buyer_id,
        item_id,
        order_date,
        is_confirmed,
        seller_id,
        order_quantity,
      ]
    );

    console.log("Order stored successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error storing order:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/api/orders/:orderId/send", async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE "order" SET sent_to_delivery = $1 WHERE order_id = $2',
      [true, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order sent to delivery" });
  } catch (error) {
    console.error("Error sending order to delivery:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/api/processingorders/:orderId/send", async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'UPDATE "order" SET sent_to_delivery = $1 WHERE order_id = $2',
      [false, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order sent to delivery" });
  } catch (error) {
    console.error("Error sending order to delivery:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/orders", async (req, res) => {
  const { seller_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM "order" WHERE seller_id = $1`,
      [seller_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/processingorders", async (req, res) => {
  const { seller_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM "order" WHERE seller_id = $1`,
      [seller_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/seller_orders/:sellerID", async (req, res) => {
  const sellerID = req.params.sellerID;
  const { startDate, endDate } = req.query; // Extracting startDate and endDate from query params

  try {
    let query = `
        SELECT o.*, i.item_name, i.unit_price 
        FROM "order" o
        JOIN item i ON o.item_id = i.item_id
        WHERE o.seller_id = $1
      `;

    const queryParams = [sellerID];

    if (startDate) {
      query += ` AND o.order_date >= $2`; // Add start date filter
      queryParams.push(startDate);
    }

    if (endDate) {
      query += ` AND o.order_date <= $3`; // Add end date filter
      queryParams.push(endDate);
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length > 0) {
      console.log(
        `Retrieved ${result.rows.length} orders for seller ID: ${sellerID}`
      );
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No orders found for this user" });
    }
  } catch (e) {
    console.error("Error retrieving orders:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/orders_for_riders", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "order" WHERE sent_to_delivery = true'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/orders_take/:orderID", async (req, res) => {
  const orderId = req.params.orderID;

  try {
    const result = await pool.query(
      'UPDATE "order" SET is_confirmed = $1 WHERE order_id = $2',
      [true, orderId]
    );

    res.status(200).json({ message: "Order sent to delivery" });
  } catch (error) {
    console.error("Error taking the order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
