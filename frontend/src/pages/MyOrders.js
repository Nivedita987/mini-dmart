import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/my-orders');
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="container">Loading your orders...</div>;

    return (
        <div className="container">
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <div className="center-content">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/products" className="btn">Start Shopping</Link>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id.substring(0, 8)}...</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>₹{order.totalAmount}</td>
                                <td><span className="role-badge">{order.status}</span></td>
                                <td>
                                    <Link to={`/orders/${order._id}`} className="btn-edit">View Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyOrders;