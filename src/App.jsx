import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sign_Up from './Pages/Sign_Up_Buyer';
import Sign_In from './Pages/Sign_In';
import Navigation_Bar from './Components/Navigation_Bar';
import Side_Drawer from './Components/Side_Drawer';
import Success from './Pages/Success';
import Layout from './Layout';
import Items from './Components/Items';
import User_Profile from './Pages/User_Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/Sign_Up" element={<Sign_Up />} />
        <Route path="/Sign_In" element={<Sign_In />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/ItemsList/:id" element={<Layout />} />
        <Route path="/user/:id" element={<User_Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
