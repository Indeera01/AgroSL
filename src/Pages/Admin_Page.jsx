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
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Logo from "../assets/AgroSL.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../../firebase";
import { BarChart } from "@mui/x-charts/BarChart";

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

  const [userCounts, setUserCounts] = useState({
    sellerCount: 0,
    buyerCount: 0,
    deliveryRiderCount: 0,
    adminCount: 0,
  });

  const [itemCounts, setItemCounts] = useState({
    fruitCount: 0,
    vegetableCount: 0,
    animalProductCount: 0,
    seedCount: 0,
  });

  const [salesStats, setSalesStats] = useState({
    orderCount: 0,
    complaintCount: 0,
    mostSoldItem: "",
    mostSoldCategory: "",
  });

  useEffect(() => {
    axios
      .get(`https://backend-rho-three-58.vercel.app/user_counts`)
      .then((res) => {
        console.log(res.data);
        setUserCounts({
          sellerCount: res.data.sellerCount,
          buyerCount: res.data.buyerCount,
          deliveryRiderCount: res.data.deliveryRiderCount,
          adminCount: res.data.adminCount,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://backend-rho-three-58.vercel.app/item_counts`)
      .then((res) => {
        console.log(res.data);
        setItemCounts({
          fruitCount: res.data.fruitCount,
          vegetableCount: res.data.vegetableCount,
          animalProductCount: res.data.animalProductCount,
          seedCount: res.data.seedCount,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://backend-rho-three-58.vercel.app/sales_stats`)
      .then((res) => {
        console.log(res.data);
        setSalesStats({
          orderCount: res.data.orderCount,
          complaintCount: res.data.complaintCount,
          mostSoldItem: res.data.mostSoldItem,
          mostSoldCategory: res.data.mostSoldCategory,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

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
        .get("https://backend-rho-three-58.vercel.app/users_by_type", {
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
      .get("https://backend-rho-three-58.vercel.app/all_complaints_for_admins")
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
              // backgroundColor: "#98BC74",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "10px",
              minHeight: "100vh",
            }}
          >
            <Box
              sx={{
                display: "flex", // Enable flexbox
                justifyContent: "center", // Center horizontally
                marginBottom: 2, // Optional: Add some spacing below the logo
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="AgroSL Logo"
                sx={{
                  height: 90,
                }}
              />
            </Box>
            <Typography variant="h3" color={"#4B8412"} gutterBottom>
              Admin Panel
            </Typography>

            <Box
              sx={{
                padding: "20px",
                border: "2px solid #4B8412",
                borderRadius: "10px",
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
            </Box>

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
            <Box marginTop={2}>
              <Button
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#4B8412",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#3A6B0F",
                  },
                }}
              >
                <LogoutIcon />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right-side Box (60% width) */}
        <Grid item xs={12} md={9}>
          {statsClicked && (
            <Box
              sx={{
                padding: "20px",
                backgroundColor: "white",
                minHeight: "100vh",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h4" color={"#4B8412"} gutterBottom>
                Platform Statistics
              </Typography>
              <Grid container spacing={2}>
                {/* User Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color={"#4B8412"}>
                    User Statistics
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Sellers</Typography>
                      <Typography variant="h4">
                        {userCounts.sellerCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Buyers</Typography>
                      <Typography variant="h4">
                        {userCounts.buyerCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Riders</Typography>
                      <Typography variant="h4">
                        {userCounts.deliveryRiderCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Admins</Typography>
                      <Typography variant="h4">
                        {userCounts.adminCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Product Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color={"#4B8412"}>
                    Product Statistics
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Fruits */}
                    <Grid item xs={6} md={3}>
                      <Card sx={{ backgroundColor: "#e6ffe6" }}>
                        <CardContent>
                          <Typography variant="h6">Fruits</Typography>
                          <Typography variant="h4">
                            {itemCounts.fruitCount}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Vegetables */}
                    <Grid item xs={6} md={3}>
                      <Card sx={{ backgroundColor: "#e6ffe6" }}>
                        <CardContent>
                          <Typography variant="h6">Vegetables</Typography>
                          <Typography variant="h4">
                            {itemCounts.vegetableCount}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Seeds */}
                    <Grid item xs={6} md={3}>
                      <Card sx={{ backgroundColor: "#e6ffe6" }}>
                        <CardContent>
                          <Typography variant="h6">Seeds</Typography>
                          <Typography variant="h4">
                            {itemCounts.seedCount}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Animal Products */}
                    <Grid item xs={6} md={3}>
                      <Card sx={{ backgroundColor: "#e6ffe6" }}>
                        <CardContent>
                          <Typography variant="h6">Animal Products</Typography>
                          <Typography variant="h4">
                            {itemCounts.animalProductCount}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <BarChart
                    xAxis={[
                      {
                        data: [
                          "Fruits",
                          "Vegetables",
                          "Seeds",
                          "Animal Products",
                        ],
                        scaleType: "band", // Set the scaleType to 'band'
                      },
                    ]}
                    series={[
                      {
                        data: [
                          itemCounts.fruitCount,
                          itemCounts.vegetableCount,
                          itemCounts.seedCount,
                          itemCounts.animalProductCount,
                        ],
                        color: "#4caf50", // Set the bar color
                      },
                    ]}
                    width={500}
                    height={400}
                    barGap={10} // Adjust the gap between bars
                    barCategoryGap="30%" // Control the category gap (space between groups of bars)
                  />
                </Grid>

                {/* Sales Statistics */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color={"#4B8412"}>
                    Sales Statistics
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Orders</Typography>
                      <Typography variant="h4">
                        {salesStats.orderCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Complaints</Typography>
                      <Typography variant="h4">
                        {salesStats.complaintCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Most Sold Item</Typography>
                      <Typography variant="h5">
                        {salesStats.mostSoldItem}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{ backgroundColor: "#e6ffe6" }}>
                    <CardContent>
                      <Typography variant="h6">Most Sold Category</Typography>
                      <Typography variant="h5">
                        {salesStats.mostSoldCategory}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {usersClicked && (
            <Box
              sx={{
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            >
              <Typography variant="h4" color={"#4B8412"} gutterBottom>
                User Details
              </Typography>
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
                      {/* <TableCell align="center">Delete User</TableCell> */}
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
                        <TableCell align="center">
                          {user.mobile_number}
                        </TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">{user.user_type}</TableCell>
                        {/* <TableCell align="center">
                          <DeleteForeverIcon
                            sx={{ cursor: "pointer", color: "red" }}
                            onClick={() => {
                              // Handle delete user logic
                            }}
                          />
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {complaintsClicked && (
            <Box
              sx={{
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            >
              <Typography variant="h4" color={"#4B8412"} gutterBottom>
                Complaints
              </Typography>
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
                        <TableCell align="center">
                          {complaint.order_id}
                        </TableCell>
                        <TableCell align="center">
                          {complaint.description}
                        </TableCell>
                        <TableCell align="center">
                          {complaint.seller_id}
                        </TableCell>
                        <TableCell align="center">
                          {complaint.rider_id}
                        </TableCell>
                        <TableCell align="center">
                          {complaint.complaint_status_seller}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Admin_Page;
