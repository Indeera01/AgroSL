import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SubmitSignature = () => {
  const { deliveryId } = useParams();
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!signature) {
      setError("Please upload a signature image.");
      return;
    }

    const formData = new FormData();
    formData.append("signature", signature);

    try {
      const response = await axios.post(
        `https://backend-rho-three-58.vercel.app/deliveries/${deliveryId}/proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Proof of delivery added successfully!");
      setError(null);
    } catch (err) {
      setError("Failed to upload proof of delivery.");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Submit Signature for Delivery</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <button onClick={handleUpload} style={styles.button}>
        Submit Signature
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  fileInput: {
    display: "block",
    margin: "0 auto",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
};

export default SubmitSignature;
