import React from "react";
import Navigation_Bar_Seller from "../Components/Navigation_Bar_Seller";
import View_Complaints from "../Components/View_Complaints";
import View_Orders from "../Components/View_Orders";
import View_Deliveries from "../Components/View_Deliveries";
import View_Orders_Rider from "../Components/View_Orders_Rider";
export default function Delivery_Rider_Dashboard() {
  return (
    <div>
      <Navigation_Bar_Seller />
      <div style={styles.dashboard}>
        <div style={styles.row}>
          <View_Orders_Rider />
          <View_Deliveries />
        </div>
        <div style={styles.row}></div>
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
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
};
