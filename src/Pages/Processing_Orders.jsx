import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";

const Processing_Orders = () => {
  const [processing_orders, setOrders] = useState([]);
  const { seller_id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `https://backend-rho-three-58.vercel.app/api/processingorders?seller_id=${seller_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Filter orders where sent_to_delivery is true
        const filteredData = data.filter(
          (processing_orders) => processing_orders.sent_to_delivery === true
        );

        filteredData.sort((a, b) => b.order_id.localeCompare(a.order_id));

        setOrders(filteredData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, [seller_id]);

  const handleSendToDelivery = async (orderId) => {
    try {
      await fetch(
        `https://backend-rho-three-58.vercel.app/api/processingorders/${orderId}/send`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOrders(
        (prevOrders) => prevOrders.filter((order) => order.order_id !== orderId) // Remove the order after sending it to delivery
      );
    } catch (error) {
      console.error("Error sending order to delivery: ", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Processing Orders</h1>
      {processing_orders.map((order) => (
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
            Cancel the delivery
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#E6F4EA",
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

export default Processing_Orders;
