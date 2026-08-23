import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ReturnRequest = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    const productId = queryParams.get('productId');

    const [type, setType] = useState('RETURN');
    const [reason, setReason] = useState('');
    const [products, setProducts] = useState([]);
    const [replacementId, setReplacementId] = useState('');

    useEffect(() => {
        if (type === 'EXCHANGE') {
            API.get('/products').then(res => setProducts(res.data));
        }
    }, [type]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await API.post('/returns', { 
            orderId, 
            productId, 
            type, 
            reason, 
            replacementProductId: replacementId 
        });
        alert("Request submitted successfully!");
        navigate('/my-returns');
    } catch (err) {
        const message = err.response?.data?.message || "Submission failed";
        alert(message); 
    }
};

    return (
        <div className="container">
            <h1>Request Return/Exchange</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <label>Request Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="RETURN">Return (Refund)</option>
                    <option value="EXCHANGE">Exchange (Replacement)</option>
                </select>

                <label>Reason</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you returning this?" required />

                {type === 'EXCHANGE' && (
                    <>
                        <label>Select Replacement Product</label>
                        <select onChange={(e) => setReplacementId(e.target.value)} required>
                            <option value="">-- Select Product --</option>
                            {products.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>)}
                        </select>
                    </>
                )}
                <button type="submit" className="btn">Submit Request</button>
            </form>
        </div>
    );
};

export default ReturnRequest;