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
    <Router>
      <Routes>
        <Route path="/Sign_in" element={<Sign_In />} />
        <Route path="/Sign_Up_Buyer" element={<Sign_Up_Buyer />} />
        <Route path="/Sign_Up_Seller" element={<Sign_Up_Seller />} />
        <Route path="/" element={<Navigation_Bar />} />
        <Route path="/Home" element={<Layout />} />
        <Route
          path="/Home/:id"
          element={<PrivateRoute element={<Layout />} />}
        />
        <Route path="Home/:id/Tracking/:id" element={<Tracking />} />
        <Route path="/Success" element={<Success />} />
        <Route
          path="/Profile/:id"
          element={<PrivateRoute element={<User_Profile user={user} />} />}
        />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/seller_dashboard/:id" element={<Seller_Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
