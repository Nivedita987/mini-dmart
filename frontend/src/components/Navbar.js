import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Mini D-Mart</Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user && <Link to="/products">Browse Catalog</Link>}

                {/* ADMIN & MANAGER LINKS - This is what you are missing */}
                {user && (user.role === 'ADMIN' || user.role === 'MANAGER') && (
                    <>
                        <Link to="/manage-categories" style={{ color: '#e91e63', fontWeight: 'bold' }}>Categories</Link>
                        <Link to="/manage-products" style={{ color: '#e91e63', fontWeight: 'bold' }}>Inventory</Link>
                        <Link to="/admin/orders">Manage Orders</Link>
                    </>
                )}

                {/* ADMIN ONLY */}
                {user && user.role === 'ADMIN' && (
                    <Link to="/users">Users</Link>
                )}

                {/* CUSTOMER ONLY */}
                {user && user.role === 'CUSTOMER' && (
                    <>
                        <Link to="/cart">Cart</Link>
                        <Link to="/my-orders">My Orders</Link>
                        <Link to="/my-returns">My Returns</Link>
                    </>
                )}

                {user ? (
                    <>
                        <Link to="/dashboard">Profile</Link>
                        <button onClick={logoutHandler} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;