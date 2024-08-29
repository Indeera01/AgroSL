import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";

const Admin_Page = () => {
  const [users, setUsers] = useState([]);
  const [sellersChecked, setSellersChecked] = useState(false);
  const [buyersChecked, setBuyersChecked] = useState(false);
  const [ridersChecked, setRidersChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [usersClicked, setUsersClicked] = useState(false);
  const [complaintsClicked, setComplaintsClicked] = useState(false);
  const navigate = useNavigate();

  const handleSellersChange = (event) => {
    setSellersChecked(event.target.checked);
  };

  const handleBuyersChange = (event) => {
    setBuyersChecked(event.target.checked);
  };

  const handleRidersChange = (event) => {
    setRidersChecked(event.target.checked);
  };

  const handleSearch = () => {
    const types = [];
    if (sellersChecked) types.push("seller");
    if (buyersChecked) types.push("buyer");
    if (ridersChecked) types.push("delivery_rider");

    if (types.length == 0) {
      alert("Select at least one user type!");
    } else {
      axios
        .get("http://localhost:5001/users_by_type", {
          params: { types: types.join(",") }, // Send selected types as query parameters
        })
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
      setUsersClicked(true);
      setComplaintsClicked(false);
    }
  };

  const handleComplaints = () => {
    axios
      .get("http://localhost:5001/all_complaints_for_admins")
      .then((res) => {
        setComplaints(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    setComplaintsClicked(true);
    setUsersClicked(false);
  };

  const handleAdminCreate = () => {
    navigate("/admin_signup");
  };

  return (
    <Box>
      <Grid container spacing={10} direction="row" margin={3}>
        <Box
          sx={{
            backgroundColor: "#98BC74",
            padding: "10px",
          }}
        >
          <Typography variant="h5">Search for users</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sellersChecked}
                  onChange={handleSellersChange}
                />
              }
              label="Sellers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={buyersChecked}
                  onChange={handleBuyersChange}
                />
              }
              label="Buyers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={ridersChecked}
                  onChange={handleRidersChange}
                />
              }
              label="Riders"
            />
          </FormGroup>
          <Button
            onClick={handleSearch}
            sx={{
              backgroundColor: "#4B8412", // Background color
              color: "#ffffff", // Text color
              "&:hover": {
                // Hover effect
                backgroundColor: "#3A6B0F", // Darker shade on hover
              },
            }}
          >
            Search
          </Button>
        </Box>
        <Box marginLeft={10}>
          <Button
            onClick={handleComplaints}
            sx={{
              backgroundColor: "#4B8412", // Background color
              color: "#ffffff", // Text color
              "&:hover": {
                // Hover effect
                backgroundColor: "#3A6B0F", // Darker shade on hover
              },
            }}
          >
            Show Complaints
          </Button>
        </Box>
        <Box marginLeft={10}>
          <Button
            onClick={handleAdminCreate}
            sx={{
              backgroundColor: "#4B8412", // Background color
              color: "#ffffff", // Text color
              "&:hover": {
                // Hover effect
                backgroundColor: "#3A6B0F", // Darker shade on hover
              },
            }}
          >
            Create new admin
          </Button>
        </Box>
      </Grid>

      {usersClicked && (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650, backgroundColor: "#DFF2BF" }}
            aria-label="simple table"
          >
            <TableHead sx={{ backgroundColor: "#4B8412" }}>
              <TableRow>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">Mobile Number</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">User Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.user_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="center">{user.user_id}</TableCell>
                  <TableCell align="center">{user.first_name}</TableCell>
                  <TableCell align="center">{user.last_name}</TableCell>
                  <TableCell align="center">{user.mobile_number}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.user_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {complaintsClicked && (
        <Box>
          <div style={styles.container}>
            <h1 style={styles.header}>Complaints</h1>
            {complaints.map((complaint_users) => (
              <div key={complaint_users.complaint_id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <p style={styles.complaintId}>
                    Complaint ID: {complaint_users.complaint_id}
                  </p>
                </div>
                <p style={styles.description}>
                  Description: {complaint_users.description}
                </p>
                <p style={styles.detail}>
                  Rider name: {complaint_users.rider_name}
                </p>
                <p style={styles.detail}>
                  Seller name: {complaint_users.seller_name}
                </p>
                <p style={styles.detail}>
                  Order ID: {complaint_users.order_id}
                </p>
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
        </Box>
      )}
    </Box>
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

export default Admin_Page;
