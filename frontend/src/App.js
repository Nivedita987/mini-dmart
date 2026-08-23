import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Auth
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Phase 2 - Catalog & Management
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ManageProducts from './pages/ManageProducts';
import ManageCategories from './pages/ManageCategories';
import Users from './pages/Users';
import StaffDashboard from './pages/StaffDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

// Phase 3 - Shopping & Orders
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ManageOrders from './pages/ManageOrders';

import ReturnRequest from './pages/ReturnRequest';
import MyReturns from './pages/MyReturns'; 
import ManageReturns from './pages/ManageReturns';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <Navbar user={user} setUser={setUser} />
            <main className="container">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/products" element={<Products user={user} />} />
                    <Route path="/products/:id" element={<ProductDetails user={user} />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/products" />} />
                    <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/products" />} />
                    
                    {/* Customer Protected Routes (Phase 3) */}
                    <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
                    <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
                    <Route path="/my-orders" element={user ? <MyOrders /> : <Navigate to="/login" />} />
                    <Route path="/orders/:id" element={user ? <OrderDetails user={user} /> : <Navigate to="/login" />} />
                    
                    {/* Manager/Admin Protected Routes */}
                    <Route path="/manage-products" element={user && (user.role === 'ADMIN' || user.role === 'MANAGER') ? <ManageProducts user={user} /> : <Navigate to="/" />} />
                    <Route path="/manage-categories" element={user && (user.role === 'ADMIN' || user.role === 'MANAGER') ? <ManageCategories /> : <Navigate to="/" />} />
                    <Route path="/manage-orders" element={user && (user.role !== 'CUSTOMER') ? <ManageOrders /> : <Navigate to="/" />} />
                    <Route path="/users" element={user?.role === 'ADMIN' ? <Users user={user} /> : <Navigate to="/" />} />
                    {/* <Route path="/users" element={user && user.role === 'ADMIN' ? <Users /> : <Navigate to="/" />} /> */}
                    <Route path="/staff/dashboard" element={user?.role === 'STAFF' ? <StaffDashboard /> : <Navigate to="/" />} />
                    <Route path="/manager/dashboard" element={user?.role === 'MANAGER' ? <ManagerDashboard /> : <Navigate to="/" />} />
                    <Route path="/admin/orders" element={user?.role !== 'CUSTOMER' ? <ManageOrders /> : <Navigate to="/" />} />
                    {/* Profile */}
                    <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                    <Route path="/returns" element={<ReturnRequest />} />
                    <Route path="/my-returns" element={<MyReturns />} />
                    <Route path="/manage-returns" element={user && user.role !== 'CUSTOMER' ? <ManageReturns /> : <Navigate to="/" />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;