import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = useCallback(async () => {
        try {
            const { data } = await API.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            alert(err.response?.data?.message || "Error loading order");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    
    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            const { data } = await API.delete(`/orders/${id}`);
            alert(data.message);
            fetchOrder(); 
        } catch (err) {
            alert(err.response?.data?.message || "Cancellation failed");
        }
    };

    if (loading) return <div className="container">Loading order...</div>;
    if (!order) return <div className="container">Order not found</div>;

    return (
        <div className="container">
            <Link to="/my-orders">← Back to My Orders</Link>
            
            <div className="order-card" style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Order #{order._id.substring(0, 8)}</h1>
                    
                        {order.status === 'PLACED' && (
                            <button
                                onClick={handleCancel}
                                className="btn-cancel-order"
                            >
                                 Cancel Order
                            </button>
                        )}
                </div>

                <p><strong>Status:</strong> <span className={`badge-${order.status}`}>{order.status}</span></p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <hr />
                
                <h3>Items:</h3>
                {order.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.subtotal}</span>
                         {order.status === 'COMPLETED' && (
                    <Link 
                        to={`/returns?orderId=${order._id}&productId=${item.product}`} 
                        className="btn-edit" 
                        style={{ fontSize: '0.8rem', padding: '5px' }}
                    >
                        Request Return/Exchange
                    </Link>
                )}
                    </div>
                ))}
                <hr />
                <h2 style={{ textAlign: 'right' }}>Total: ₹{order.totalAmount}</h2>
            </div>
        </div>
    );
};

export default OrderDetails;