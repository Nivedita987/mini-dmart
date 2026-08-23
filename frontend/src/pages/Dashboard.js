import React from 'react';

const Dashboard = ({ user }) => {
    const renderWelcomeMessage = () => {
        switch(user.role) {
            case 'ADMIN': return "Welcome to the admin dashboard.";
            case 'MANAGER': return "Welcome to the manager dashboard.";
            case 'STAFF': return "Welcome to the staff dashboard.";
            default: return "Welcome to your customer dashboard.";
        }
    };

    return (
        <div className="dashboard-card">
            <h2>{renderWelcomeMessage()}</h2>
            <hr />
            <div className="profile-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> <span className="role-badge">{user.role}</span></p>
            </div>
        </div>
    );
};

export default Dashboard;