import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get('/orders/all');
            setOrders(data);
            setLoading(false);
        } catch (err) {
            alert("Error loading orders");
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await API.put(`/orders/${id}/status`, { status: newStatus });
            alert("Status updated!");
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>All Customer Orders</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o._id}>
                            <td>{o.user?.name}</td>
                            <td>#{o._id.substring(18)}</td>
                            <td>₹{o.totalAmount}</td>
                            <td>{o.fulfillmentType}</td>
                            <td>
                                <select 
                                    value={o.status} 
                                    onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                                    disabled={o.status === 'COMPLETED' || o.status === 'CANCELLED'}
                                >
                                    <option value="PLACED">PLACED</option>
                                    <option value="PREPARING">PREPARING</option>
                                    <option value="READY">READY</option>
                                    {o.fulfillmentType === 'DELIVERY' && <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>}
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED" disabled>CANCELLED</option>
                                </select>
                            </td>
                            <td>
                                <Link to={`/orders/${o._id}`} className="btn-edit">Details</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;