import { Navigation } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { seller_id } = useParams(); // Extracting seller_id from the URL

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/orders?seller_id=${seller_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // Filter orders where sent_to_delivery is false
        const filteredData = data.filter((order) => !order.sent_to_delivery);
        // Assuming 'order_id' is the field to sort by
        filteredData.sort((a, b) => b.order_id.localeCompare(a.order_id));

        setOrders(filteredData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, [seller_id]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status_seller: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  const handleSendToDelivery = async (orderId) => {
    try {
      await fetch(`http://localhost:5001/api/orders/${orderId}/send`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sent_to_delivery: true }),
      });
      setOrders(
        (prevOrders) => prevOrders.filter((order) => order.order_id !== orderId) // Remove the order after sending it to delivery
      );
    } catch (error) {
      console.error("Error sending order to delivery: ", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format date as MM/DD/YYYY or use another locale/date style as needed
  };

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Orders</h1>
      {orders.map((order) => (
        <div key={order.order_id} style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.orderId}>Order ID: {order.order_id}</p>
          </div>
          <p style={styles.detail}>Buyer ID: {order.buyer_id}</p>
          <p style={styles.detail}>Item ID: {order.item_id}</p>
          <p style={styles.detail}>
            Order Date: {formatDate(order.order_date)}
          </p>
          <p style={styles.detail}>Quantity: {order.order_quantity}</p>
          <button
            style={styles.sendButton}
            onClick={() => handleSendToDelivery(order.order_id)}
          >
            Send to Delivery
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#E6F4EA",
    height: "100%",
    paddingBottom: "1px",
    minHeight: "100vh",
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
  statusDropdown: {
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  detail: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "5px",
  },
  sendButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Orders;
