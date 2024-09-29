import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import axios from "axios";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import { Box, Grid, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

const Reports_seller = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [highest, setHighest] = useState(null);
  const [lowest, setLowest] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("month")); // Set to first day of current month
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  useEffect(() => {
    // Fetch logged-in user details from Firebase Authentication
    const currentUser = auth.currentUser;
    console.log(currentUser);
    if (currentUser) {
      axios
        .get(`http://localhost:5001/users/${currentUser.uid}`)
        .then((res) => {
          setUser(res.data);
          console.log("User data:", res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, []);

  const fetchOrders = async () => {
    if (!startDate || !endDate) {
      alert("Please select a date range to generate the report.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5001/seller_orders/${user.user_id}`,
        {
          params: {
            startDate: startDate.format("YYYY-MM-DD"), // Formatting date to send to the backend
            endDate: endDate.format("YYYY-MM-DD"),
          },
        }
      );
      setOrders(response.data);
      setReportGenerated(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setOrders([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = orders.reduce((acc, order) => {
    // Find the index of the item by its name
    const itemIndex = acc.findIndex((item) => item.label === order.item_name);

    if (itemIndex > -1) {
      // If the item is already in the array, add its quantity to the existing value
      acc[itemIndex].value += order.order_quantity;
    } else {
      // If the item is not in the array, add it with the initial quantity
      acc.push({
        id: acc.length,
        label: order.item_name,
        value: order.order_quantity,
        unit_price: order.unit_price,
        item_name: order.item_name,
      });
    }

    return acc;
  }, []);

  const highestSale =
    pieChartData.length > 0
      ? pieChartData.reduce((prev, current) =>
          prev.value > current.value ? prev : current
        )
      : null;

  const lowestSale =
    pieChartData.length > 0
      ? pieChartData.reduce((prev, current) =>
          prev.value < current.value ? prev : current
        )
      : null;

  console.log("reuced: ", { pieChartData });

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "600", color: "black" }}
      >
        View your sales
      </Typography>
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        margin={5}
        backgroundColor=""
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="From"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="To"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </DemoContainer>
        </LocalizationProvider>
        <Button
          variant="contained"
          sx={{
            padding: "12px 24px",
            backgroundColor: "#4B8412",
            margin: "10px",
            color: "black",
          }}
          onClick={() => fetchOrders(user.user_id)}
        >
          Generate Reports
        </Button>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        <Grid sx={{ margin: "20px" }}>
          <Box
            sx={{
              width: "100%",
              margin: "0 auto",
              marginTop: "20px",
              marginBottom: "20px",
              padding: "20px",
              backgroundColor: "#DFF2BF",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h4" component="div">
              Total Sales
            </Typography>
            <PieChart
              series={[
                {
                  data: pieChartData,
                },
              ]}
              width={400}
              height={200}
            />
            <Box sx={{ margin: "10px" }}>
              <Typography variant="h5" component="div">
                Highest sales:{" "}
                {highestSale
                  ? `${highestSale.item_name} (${highestSale.value} units)`
                  : "N/A"}
              </Typography>
              <Typography variant="h5" component="div">
                Lowest sales:{" "}
                {lowestSale
                  ? `${lowestSale.item_name} (${lowestSale.value} units)`
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
          <Box>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650, backgroundColor: "#DFF2BF" }}
                aria-label="simple table"
              >
                <TableHead sx={{ backgroundColor: "#4B8412" }}>
                  <TableRow>
                    <TableCell align="center">Item Name</TableCell>
                    <TableCell align="center">Unit Price</TableCell>
                    <TableCell align="center">Total Units Sold</TableCell>
                    <TableCell align="center">Total Sale(LKR)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pieChartData.map((item) => (
                    <TableRow
                      key={item.item_name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{item.item_name}</TableCell>
                      <TableCell align="center">{item.unit_price}</TableCell>
                      <TableCell align="center">{item.value}</TableCell>
                      <TableCell align="center">
                        {item.value * item.unit_price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Reports_seller;
