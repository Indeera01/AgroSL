/*import React, { useEffect, useState } from "react";
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
*/

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate here
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import axios from "axios";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const { riderId } = useParams(); // Extract riderId from the URL

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/deliveries/${riderId}`
        );
        setDeliveries(res.data);
        console.log(deliveries);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [riderId]); // Re-run this effect when riderId changes

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      // Send the PUT request to update the delivery status
      await fetch(`http://localhost:5001/delivery-status/${deliveryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_status: newStatus,
          is_delivered_to_buyer: newStatus === "Delivered", // Update 'is_delivered_to_buyer' only if delivered
        }),
      });

      // Update the local state after the status change
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.delivery_id === deliveryId
            ? {
                ...delivery,
                delivery_status: newStatus,
                is_delivered_to_buyer: newStatus === "Delivered",
              }
            : delivery
        )
      );
    } catch (error) {
      console.error("Error updating delivery status: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (deliveries.length === 0) {
  //   return <div>No deliveries found</div>;
  // }

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
          <p style={styles.detail}>Buyer Name: {delivery.buyer_first_name}</p>
          <p style={styles.detail}>Ordered Date: {delivery.order_date}</p>
          <p style={styles.detail}>Address: {delivery.address_id}</p>

          <select
            value={delivery.delivery_status}
            onChange={(e) =>
              handleStatusChange(delivery.delivery_id, e.target.value)
            }
            style={styles.dropdown}
          >
            <option value="Delivery Processing">Delivery Processing</option>
            <option value="Delivery Shipped">Delivery Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
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
  deliveryId: {
    fontWeight: "bold",
    color: "#333",
  },
  detail: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "5px",
  },
  dropdown: {
    margin: "10px 0",
    padding: "5px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Deliveries;
