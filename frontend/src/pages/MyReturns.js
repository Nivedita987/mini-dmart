import React, { useState, useEffect } from 'react';
import API from '../services/api';

const MyReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyReturns = async () => {
            try {
                const { data } = await API.get('/returns/my');
                setReturns(data);
            } catch (err) {
                console.error("Error fetching returns", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReturns();
    }, []);

    if (loading) return <div className="container">Loading your requests...</div>;

    return (
        <div className="container">
            <h1>My Return & Exchange Requests</h1>
            {returns.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.map(r => (
                            <tr key={r._id}>
                                <td>#{r.order?._id?.substring(18)}</td>
                                <td>{r.product?.name}</td>
                                <td>{r.type}</td>
                                <td><span className={`role-badge`}>{r.status}</span></td>
                                <td>{r.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyReturns;