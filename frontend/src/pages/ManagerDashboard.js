import React from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => (
    <div className="container">
        <h1>Manager Dashboard</h1>
        <div className="dashboard-grid">
            <div className="dashboard-card">
                <h3>Inventory Management</h3>
                <Link to="/manage-products" className="btn">Manage Stock</Link>
                <Link to="/manage-categories" className="btn btn-outline">Categories</Link>
            </div>
            <div className="dashboard-card">
                <h3>Sales Performance</h3>
                <Link to="/admin/orders" className="btn">View All Orders</Link>
            </div>
        </div>
    </div>
);

export default ManagerDashboard;