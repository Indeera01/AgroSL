import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Buyer_Orders = () => {
  const [orders, setOrders] = useState([]);
  const { buyer_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!buyer_id) return;
      console.log("Fetching orders for buyer_id: ", buyer_id);
      try {
        const response = await axios.get(
          `https://backend-rho-three-58.vercel.app/api/orders_for_buyers/${buyer_id}`
        );

        const data = response.data;

        data.sort((a, b) => b.order_id.localeCompare(a.order_id));

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    if (buyer_id) {
      fetchOrders();
    }
  }, [buyer_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleComplain = (order) => {
    navigate(`/complain`, {
      state: { order_id: order.order_id, seller_id: order.seller_id },
    });
  };

  const handleTrackOrder = (order_id) => {
    navigate(`/home/tracking/${order_id}`);
  };

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Orders on Delivery</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={styles.card}>
            <div style={styles.cardHeader}>
              <p style={styles.orderId}>Order ID: {order.order_id}</p>
            </div>
            <p style={styles.detail}>Seller Name: {order.seller_name}</p>
            <p style={styles.detail}>Item ID: {order.item_id}</p>
            <p style={styles.detail}>
              Order Date: {formatDate(order.order_date)}
            </p>
            <p style={styles.detail}>Quantity: {order.order_quantity}</p>

            <div style={styles.buttonContainer}>
              <button
                style={styles.complainButton}
                onClick={() => handleComplain(order)}
              >
                Complain
              </button>

              <button
                style={styles.trackOrderButton}
                onClick={() => handleTrackOrder(order.order_id)}
              >
                Track Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#e6ffe6",
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
    position: "relative",
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
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  complainButton: {
    padding: "8px 16px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  trackOrderButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "auto",
  },
};

export default Buyer_Orders;
