import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navigation_Bar from './Components/Navigation_Bar';
import Layout from './Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation_Bar />} />
        <Route path='/ItemsList/:id' element={<Layout/>}/>
        <Route path='/Tracking' element = {<Home/>}/>
      </Routes>
    </Router>
  );
};

export default App;
