import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "../firebase";
import Navigation_Bar from "./Components/Navigation_Bar";
import Layout from "./Layout";
import Sign_In from "./Pages/Sign_In";
import Sign_Up_Buyer from "./Pages/Sign_Up_Buyer";
import Sign_Up_Seller from "./Pages/Sign_Up_Seller";
import Success from "./Pages/Success";
import User_Profile from "./Pages/User_Profile";
import Tracking from "./Components/Tracking";
import ShoppingCart from "./Pages/Shopping_Cart";
import Inventory from "./Pages/Inventory";
import Seller_Dashboard from "./Pages/Seller_Dashboard";
import Post_Item from "./Components/Post_Item";
import AddItem from "./Pages/Add_Item";
import Complaints from "./Pages/Complaints";
import Reports_seller from "./Pages/Reports_seller";
import Item_View from "./Components/Item_View";

import Orders from "./Pages/Orders";
import Processing_Orders from "./Pages/Processing_Orders";

import Admin_Page from "./Pages/Admin_Page";
import Sign_Up_Admin from "./Pages/Sign_Up_Admin";
import Sign_Up_Delivery_Rider from "./Pages/Sign_Up_Delivery_Rider";
import Delivery_Rider_Dashboard from "./Pages/Delivery_Rider_Dashboard";
import Rider_Orders from "./Pages/Rider_Orders";
import Deliveries from "./Pages/Deliveries";
import Chat from "./Pages/Chat";
import Chat_Page from "./Pages/Chat_Page";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddProof from "./Pages/AddProof";
import Buyer_Orders from "./Pages/Buyer_Orders";
import ComplaintPage from "./Pages/ComplaintPage";
import Mobile_Checkout from "./Pages/Mobile_Checkout";

const stripePromise = loadStripe(
  "pk_test_51PwNGE05CsRawMoqM7YEL8tcA6xpOuDUJJ1oRSImOq9ndmJxlWHlqvlYLIg7aXlxJCXAQqCHbWAOVakInuTx4ql100M5xx4oan"
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        setIsLoggedIn(true);
        setUser(userAuth);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const PrivateRoute = ({ element, path }) => {
    return isLoggedIn ? element : <Navigate to="/Sign_in" />;
  };

  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route path="/Sign_in" element={<Sign_In />} />
          <Route path="/Sign_Up_Buyer" element={<Sign_Up_Buyer />} />
          <Route path="/Sign_Up_Seller" element={<Sign_Up_Seller />} />
          <Route
            path="/Sign_Up_Delivery_Rider"
            element={<Sign_Up_Delivery_Rider />}
          />
          <Route path="/" element={<Layout />} />
          <Route
            path="/Home/:id"
            element={<PrivateRoute element={<Layout />} />}
          />
          <Route path="Home/Tracking/:orderID" element={<Tracking />} />
          <Route path="/Success" element={<Success />} />
          <Route
            path="/Profile/:id"
            element={<PrivateRoute element={<User_Profile user={user} />} />}
          />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/seller_dashboard/:id" element={<Seller_Dashboard />} />
          <Route
            path="/delivery_rider_dashboard/:riderId"
            element={<Delivery_Rider_Dashboard />}
          />

          <Route path="/seller_dashboard/:sellerId" element={<Post_Item />} />
          <Route path="/add_item/:sellerId" element={<AddItem />} />
          <Route
            path="/sellerdashboard/:seller_id/complaints"
            element={<Complaints />}
          />
          <Route path="/reports_seller" element={<Reports_seller />} />
          <Route path="/item/:id" element={<Item_View />} />

          <Route
            path="/sellerdashboard/:seller_id/orders"
            element={<Orders />}
          />
          <Route
            path="/sellerdashboard/:seller_id/processingorders"
            element={<Processing_Orders />}
          />

          <Route path="/admin" element={<Admin_Page />} />
          <Route path="/admin_signup" element={<Sign_Up_Admin />} />
          <Route
            path="/delivery_rider_dashboard/:riderId/orders"
            element={<Rider_Orders />}
          />

          <Route
            path="/delivery_rider_dashboard/:riderId/deliveries"
            element={<Deliveries />}
          />

          <Route path="/add-proof/:delivery_id" element={<AddProof />} />

          <Route path="/chat" element={<Chat />} />
          <Route path="/chat_page/:userId" element={<Chat_Page />} />
          <Route
            path="/orders_for_buyer/:buyer_id"
            element={<Buyer_Orders />}
          />
          <Route path="/complain" element={<ComplaintPage />} />
          <Route
            path="/mobile_checkout/:user_id"
            element={<Mobile_Checkout />}
          />
        </Routes>
      </Router>
    </Elements>
  );
};

export default App;
