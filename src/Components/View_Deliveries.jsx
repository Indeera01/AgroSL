import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function View_Deliveries() {
  const navigate = useNavigate();
  const { riderId } = useParams(); // Extract riderId from URL

  const handleViewDeliveries = () => {
    if (riderId) {
      navigate(`/delivery_rider_dashboard/${riderId}/deliveries`);
    } else {
      console.error("riderId is undefined");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button
          style={{
            ...styles.button,
            ":hover": styles.buttonHover,
          }}
          onClick={handleViewDeliveries}
        >
          View Deliveries
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#F4F7F6",
    borderRadius: "20px",
    padding: "30px",
    textAlign: "center",
    width: "300px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4B8412",
    color: "#fff",
    borderRadius: "25px",
    width: "220px",
    height: "55px",
    padding: "15px 25px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#5A9274",
    transform: "scale(1.05)",
  },
};

export default View_Deliveries;
