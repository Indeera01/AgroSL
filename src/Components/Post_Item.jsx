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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button style={styles.button} onClick={handlePostItemClick}>
          Post_Item
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

export default Post_Item;
