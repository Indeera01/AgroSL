import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const { seller_id } = useParams();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `https://backend-rho-three-58.vercel.app/api/complaints?seller_id=${seller_id}`
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
        `https://backend-rho-three-58.vercel.app/api/complaints/${complaintId}/status`,
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
      <Navigation_Bar_Seller />
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
          <p style={styles.detail}>Rider Name: {complaint_users.rider_name}</p>
          <p style={styles.detail}>
            Seller Name: {complaint_users.seller_name}
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
    backgroundColor: "#E6F4EA",
    fontFamily: "'Roboto', sans-serif",
    height: "100%",
    paddingBottom: "1px",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: "30px",
    fontSize: "32px",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "25px",
    margin: "15px auto",
    maxWidth: "700px",
    borderRadius: "10px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  complaintId: {
    fontWeight: "bold",
    color: "#34495E",
  },
  statusDropdown: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #BDC3C7",
    backgroundColor: "#ECF0F1",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  description: {
    fontSize: "15px",
    color: "#7F8C8D",
    marginBottom: "15px",
  },
  detail: {
    fontSize: "14px",
    color: "#95A5A6",
    marginBottom: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    color: "#2C3E50",
  },
  checkbox: {
    marginLeft: "10px",
    transform: "scale(1.2)",
  },
};

export default Complaints;
