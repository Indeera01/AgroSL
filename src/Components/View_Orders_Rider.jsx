import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function View_Orders_Rider() {
  const navigate = useNavigate();
  const { riderId } = useParams(); // Extract riderId from URL

  const handleViewOrders = () => {
    if (riderId) {
      navigate(`/delivery_rider_dashboard/${riderId}/orders`); // Use template string to navigate
    } else {
      console.error("riderId is undefined");
    }
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button style={styles.button} onClick={handleViewOrders}>
          View Orders
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#A9D08E",
    borderRadius: "15px",
    padding: "20px",
    textAlign: "center",
    width: "300px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#D9D9D9",
    borderRadius: "15px",
    width: "200px",
    height: "50px",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
  },
};

export default View_Orders_Rider;
