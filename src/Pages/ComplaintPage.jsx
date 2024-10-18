import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { Box } from "@mui/material";

const ComplaintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase auth

  const { order_id, seller_id } = location.state;

  const [description, setDescription] = useState("");
  const [complainSeller, setComplainSeller] = useState(false);
  const [error, setError] = useState("");
  const [buyerId, setBuyerId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBuyerId(user.uid);
      } else {
        setError("You need to be logged in to submit a complaint.");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      setError("Description is required");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-rho-three-58.vercel.app/api/complaints",
        {
          buyer_id: buyerId,
          description,
          seller_id,
          order_id,
          complaint_seller: complainSeller,
          complaint_status_seller: "reviewing",
        }
      );

      if (response.status === 200) {
        alert("Complaint submitted successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError("Failed to submit the complaint. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        height: "100%",
        paddingBottom: "1px",
        minHeight: "100vh",
      }}
    >
      <Navigation_Bar_Seller />

      <div style={styles.container}>
        <h2 style={styles.header}>Submit a Complaint</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Order ID:</label>
            <input type="text" value={order_id} readOnly style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Seller ID:</label>
            <input
              type="text"
              value={seller_id}
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Complaint Description:</label>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the complaint description"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={complainSeller}
                onChange={(e) => setComplainSeller(e.target.checked)}
              />
              Complaint Against Seller
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton}>
            Submit Complaint
          </button>
        </form>
      </div>
    </Box>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#F9F9F9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    width: "100%",
    height: "100px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default ComplaintPage;
