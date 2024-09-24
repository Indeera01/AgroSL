import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import axios from "axios";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { riderId } = useParams(); // Extract riderId from the URL

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/deliveries/${riderId}`
        );
        setDeliveries(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [riderId]); // Re-run this effect when riderId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (deliveries.length === 0) {
    return <div>No deliveries found</div>;
  }

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Available Deliveries</h1>
      {deliveries.map((delivery) => (
        <div key={delivery.order_id} style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.deliveryId}>Delivery ID: {delivery.delivery_id}</p>
          </div>
          <p style={styles.detail}>Order ID: {delivery.order_id}</p>

          <p style={styles.detail}>Address ID: {delivery.address_id}</p>
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
  deliveryId: {
    fontWeight: "bold",
    color: "#333",
  },
  detail: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "5px",
  },
};

export default Deliveries;
