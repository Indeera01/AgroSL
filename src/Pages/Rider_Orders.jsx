import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import axios from "axios";

const Rider_Orders = () => {
  const [orders, setOrders] = useState([]);
  const { rider_id } = useParams();

  console.log(rider_id); // Extracting rider_id from the URL

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5001/orders_for_riders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const handleTakeIt = async (orderID) => {
    try {
      const response = await axios.put(
        "http://localhost:5001/orders_take/${orderID}"
      );
    } catch (error) {
      console.error("Error updating take order ", error);
    }

    try {
      const response = await axios.post("http://localhost:5001/delivery", {
        order_id: orderID,
        rider_id: rider_id,
      });
    } catch (error) {
      console.error("Error updating take order ", error);
    }
  };

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Available Orders</h1>
      {orders.map((order) => (
        <div key={order.order_id} style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.orderId}>Order ID: {order.order_id}</p>
          </div>
          <p style={styles.detail}>Buyer ID: {order.buyer_id}</p>
          <p style={styles.detail}>Item ID: {order.item_id}</p>
          <p style={styles.detail}>
            Order Date: {new Date(order.order_date).toLocaleDateString()}
          </p>
          <p style={styles.detail}>Quantity: {order.order_quantity}</p>
          <button
            style={styles.takeButton}
            onClick={() => handleTakeIt(order.order_id)}
          >
            Take It
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    margin: "10px auto",
    maxWidth: "600px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  orderId: {
    fontWeight: "bold",
    color: "#333",
  },
  detail: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "5px",
  },
  takeButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Rider_Orders;
