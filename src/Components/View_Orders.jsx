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
      <div style={styles.content}>
        <button
          style={{
            ...styles.button,
            ":hover": styles.buttonHover,
          }}
          onClick={handleViewOrders}
        >
          View Orders
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
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
    transition: "transform 0.3s ease", // Add subtle interaction effect
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4B8412", // Modern, calming green shade
    color: "#fff", // White text for contrast
    borderRadius: "25px", // Round edges
    width: "220px",
    height: "55px",
    padding: "15px 25px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow for button
    transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth transition on hover
  },
  buttonHover: {
    backgroundColor: "#5A9274", // Darken on hover
    transform: "scale(1.05)", // Slight scale on hover
  },
};

export default ViewOrders;
