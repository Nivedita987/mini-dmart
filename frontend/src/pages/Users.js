import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Users = ({ user: currentUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/users');
            setUsers(data);
            setLoading(false);
        } catch (err) {
            alert("Failed to fetch users");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await API.put(`/users/${userId}/role`, { role: newRole });
            alert("User role updated!");
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Error updating role");
        }
    };

    if (loading) return <div className="container">Loading Users...</div>;

    return (
        <div className="container">
            <h1>User & Role Management</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Current Role</th>
                        <th>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td><span className="role-badge">{u.role}</span></td>
                            <td>
                                <select 
                                    value={u.role} 
                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                    disabled={u._id === currentUser._id} // Cannot change self
                                >
                                    <option value="CUSTOMER">CUSTOMER</option>
                                    <option value="STAFF">STAFF</option>
                                    <option value="MANAGER">MANAGER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;