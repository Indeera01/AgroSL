import React from "react";
import { useNavigate } from "react-router-dom";

function ViewInventory() {
  const navigate = useNavigate();

  const handleViewInventory = () => {
    navigate("/inventory"); // This will navigate to the InventoryPage
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
        <button style={styles.button} onClick={handleViewInventory}>
          View Inventory
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
    alignComplaints: "center",
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

export default ViewInventory;
