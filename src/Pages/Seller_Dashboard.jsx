import React from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import View_Complaints from "../Components/View_Complaints";
import View_Orders from "../Components/View_Orders";
import Post_Item from "../Components/Post_Item";
import View_Reports from "../Components/View_Reports";
import View_Inventory from "../Components/View_Inventory";
import View_Processing_Orders from "../Components/View_Processing_Orders";
export default function Seller_Dashboard() {
  return (
    <div>
      <Navigation_Bar_Seller />
      <div style={styles.dashboard}>
        <div style={styles.row}>
          <View_Complaints />
          <View_Orders />
          <View_Inventory />
        </div>
        <div style={styles.row}>
          <Post_Item />
          <View_Reports />
          <View_Processing_Orders />
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignComplaints: "center",
    padding: "20px",
    gap: "20px",
    backgroundColor: "#E6F4EA",
    width: "100%",
    height: "200%",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
};
