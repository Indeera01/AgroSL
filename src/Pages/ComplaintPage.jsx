/*import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ComplaintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract order_id and seller_id passed from the previous page
  const { order_id, seller_id } = location.state;

  const [description, setDescription] = useState("");
  const [complainSeller, setComplainSeller] = useState(false); // Checkbox state
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure description is not empty
    if (!description) {
      setError("Description is required");
      return;
    }

    try {
      // Post data to the backend
      const response = await axios.post(
        "http://localhost:5001/api/complaints",
        {
          buyer_id, // Replace with actual buyer_id from the session or state
          description,
          seller_id,
          order_id,
          complaint_seller: complainSeller,
          complaint_status_seller: "reviewing", // Set default status
        }
      );

      if (response.status === 200) {
        alert("Complaint submitted successfully!");
        navigate("/orders_for_buyers"); // Navigate back to orders or wherever you want
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError("Failed to submit the complaint. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Submit a Complaint</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Order ID:</label>
          <input type="text" value={order_id} readOnly style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Seller ID:</label>
          <input type="text" value={seller_id} readOnly style={styles.input} />
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
  );
};

// Basic styling
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#F9F9F9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
  submitButtonHover: {
    backgroundColor: "#ff4a4a",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default ComplaintPage;
*/
/*import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase auth

const ComplaintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase auth

  // Extract order_id and seller_id passed from the previous page
  const { order_id, seller_id } = location.state;

  const [description, setDescription] = useState("");
  const [complainSeller, setComplainSeller] = useState(false); // Checkbox state
  const [error, setError] = useState("");
  const [buyerId, setBuyerId] = useState(null); // To store buyer_id from Firebase

  // Get the authenticated user and set buyerId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBuyerId(user.uid); // Set buyer_id from Firebase Authentication
      } else {
        setError("You need to be logged in to submit a complaint.");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure description is not empty
    if (!description) {
      setError("Description is required");
      return;
    }

    try {
      // Post data to the backend
      const response = await axios.post(
        "http://localhost:5001/api/complaints",
        {
          buyer_id: buyerId, // Send the buyer_id from Firebase
          description,
          seller_id,
          order_id,
          complaint_seller: complainSeller,
          complaint_status_seller: "reviewing", // Set default status
        }
      );

      if (response.status === 200) {
        alert("Complaint submitted successfully!");
        navigate(-1); // Navigate to the previous page
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError("Failed to submit the complaint. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Submit a Complaint</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Order ID:</label>
          <input type="text" value={order_id} readOnly style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Seller ID:</label>
          <input type="text" value={seller_id} readOnly style={styles.input} />
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
  );
};

// Basic styling
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#F9F9F9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase auth
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller"; // Import the Navigation_Bar_Seller component

const ComplaintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase auth

  // Extract order_id and seller_id passed from the previous page
  const { order_id, seller_id } = location.state;

  const [description, setDescription] = useState("");
  const [complainSeller, setComplainSeller] = useState(false); // Checkbox state
  const [error, setError] = useState("");
  const [buyerId, setBuyerId] = useState(null); // To store buyer_id from Firebase

  // Get the authenticated user and set buyerId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBuyerId(user.uid); // Set buyer_id from Firebase Authentication
      } else {
        setError("You need to be logged in to submit a complaint.");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure description is not empty
    if (!description) {
      setError("Description is required");
      return;
    }

    try {
      // Post data to the backend
      const response = await axios.post(
        "http://localhost:5001/api/complaints",
        {
          buyer_id: buyerId, // Send the buyer_id from Firebase
          description,
          seller_id,
          order_id,
          complaint_seller: complainSeller,
          complaint_status_seller: "reviewing", // Set default status
        }
      );

      if (response.status === 200) {
        alert("Complaint submitted successfully!");
        navigate(-1); // Navigate to the previous page
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setError("Failed to submit the complaint. Please try again.");
    }
  };

  return (
    <>
      {/* Add Navigation_Bar_Seller at the top */}
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
    </>
  );
};

// Basic styling
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#F9F9F9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
