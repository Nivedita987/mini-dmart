import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ManageReturns = () => {
    const [requests, setRequests] = useState([]);

    const fetchReturns = async () => {
        const { data } = await API.get('/returns/all');
        setRequests(data);
    };

    useEffect(() => { fetchReturns(); }, []);

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/returns/${id}/status`, { status });
            alert("Status Updated");
            fetchReturns();
        } catch (err) { alert(err.response.data.message); }
    };

    return (
        <div className="container">
            <h1>Manage Returns & Exchanges</h1>
            <table className="admin-table">
                <thead>
                    <tr><th>User</th><th>Type</th><th>Product</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                    {requests.map(r => (
                        <tr key={r._id}>
                            <td>{r.user?.name}</td>
                            <td>{r.type}</td>
                            <td>{r.product?.name}</td>
                            <td><span className={`badge-${r.status}`}>{r.status}</span></td>
                            <td>
                                <select onChange={(e) => updateStatus(r._id, e.target.value)} value={r.status}>
                                    <option value="REQUESTED">REQUESTED</option>
                                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageReturns;