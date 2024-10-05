/*import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import axios from "axios";
import { useParams } from "react-router-dom";

const Buyer_Orders = () => {
  const [orders, setOrders] = useState([]);
  const { buyer_id } = useParams(); // Extract buyer_id from the URL

  useEffect(() => {
    const fetchOrders = async () => {
      if (!buyer_id) return; // Wait until we have buyer_id from the URL
      console.log("Fetching orders for buyer_id: ", buyer_id);
      try {
        // Use the buyer_id to fetch the buyer's orders
        const response = await axios.get(
          `http://localhost:5001/api/orders_for_buyers/${buyer_id}`
        );

        const data = response.data;

        // Filter orders where sent_to_delivery is false (if needed)
        const filteredData = data.filter((order) => !order.sent_to_delivery);
        console.log("Filtered orders: ", filteredData);

        // Sort by order_id (optional sorting, based on your data structure)
        filteredData.sort((a, b) => b.order_id.localeCompare(a.order_id));

        setOrders(filteredData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    // Fetch orders when buyer_id is available
    if (buyer_id) {
      fetchOrders();
    }
  }, [buyer_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format date as MM/DD/YYYY
  };

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={styles.card}>
            <div style={styles.cardHeader}>
              <p style={styles.orderId}>Order ID: {order.order_id}</p>
            </div>
            <p style={styles.detail}>Seller ID: {order.seller_id}</p>
            <p style={styles.detail}>Item ID: {order.item_id}</p>
            <p style={styles.detail}>
              Order Date: {formatDate(order.order_date)}
            </p>
            <p style={styles.detail}>Quantity: {order.order_quantity}</p>
          </div>
        ))
      )}
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
};

export default Buyer_Orders;
*/
import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const Buyer_Orders = () => {
  const [orders, setOrders] = useState([]);
  const { buyer_id } = useParams(); // Extract buyer_id from the URL
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchOrders = async () => {
      if (!buyer_id) return; // Wait until we have buyer_id from the URL
      console.log("Fetching orders for buyer_id: ", buyer_id);
      try {
        // Use the buyer_id to fetch the buyer's orders
        const response = await axios.get(
          `http://localhost:5001/api/orders_for_buyers/${buyer_id}`
        );

        const data = response.data;

        // Filter orders where sent_to_delivery is false (if needed)
        const filteredData = data.filter((order) => order.sent_to_delivery);
        console.log("Filtered orders: ", filteredData);

        // Sort by order_id (optional sorting, based on your data structure)
        filteredData.sort((a, b) => b.order_id.localeCompare(a.order_id));

        setOrders(filteredData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    // Fetch orders when buyer_id is available
    if (buyer_id) {
      fetchOrders();
    }
  }, [buyer_id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format date as MM/DD/YYYY
  };

  // Function to handle the complaint button click
  const handleComplain = (order) => {
    // Navigate to the complaint page, passing order_id and seller_id
    navigate(`/complain`, {
      state: { order_id: order.order_id, seller_id: order.seller_id },
    });
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
            <p style={styles.detail}>Seller ID: {order.seller_id}</p>
            <p style={styles.detail}>Item ID: {order.item_id}</p>
            <p style={styles.detail}>
              Order Date: {formatDate(order.order_date)}
            </p>
            <p style={styles.detail}>Quantity: {order.order_quantity}</p>

            {/* Add Complain button */}
            <button
              style={styles.complainButton}
              onClick={() => handleComplain(order)}
            >
              Complain
            </button>
          </div>
        ))
      )}
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
  complainButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Smooth transition effect
  },
  complainButtonHover: {
    backgroundColor: "#ff554a", // Change the color on hover
  },
};

export default Buyer_Orders;
