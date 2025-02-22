import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Home from './pages/home';
import AdminDashboard from './pages/AdminDashboard';
import Inventory from './pages/Inventory';
import UserProfile from './components/userProfile';


function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} /> 
       <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/users/:userId" element={<UserProfile />} />

      </Routes>
    </Router>
  );
}

export default App;