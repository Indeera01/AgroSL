const express = require("express");
const pool = require("./db.js");

const router = express.Router();

//get users

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "users"');

    if (result.rows.length === 0) {
      return res.status(404).send("No users found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error("Error fetching users:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users_by_type", async (req, res) => {
  try {
    const { types } = req.query; // Extract the 'types' query parameter

    // Convert 'types' from a comma-separated string to an array
    const userTypes = types ? types.split(",") : [];

    let query = 'SELECT * FROM "users"';

    // Modify the query if specific user types are requested
    if (userTypes.length > 0) {
      // Use the IN clause with placeholders to avoid SQL injection
      const placeholders = userTypes.map((_, i) => `$${i + 1}`).join(", ");
      query += ` WHERE user_type IN (${placeholders})`;
    }

    // Execute the query with the userTypes array as parameters
    const result = await pool.query(query, userTypes);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users/:user_id", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "users" WHERE user_id = $1',
      [req.params.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(result.rows[0]);
    }
  } catch (e) {
    console.error("Error fetching user:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/users", async (req, res) => {
  const { user_id, first_name, last_name, mobile_number, email, user_type } =
    req.body;

  try {
    // Insert new user into the database
    const result = await pool.query(
      `INSERT INTO users (
            user_id, first_name, last_name, mobile_number, email, user_type
          ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, first_name, last_name, mobile_number, email, user_type]
    );
    console.log("Account stored successfully:", result.rows[0]); // Log the successful insertion
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting user:", error.message); // Log the detailed error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/users/:user_id", async (req, res) => {
  const { first_name, last_name, mobile_number, email, address_id, user_type } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE "users" 
               SET 
                  "first_name" = $1,
                  "last_name" = $2,
                  "mobile_number" = $3,
                  "email" = $4,
                  "address_id" = $5,
                  "user_type" = $6
               WHERE 
                  "user_id" = $7
               RETURNING *`,
      [
        first_name,
        last_name,
        mobile_number,
        email,
        address_id,
        user_type,
        req.params.user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(result.rows[0]);
    }
  } catch (e) {
    console.error("Error updating user:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get_user/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    // Query the user table to get the user_type for the given uid

    const result = await pool.query(
      "SELECT user_type FROM users WHERE user_id = $1",
      [req.params.uid]
    );

    if (result.rows.length > 0) {
      // Send back the user_type if the user is found
      return res.json({ user_type: result.rows[0].user_type });
    } else {
      // If the user is not found, send a 404 response
      return res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.error("Error retrieving user_type:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/delivery_rider_dashboard/:id/deliveries", async (req, res) => {
  const { id } = req.params; // Extract delivery rider ID from the URL

  try {
    // Query to fetch deliveries for the given delivery rider ID
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    // Respond with the deliveries
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/api/delivery_rider_dashboard/:id/orders", async (req, res) => {
  const { id } = req.params; // Extract delivery rider ID from the URL

  try {
    // Query to fetch deliveries for the given delivery rider ID
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    // Respond with the deliveries
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;