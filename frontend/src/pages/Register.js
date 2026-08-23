import React, { useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

        try {
            const { data } = await API.post('/auth/register', { 
                name: formData.name, email: formData.email, password: formData.password 
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-card">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={submitHandler}>
                <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <input type="password" placeholder="Confirm Password" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                <button type="submit">Create Account</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default Register;