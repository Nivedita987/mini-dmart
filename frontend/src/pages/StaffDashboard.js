import React from 'react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => (
    <div className="container">
        <h1>Staff Dashboard</h1>
        <div className="dashboard-grid">
            {/* Section 1: Orders */}
            <div className="dashboard-card">
                <h3>Order Fulfillment</h3>
                <p>Process new customer orders and manage delivery status.</p>
                <Link to="/admin/orders" className="btn">Manage Orders</Link>
            </div>

            {/* Section 2: Returns (FIXED LINK) */}
            <div className="dashboard-card">
                <h3>Returns & Exchanges</h3>
                <p>View and process product return requests.</p>
                {/* Changed from button to Link */}
                <Link to="/manage-returns" className="btn">Manage Returns</Link>
            </div>
        </div>
    </div>
);

export default StaffDashboard;