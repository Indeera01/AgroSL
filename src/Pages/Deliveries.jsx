// import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { auth } from "../../firebase";
import axios from "axios";
import { useState, useEffect } from "react";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        axios
          .get(`http://localhost:5001/users/${currentUser.uid}`)
          .then((res) => {
            setUser(res.data);
            console.log("User data:", res.data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user logged in</div>;
  }

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Available Deliveries</h1>
      {deliveries.map((delivery) => (
        <div key={delivery.order_id} style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.orderId}>Order ID: {delivery.order_id}</p>
          </div>
          <p style={styles.detail}>Buyer ID: {delivery.buyer_id}</p>
          <p style={styles.detail}>Item ID: {delivery.item_id}</p>
          <p style={styles.detail}>
            Order Date: {new Date(delivery.order_date).toLocaleDateString()}
          </p>
          <p style={styles.detail}>Quantity: {delivery.order_quantity}</p>
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

export default Deliveries;
