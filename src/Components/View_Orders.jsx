import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function ViewOrders() {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract seller_id from URL

  const handleViewOrders = () => {
    navigate(`/sellerdashboard/${id}/orders`); // Use template string to navigate
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

export default ViewOrders;
