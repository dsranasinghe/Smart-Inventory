import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Home from './pages/home';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import SupplierProfile from './pages/SupplierProfile';
import InventoryAdd from './pages/InventoryForm';
import UserProfile from './components/userProfile';
import Inventory from './pages/InventoryManager';
import OrderManager from './pages/OrderManager'; 
import NewOrder from './pages/NewOrderForm';
import Payment from './pages/Payment'; 
import CheckoutPage from "./pages/PaymentCheckout"; 
import SupplierList from './pages/SupplierList';



function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} /> 
       <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/inventoryadd" element={<InventoryAdd />} />
        <Route path="/users " element={<UserProfile />} />  {/*change it when you add more users  /:userId */}
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="" element={<SupplierProfile />} /> {/*change it when you add more users  */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<OrderManager/>} />
        <Route path="/orders/new" element={<NewOrder />} /> 
        <Route path="/payment" element={<Payment />} /> 
        <Route path="/payment/checkout" element={<CheckoutPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;