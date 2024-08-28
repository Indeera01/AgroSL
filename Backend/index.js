const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");
const { Category } = require("@mui/icons-material");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//get users
app.get("/users", async (req, res) => {
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

app.get("/users/:user_id", async (req, res) => {
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

app.post("/users", async (req, res) => {
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

app.put("/users/:user_id", async (req, res) => {
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

app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM item");

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

app.get("/items/:item_id", async (req, res) => {
  const itemID = req.params.item_id;
  try {
    const result = await pool.query("SELECT * FROM item WHERE item_id = $1", [
      itemID,
    ]);
    if (result.rows.length > 0) {
      console.log(
        `Retrieved ${result.rows.length} item for item ID: ${itemID}`
      );
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No item found for this id" });
    }
  } catch (e) {
    console.error("Error retrieving the item:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/items_seller/:sellerID", async (req, res) => {
  const sellerID = req.params.sellerID;
  console.log(sellerID);
  try {
    const result = await pool.query("SELECT * FROM item WHERE seller_id = $1", [
      sellerID,
    ]);
    if (result.rows.length > 0) {
      console.log(
        `Retrieved ${result.rows.length} items for user: ${sellerID}`
      );
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No items found for this user" });
    }
  } catch (e) {
    console.error("Error retrieving the items", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/items", async (req, res) => {
  const {
    item_id,
    item_name,
    unit_price,
    quantity,
    image_url,
    average_rating_value,
    description,
    seller_id,
  } = req.body;
  try {
    const result = await pool.query(
      "insert into item (item_id, item_name, unit_price, quantity, image_url,average_rating_value,description,seller_id) values ($1, $2, $3, $4, $5, $6,$7,$8) returning *",
      [
        item_id,
        item_name,
        unit_price,
        quantity,
        image_url,
        average_rating_value,
        description,
        seller_id,
      ]
    );

    console.log("Item stored successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting user:", error.message); // Log the detailed error message
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/sellers", async (req, res) => {
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

app.get("/getseller/:id", async (req, res) => {
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

app.get("/buyer", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM buyer");

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

app.post("/buyer", async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO buyer(user_id) VALUES($1) RETURNING *",
      [user_id]
    );
    console.log("Buyer stored successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/orders", async (req, res) => {
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

app.get("/delivery", async (req, res) => {
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

app.post("/sellers", async (req, res) => {
  const { user_id, NIC, store_name } = req.body;

  try {
    // Validate input
    if (!user_id || !NIC || !store_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert new seller into the database
    const result = await pool.query(
      `INSERT INTO "seller" (
          "user_id", "NIC", "store_name"
        ) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, NIC, store_name]
    );
    console.log("details stored successfully");
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting seller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cart", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shopping_cart");
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

app.get("/cart/:userID", async (req, res) => {
  const userID = req.params.userID;

  try {
    const result = await pool.query(
      "SELECT * FROM shopping_cart WHERE buyer_id = $1",
      [userID]
    );
    if (result.rows.length > 0) {
      console.log(
        `Retrieved ${result.rows.length} items for user ID: ${userID}`
      );
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No items found for this user" });
    }
  } catch (e) {
    console.error("Error retrieving items:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/cart/:buyer_id/:item_id", async (req, res) => {
  const { buyer_id, item_id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      "UPDATE shopping_cart SET quantity = $1 WHERE buyer_id = $2 AND item_id = $3 RETURNING *",
      [quantity, buyer_id, item_id]
    );

    if (result.rows.length > 0) {
      console.log(
        `Updated item ${item_id} for user ${buyer_id} with quantity ${quantity}`
      );
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (e) {
    console.error("Error updating item quantity:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/cart/:buyer_id/:item_id", async (req, res) => {
  const { buyer_id, item_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM shopping_cart WHERE buyer_id = $1 AND item_id = $2 RETURNING *",
      [buyer_id, item_id]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Item removed successfully." });
    } else {
      res.status(404).json({ message: "Item not found." });
    }
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cart", async (req, res) => {
  const { buyer_id, item_id, quantity, seller_id, price } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO shopping_cart(buyer_id,item_id,quantity,seller_id,price) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [buyer_id, item_id, quantity, seller_id, price]
    );
    console.log("Item stored successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/complaints/:buyer_id", async (req, res) => {
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

app.get("/complaints/:/seller_id", async (req, res) => {
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

app.get("/get_seller_complaints/:sellerID", async (req, res) => {
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

app.get("/get_user/:uid", async (req, res) => {
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

app.get("/complaints", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM complaint");

    if (result.rows.length === 0) {
      return res.status(404).send("No complanits found");
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});

app.post("/api/items", async (req, res) => {
  const {
    item_name,
    unit_price,
    quantity,
    image_url,
    average_rating_value,
    description,
    seller_id,
    unit_type,
    category,
  } = req.body;

  try {
    // Validate input
    if (
      !item_name ||
      !unit_price ||
      !quantity ||
      !image_url ||
      !description ||
      !seller_id ||
      !unit_type
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate item_id in the format ITxxxx
    const result = await pool.query("SELECT COUNT(*) FROM item");
    const itemCount = parseInt(result.rows[0].count) + 1;
    const item_id = `IT${String(itemCount).padStart(4, "0")}`;

    // Insert the new item into the database
    const insertResult = await pool.query(
      `INSERT INTO item (
          item_id, item_name, unit_price, quantity, image_url,average_rating_value, description, seller_id, unit_type,category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *`,
      [
        item_id,
        item_name,
        unit_price,
        quantity,
        image_url,
        average_rating_value,
        description,
        seller_id,
        unit_type,
        category,
      ]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error("Error inserting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/complaints", async (req, res) => {
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

app.put("/api/complaints/:id/status", async (req, res) => {
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

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
