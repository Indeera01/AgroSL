import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const Admin_Page = () => {
  const [users, setUsers] = useState([]);
  const [sellersChecked, setSellersChecked] = useState(false);
  const [buyersChecked, setBuyersChecked] = useState(false);
  const [ridersChecked, setRidersChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [usersClicked, setUsersClicked] = useState(false);

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
    }
  };

  return (
    <Box>
      <Grid
        container
        spacing={2} // Adjust spacing between items as needed
        direction="row"
        margin={3}
      >
        <Box>
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
          <Button onClick={handleSearch}>Search</Button>
        </Box>
        <Box>
          <Button>Show Complaints</Button>
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
    </Box>
  );
};

export default Admin_Page;
