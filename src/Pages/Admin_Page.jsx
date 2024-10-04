// import { useEffect, useState } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { Box, Button, Grid, Typography } from "@mui/material";
// import axios from "axios";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import { useNavigate } from "react-router-dom";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// const Admin_Page = () => {
//   const [users, setUsers] = useState([]);
//   const [sellersChecked, setSellersChecked] = useState(false);
//   const [buyersChecked, setBuyersChecked] = useState(false);
//   const [ridersChecked, setRidersChecked] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [complaints, setComplaints] = useState([]);
//   const [usersClicked, setUsersClicked] = useState(false);
//   const [complaintsClicked, setComplaintsClicked] = useState(false);
//   const navigate = useNavigate();

//   const handleSellersChange = (event) => {
//     setSellersChecked(event.target.checked);
//   };

//   const handleBuyersChange = (event) => {
//     setBuyersChecked(event.target.checked);
//   };

//   const handleRidersChange = (event) => {
//     setRidersChecked(event.target.checked);
//   };

//   const handleSearch = () => {
//     const types = [];
//     if (sellersChecked) types.push("seller");
//     if (buyersChecked) types.push("buyer");
//     if (ridersChecked) types.push("delivery_rider");

//     if (types.length == 0) {
//       alert("Select at least one user type!");
//     } else {
//       axios
//         .get("http://localhost:5001/users_by_type", {
//           params: { types: types.join(",") },
//         })
//         .then((res) => {
//           setUsers(res.data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           setError(err.message);
//           setLoading(false);
//         });
//       setUsersClicked(true);
//       setComplaintsClicked(false);
//     }
//   };

//   const handleComplaints = () => {
//     axios
//       .get("http://localhost:5001/all_complaints_for_admins")
//       .then((res) => {
//         setComplaints(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });

//     setComplaintsClicked(true);
//     setUsersClicked(false);
//   };

//   const handleAdminCreate = () => {
//     navigate("/admin_signup");
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#e6ffe6",
//         padding: "20px",
//         minHeight: "100vh",
//       }}
//     >
//       <Grid container spacing={2}>
//         {/* Left-side Box (40% width) */}
//         <Grid item xs={12} md={4}>
//           <Box
//             sx={{
//               backgroundColor: "#98BC74",
//               padding: "20px",
//               borderRadius: "10px",
//               marginBottom: "10px",
//             }}
//           >
//             <Typography variant="h5">Search for users</Typography>
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={sellersChecked}
//                     onChange={handleSellersChange}
//                   />
//                 }
//                 label="Sellers"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={buyersChecked}
//                     onChange={handleBuyersChange}
//                   />
//                 }
//                 label="Buyers"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={ridersChecked}
//                     onChange={handleRidersChange}
//                   />
//                 }
//                 label="Riders"
//               />
//             </FormGroup>
//             <Button
//               onClick={handleSearch}
//               sx={{
//                 backgroundColor: "#4B8412",
//                 color: "#ffffff",
//                 "&:hover": {
//                   backgroundColor: "#3A6B0F",
//                 },
//               }}
//             >
//               Search
//             </Button>

//             <Box marginTop={2}>
//               <Button
//                 onClick={handleComplaints}
//                 sx={{
//                   backgroundColor: "#4B8412",
//                   color: "#ffffff",
//                   "&:hover": {
//                     backgroundColor: "#3A6B0F",
//                   },
//                 }}
//               >
//                 Show Complaints
//               </Button>
//             </Box>

//             <Box marginTop={2}>
//               <Button
//                 onClick={handleAdminCreate}
//                 sx={{
//                   backgroundColor: "#4B8412",
//                   color: "#ffffff",
//                   "&:hover": {
//                     backgroundColor: "#3A6B0F",
//                   },
//                 }}
//               >
//                 Create new admin
//               </Button>
//             </Box>
//           </Box>
//         </Grid>

//         {/* Right-side Box (60% width) */}
//         <Grid item xs={12} md={8}>
//           {usersClicked && (
//             <TableContainer
//               component={Paper}
//               sx={{ width: "100%", margin: "0 auto" }}
//             >
//               <Table sx={{ minWidth: 650, backgroundColor: "#DFF2BF" }}>
//                 <TableHead sx={{ backgroundColor: "#4B8412" }}>
//                   <TableRow>
//                     <TableCell align="center">User ID</TableCell>
//                     <TableCell align="center">First Name</TableCell>
//                     <TableCell align="center">Last Name</TableCell>
//                     <TableCell align="center">Mobile Number</TableCell>
//                     <TableCell align="center">Email</TableCell>
//                     <TableCell align="center">User Type</TableCell>
//                     <TableCell align="center">Delete User</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {users.map((user) => (
//                     <TableRow
//                       key={user.user_id}
//                       sx={{
//                         "&:last-child td, &:last-child th": { border: 0 },
//                       }}
//                     >
//                       <TableCell align="center">{user.user_id}</TableCell>
//                       <TableCell align="center">{user.first_name}</TableCell>
//                       <TableCell align="center">{user.last_name}</TableCell>
//                       <TableCell align="center">{user.mobile_number}</TableCell>
//                       <TableCell align="center">{user.email}</TableCell>
//                       <TableCell align="center">{user.user_type}</TableCell>
//                       <TableCell align="center">
//                         <Button sx={{ color: "red" }}>
//                           <DeleteForeverIcon />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//           {complaintsClicked && (
//             <Box>
//               <div style={styles.container}>
//                 <h1 style={styles.header}>Complaints</h1>
//                 {complaints.map((complaint_users) => (
//                   <div key={complaint_users.complaint_id} style={styles.card}>
//                     <div style={styles.cardHeader}>
//                       <p style={styles.complaintId}>
//                         Complaint ID: {complaint_users.complaint_id}
//                       </p>
//                     </div>
//                     <p style={styles.description}>
//                       Description: {complaint_users.description}
//                     </p>
//                     <p style={styles.detail}>
//                       Rider name: {complaint_users.rider_name}
//                     </p>
//                     <p style={styles.detail}>
//                       Seller name: {complaint_users.seller_name}
//                     </p>
//                     <p style={styles.detail}>
//                       Order ID: {complaint_users.order_id}
//                     </p>
//                     <label style={styles.checkboxLabel}>
//                       Complained Seller:
//                       <input
//                         type="checkbox"
//                         checked={complaint_users.complained_seller}
//                         readOnly
//                         style={styles.checkbox}
//                       />
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </Box>
//           )}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// const styles = {
//   container: {
//     padding: "20px",
//     backgroundColor: "#e6ffe6",
//   },
//   header: {
//     textAlign: "center",
//     color: "#333",
//     marginBottom: "20px",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: "20px",
//     margin: "10px auto",
//     maxWidth: "600px",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   complaintId: {
//     fontWeight: "bold",
//     color: "#333",
//   },
//   description: {
//     marginBottom: "10px",
//     color: "#666",
//   },
//   detail: {
//     marginBottom: "5px",
//     color: "#333",
//   },
//   checkboxLabel: {
//     marginTop: "10px",
//     color: "#333",
//   },
//   checkbox: {
//     marginLeft: "10px",
//   },
// };

// export default Admin_Page;

import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  const [statsClicked, setStatsClicked] = useState(true);
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
          params: { types: types.join(",") },
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
      setStatsClicked(false);
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
    setStatsClicked(false);
  };

  const handleStatsClick = () => {
    setStatsClicked(true);
    setComplaintsClicked(false);
    setUsersClicked(false);
  };

  const handleAdminCreate = () => {
    navigate("/admin_signup");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e6ffe6",
        padding: "30px",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2}>
        {/* Left-side Box (40% width) */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              backgroundColor: "#98BC74",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "10px",
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
                backgroundColor: "#4B8412",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#3A6B0F",
                },
              }}
            >
              Search
            </Button>

            <Box marginTop={2}>
              <Button
                onClick={handleComplaints}
                sx={{
                  backgroundColor: "#4B8412",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#3A6B0F",
                  },
                }}
              >
                Show Complaints
              </Button>
            </Box>

            <Box marginTop={2}>
              <Button
                onClick={handleStatsClick}
                sx={{
                  backgroundColor: "#4B8412",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#3A6B0F",
                  },
                }}
              >
                Show Platform Statistics
              </Button>
            </Box>

            <Box marginTop={2}>
              <Button
                onClick={handleAdminCreate}
                sx={{
                  backgroundColor: "#4B8412",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#3A6B0F",
                  },
                }}
              >
                Create new admin
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right-side Box (60% width) */}
        <Grid item xs={12} md={9}>
          {statsClicked && (
            <Box>
              <Typography variant="h4" gutterBottom>
                Platform Statistics
              </Typography>
              <Grid container spacing={2}>
                {/* User Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    User Statistics
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Sellers</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Buyers</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Riders</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Admins</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Product Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Product Statistics
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Fruits */}
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Fruits</Typography>
                          <Typography variant="h4">0</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Vegetables */}
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Vegetables</Typography>
                          <Typography variant="h4">0</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Seeds */}
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Seeds</Typography>
                          <Typography variant="h4">0</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Animal Products */}
                    <Grid item xs={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Animal Products</Typography>
                          <Typography variant="h4">0</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Sales Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Sales Statistics
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Orders</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Complaints</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Most Sold Item</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Most Sold Category</Typography>
                      <Typography variant="h4">0</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {usersClicked && (
            <TableContainer
              component={Paper}
              sx={{ width: "100%", margin: "0 auto" }}
            >
              <Table sx={{ minWidth: 650, backgroundColor: "white" }}>
                <TableHead sx={{ backgroundColor: "#98BC74" }}>
                  <TableRow>
                    <TableCell align="center">User ID</TableCell>
                    <TableCell align="center">First Name</TableCell>
                    <TableCell align="center">Last Name</TableCell>
                    <TableCell align="center">Mobile Number</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">User Type</TableCell>
                    <TableCell align="center">Delete User</TableCell>
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
                      <TableCell align="center">
                        <DeleteForeverIcon
                          sx={{ cursor: "pointer", color: "red" }}
                          onClick={() => {
                            // Handle delete user logic
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {complaintsClicked && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#98BC74" }}>
                  <TableRow>
                    <TableCell align="center">Complaint ID</TableCell>
                    <TableCell align="center">Order ID</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Seller ID</TableCell>
                    <TableCell align="center">Rider ID</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.complaint_id}>
                      <TableCell align="center">
                        {complaint.complaint_id}
                      </TableCell>
                      <TableCell align="center">{complaint.order_id}</TableCell>
                      <TableCell align="center">
                        {complaint.description}
                      </TableCell>
                      <TableCell align="center">
                        {complaint.seller_id}
                      </TableCell>
                      <TableCell align="center">{complaint.rider_id}</TableCell>
                      <TableCell align="center">
                        {complaint.complaint_status_seller}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin_Page;
