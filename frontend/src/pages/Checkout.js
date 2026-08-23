import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [fulfillmentType, setFulfillmentType] = useState('DELIVERY');
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                fulfillmentType, 
                shippingAddress: fulfillmentType === 'DELIVERY' ? address : null
            };

            await API.post('/orders', orderData);
            alert("Order placed successfully!");
            navigate('/my-orders');
        } catch (err) {
            alert(err.response?.data?.message || "Checkout failed");
        }
    };

    return (
        <div className="container">
            <h1>Checkout</h1>
            <div className="checkout-form">
                <label>Fulfillment Method:</label>
                <select 
                    value={fulfillmentType} 
                    onChange={(e) => setFulfillmentType(e.target.value)}
                    className="form-control"
                >
                    <option value="DELIVERY">Home Delivery</option>
                    <option value="PICKUP">Store Pickup</option>
                </select>

                <form onSubmit={handlePlaceOrder} className="admin-form">
                    {fulfillmentType === 'DELIVERY' && (
                        <div className="address-section">
                            <h3>Delivery Details</h3>
                            <input 
                                type="text" 
                                placeholder="Receiver Full Name" 
                                onChange={(e) => setAddress({...address, fullName: e.target.value})}
                                required 
                            />
                            <input 
                                type="text" 
                                placeholder="Phone Number" 
                                onChange={(e) => setAddress({...address, phone: e.target.value})}
                                required 
                            />
                            <textarea 
                                placeholder="Full Delivery Address" 
                                onChange={(e) => setAddress({...address, address: e.target.value})}
                                required
                            />
                        </div>
                    )}

                    {fulfillmentType === 'PICKUP' && (
                        <div className="info-box">
                            <p>You have selected Store Pickup. Please visit the store with your Order ID once the status is "READY".</p>
                        </div>
                    )}

                    <button type="submit" className="btn-submit">Place Order</button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;