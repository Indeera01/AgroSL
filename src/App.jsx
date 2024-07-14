import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navigation_Bar from './Components/Navigation_Bar';
import Layout from './Layout';
import Sign_In from './Pages/Sign_In'
import Sign_Up_Buyer from './Pages/Sign_Up_Buyer'
import Sign_Up_Seller from './Pages/Sign_Up_Seller'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/Sign_in' element={<Sign_In/>}/>
        <Route path='/Sign_Up_Buyer' element={<Sign_Up_Buyer/>}/>
        <Route path='/Sign_Up_Seller' element={<Sign_Up_Seller/>}/>
        <Route path="/" element={<Navigation_Bar />} />
        <Route path='/ItemsList/:id' element={<Layout/>}/>
        <Route path='/Tracking' element = {<Home/>}/>
      </Routes>
    </Router>
  );
};

export default App;
