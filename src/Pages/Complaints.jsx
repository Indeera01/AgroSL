import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { seller_id } = useParams(); // Extracting seller_id from the URL

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/complaints?seller_id=${seller_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }
        const data = await response.json();
        data.sort((a, b) => b.complaint_id.localeCompare(a.complaint_id));

        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints: ", error);
      }
    };

    fetchComplaints();
  }, [seller_id]);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await fetch(
        `http://localhost:5001/api/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.complaint_id === complaintId
            ? { ...complaint, complaint_status_seller: newStatus }
            : complaint
        )
      );
    } catch (error) {
      console.error("Error updating complaint status: ", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Complaints</h1>
      {complaints.map((complaint_users) => (
        <div key={complaint_users.complaint_id} style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.complaintId}>
              Complaint ID: {complaint_users.complaint_id}
            </p>
            <select
              style={styles.statusDropdown}
              value={complaint_users.complaint_status_seller}
              onChange={(e) =>
                handleStatusChange(complaint_users.complaint_id, e.target.value)
              }
            >
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
          <p style={styles.description}>
            Description: {complaint_users.description}
          </p>
          <p style={styles.detail}>Rider name: {complaint_users.rider_name}</p>
          <p style={styles.detail}>
            Seller name: {complaint_users.seller_name}
          </p>
          <p style={styles.detail}>Order ID: {complaint_users.order_id}</p>
          <label style={styles.checkboxLabel}>
            Complained Seller:
            <input
              type="checkbox"
              checked={complaint_users.complained_seller}
              readOnly
              style={styles.checkbox}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    margin: "10px auto",
    maxWidth: "600px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  complaintId: {
    fontWeight: "bold",
    color: "#333",
  },
  statusDropdown: {
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  detail: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "5px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#555",
  },
  checkbox: {
    marginLeft: "5px",
  },
};

export default Complaints;
