import React from "react";
import { useNavigate } from "react-router-dom";

function Post_Item() {
  const navigate = useNavigate();

  const handlePostItemClick = () => {
    // Extract seller ID from the current URL
    const sellerId = window.location.pathname.split("/")[2];
    // Navigate to the add item page, passing the seller ID
    navigate(`/add_item/${sellerId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button
          style={{
            ...styles.button,
            ":hover": styles.buttonHover,
          }}
          onClick={handlePostItemClick}
        >
          Post Items
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

export default Post_Item;
