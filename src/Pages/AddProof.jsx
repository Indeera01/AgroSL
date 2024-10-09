/*import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AddProof = () => {
  const { deliveryId } = useParams();
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [complaints, setDeliveries] = useState([]);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    // Upload image to Firebase (you need to implement this part)
    const firebaseUrl = await uploadImageToFirebase(formData); // Implement this function to upload to Firebase

    if (firebaseUrl) {
      try {
        await axios.post(
          `http://backend-rho-three-58.vercel.app/deliveries/${deliveryId}/proof`,
          {
            signature_url: firebaseUrl,
          }
        );
        setSuccess("Proof of delivery added successfully!");
      } catch (err) {
        setError("Failed to update the delivery status.");
      }
    }
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await fetch(`http://backend-rho-three-58.vercel.app/delivery-status/${deliveryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state for deliveries
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.delivery_id === deliveryId
            ? { ...delivery, delivery_status: newStatus }
            : delivery
        )
      );

      alert("Delivery status updated successfully!");
    } catch (error) {
      console.error("Error updating delivery status: ", error);
    }
  };

  const handleAddProof = async (deliveryId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("signature", file);

        try {
          const res = await axios.post(
            `http://backend-rho-three-58.vercel.app/upload-signature/${deliveryId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          alert("Proof of delivery uploaded successfully!");
        } catch (error) {
          console.error("Error uploading proof of delivery:", error);
        }
      }
    };
    fileInput.click();
  };

  return (
    <div style={styles.container}>
      <Navigation_Bar_Seller />
      <h1 style={styles.header}>Available Deliveries</h1>
      {deliveries.map((delivery) => (
        <div key={delivery.delivery_id} style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.deliveryId}>Delivery ID: {delivery.delivery_id}</p>
          </div>
          <p style={styles.detail}>Order ID: {delivery.order_id}</p>
          <p style={styles.detail}>Address ID: {delivery.address_id}</p>

          <select
            value={delivery.delivery_status || ""}
            onChange={(e) =>
              handleStatusChange(delivery.delivery_id, e.target.value)
            }
            style={styles.dropdown}
          >
            <option value="">Delivery Processing</option>
            <option value="delivery shipped">Delivery Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          <button
            onClick={() => handleAddProof(delivery.delivery_id)}
            style={styles.button}
          >
            Add Proof of Delivery
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddProof;
*/
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SubmitSignature = () => {
  const { deliveryId } = useParams(); // Extract deliveryId from URL parameters
  const [signature, setSignature] = useState(null); // State for storing the selected file
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  const handleFileChange = (e) => {
    setSignature(e.target.files[0]); // Set the selected file to state
  };

  const handleUpload = async () => {
    if (!signature) {
      setError("Please upload a signature image.");
      return;
    }

    const formData = new FormData();
    formData.append("signature", signature); // Append the file to the FormData

    try {
      const response = await axios.post(
        `http://backend-rho-three-58.vercel.app/deliveries/${deliveryId}/proof`, // Your API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file upload
          },
        }
      );

      setSuccess("Proof of delivery added successfully!");
      setError(null); // Clear any previous errors
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
        accept="image/*" // Accept only image files
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

// Styles for the component
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
