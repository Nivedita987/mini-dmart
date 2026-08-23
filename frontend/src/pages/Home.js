import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
    return (
        <div className="center-content">
            <h1>Welcome to Mini D-Mart</h1>
            <p>Your simple online grocery store.</p>
            {user ? (
                <Link to="/dashboard" className="btn">Go to Dashboard</Link>
            ) : (
                <div className="auth-buttons">
                    <Link to="/login" className="btn">Login</Link>
                    <Link to="/register" className="btn btn-outline">Register</Link>
                </div>
            )}
        </div>
    );
};

export default Home;