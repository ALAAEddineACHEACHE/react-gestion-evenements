// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../components/styles/dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome to Gestion Evenement</h1>
                <p>Manage all your events in one place</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>12</h3>
                    <p>Upcoming Events</p>
                </div>
                <div className="stat-card">
                    <h3>45</h3>
                    <p>Total Attendees</p>
                </div>
                <div className="stat-card">
                    <h3>5</h3>
                    <p>Event Categories</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <Link to="/events" className="action-card">
                    <div className="action-icon">📅</div>
                    <h3>View All Events</h3>
                    <p>Browse and manage all your events</p>
                </Link>

                <div className="action-card">
                    <div className="action-icon">➕</div>
                    <h3>Create Event</h3>
                    <p>Start planning a new event</p>
                </div>

                <div className="action-card">
                    <div className="action-icon">📊</div>
                    <h3>Analytics</h3>
                    <p>View event statistics and reports</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;