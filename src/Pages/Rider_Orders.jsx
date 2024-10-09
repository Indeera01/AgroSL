/*import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { auth } from "../../firebase";
import axios from "axios";

const Rider_Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user from Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        axios
          .get(`http://backend-rho-three-58.vercel.app/users/${currentUser.uid}`)
          .then((res) => {
            setUser(res.data);
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

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Fetch orders where sent_to_delivery is true
  useEffect(() => {
    if (user) {
      axios
        .get(`http://backend-rho-three-58.vercel.app/orders?sent_to_delivery=true`) // Modify the API endpoint to fetch orders
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [user]);

  // Handle 'Take It' button click
  const handleTakeOrder = (orderId) => {
    axios
      .put(`http://backend-rho-three-58.vercel.app/orders/${orderId}`, {
        sent_to_delivery: true,
      })
      .then(() => {
        // Refresh the orders list after taking an order
        setOrders(orders.filter((order) => order.order_id !== orderId));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

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
      <h1 style={styles.header}>Available Orders for Delivery</h1>
      {orders.length === 0 ? (
        <p>No orders available for delivery</p>
      ) : (
        orders.map((order) => (
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
            <p style={styles.detail}>
              Is Confirmed: {order.is_confirmed ? "Yes" : "No"}
            </p>
            <button
              style={styles.takeButton}
              onClick={() => handleTakeOrder(order.order_id)}
            >
              Take It
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
    position: "relative", // Add relative positioning to card for button positioning
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
    position: "absolute",
    bottom: "10px",
    right: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Rider_Orders;
*/

import React, { useEffect, useState } from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { auth } from "../../firebase";
import axios from "axios";

const Rider_Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the user from Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        axios
          .get(
            `http://backend-rho-three-58.vercel.app/users/${currentUser.uid}`
          )
          .then((res) => {
            setUser(res.data);
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

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Fetch orders where sent_to_delivery is true
  useEffect(() => {
    if (user) {
      axios
        .get(`http://backend-rho-three-58.vercel.app/orders`) // Modify the API endpoint to fetch orders
        .then((res) => {
          if (res.data.length === 0) {
            setOrders([]); // No orders available
          } else {
            setOrders(res.data);
          }
        }) // Orders available)
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setError("No orders found.");
          } else {
            setError(err.message);
          }
        });
    }
  }, [user]);

  // Handle 'Take It' button click
  const handleTakeOrder = (orderId) => {
    // Generate delivery_id with a timestamp for uniqueness
    const deliveryData = {
      order_id: orderId,
      delivery_rider_id: user.user_id, // Extracted from user state
      is_delivered_to_buyer: false,
    };
    console.log("Delivery Data:", deliveryData);
    console.log("Current User:", user);

    // Move order to delivery table and update the order table
    axios
      .post(`http://backend-rho-three-58.vercel.app/deliveries`, {
        deliveryData,
      }) // Add to delivery table
      .then(() => {
        return axios.put(
          `http://backend-rho-three-58.vercel.app/orders/${orderId}`,
          {
            deliver_took: true,
          }
        ); // Update order table
      })
      .then(() => {
        return axios.put(
          `http://backend-rho-three-58.vercel.app/orders/${orderId}`
        ); // Delete order from order table
      })
      .then(() => {
        // Refresh the orders list after taking an order
        setOrders(orders.filter((order) => order.order_id !== orderId));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

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
      <h1 style={styles.header}>Available Orders for Delivery</h1>
      {orders.length === 0 ? (
        <p>No orders available for delivery</p> // Display this message if no orders are found
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={styles.card}>
            <div style={styles.cardHeader}>
              <p style={styles.orderId}>Order ID: {order.order_id}</p>
            </div>

            <p style={styles.detail}>Seller Name: {order.seller_name}</p>
            <p style={styles.detail}>Buyer Name: {order.buyer_name}</p>
            <p style={styles.detail}>From: {order.seller_address}</p>
            <p style={styles.detail}>To: {order.buyer_address}</p>
            <button
              style={styles.takeButton}
              onClick={() => handleTakeOrder(order.order_id)}
            >
              Take It
            </button>
          </div>
        ))
      )}
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
    position: "relative", // Add relative positioning to card for button positioning
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
    position: "absolute",
    bottom: "10px",
    right: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Rider_Orders;
