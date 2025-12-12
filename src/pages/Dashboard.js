import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

import { getTicketsAvailable, isSoldOut } from '../components/utils/eventUtils';
import { deleteEvent } from '../components/services/eventService';
import { getEvents } from "../components/services/eventService";

import '../components/styles/dashboard.css';
import axios from "axios";


const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5); // nb d'utilisateurs par page

    useEffect(() => {
        // Total users
        axios.get("http://localhost:8080/api/auth/count")
            .then(res => setUserCount(res.data))
            .catch(err => console.error(err));

        // Fetch paginated users
        fetchUsers(page, size);
    }, [page]);
    const fetchUsers = (page, size) => {
        axios.get(`http://localhost:8080/api/auth/users?page=${page}&size=${size}`)
            .then(res => setUsers(res.data.content))
            .catch(err => console.error(err));
    };

// totalUsers pour le stats card
    const totalUsers = userCount;

    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await getEvents(token);

            const data = response.data;

            // Your backend returns an array directly → set it
            setEvents(Array.isArray(data) ? data : data.content || []);
        } catch (error) {
            console.error("Error loading events:", error);
            setEvents([]);
        }
    };


    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        await deleteEvent(id, token);
        fetchEvents();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // --------------------------
    // Your static dashboard charts
    // --------------------------

    const revenueData = [
        { month: 'Jan', revenue: 4000, tickets: 240 },
        { month: 'Feb', revenue: 3000, tickets: 139 },
        { month: 'Mar', revenue: 2000, tickets: 980 },
        { month: 'Apr', revenue: 2780, tickets: 390 },
        { month: 'May', revenue: 1890, tickets: 480 },
        { month: 'Jun', revenue: 2390, tickets: 380 },
        { month: 'Jul', revenue: 3490, tickets: 430 },
    ];

    const categoryData = [
        { name: 'Music', value: 400, color: '#8884d8' },
        { name: 'Sports', value: 300, color: '#82ca9d' },
        { name: 'Business', value: 300, color: '#ffc658' },
        { name: 'Tech', value: 200, color: '#0088FE' },
        { name: 'Art', value: 200, color: '#FF8042' },
    ];
    // Safe guards to avoid crashes if events or user data is missing
    const totalEvents = Array.isArray(events) ? events.length : 0;

// Derived metrics
    const totalAttendees = Array.isArray(events)
        ? events.reduce((sum, e) => sum + (Number(e.ticketsSold) || 0), 0)
        : 0;

    const totalRevenue = Array.isArray(events)
        ? events.reduce((sum, e) =>
                sum + (Number(e.ticketsSold) || 0) * (Number(e.ticketPrice) || 0)
            , 0)
        : 0;

    const avgTicketPrice = totalEvents > 0
        ? events.reduce((sum, e) => sum + (Number(e.ticketPrice) || 0), 0) / totalEvents
        : 0;

    const statsCards = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            icon: '💰',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            detail: 'Calculated from ticket sales'
        },
        {
            title: 'Total Events',
            value: `${totalEvents}`,
            change: '+8.2%',
            icon: '📅',
            color: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            detail: `Active: ${totalEvents}`
        },
        {
            title: 'Total Users',
            value: `${totalUsers}`,
            change: '+15.3%',
            icon: '👥',
            color: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
            detail: 'Registered users'
        },
        {
            title: 'Avg. Ticket Price',
            value: `$${avgTicketPrice.toFixed(2)}`,
            change: '+5.2%',
            icon: '💵',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            detail: 'Across all events'
        },
    ];



    const quickActions = [
        { icon: '✏️', label: 'Create Event', color: '#667eea', link: '/create-event' },
        { icon: '📅', label: 'View Calendar', color: '#4ecdc4', link: '/events' },
        { icon: '👥', label: 'Manage Users', color: '#ff6b6b', link: '#' },
        { icon: '📊', label: 'View Reports', color: '#ffd166', link: '#' },
        { icon: '👁️', label: 'Audit Log', color: '#06d6a0', link: '#' },
        { icon: '📈', label: 'Analytics', color: '#118ab2', link: '#' },
    ];

    const notifications = [
        { id: 1, type: 'success', message: 'New event created successfully', time: '2 mins ago' },
        { id: 2, type: 'warning', message: 'Event is nearly sold out', time: '1 hour ago' },
        { id: 3, type: 'info', message: 'New user registered', time: '3 hours ago' },
        { id: 4, type: 'success', message: 'Payment of $2,500 received', time: '5 hours ago' },
    ];

    return (
        <div className="admin-dashboard">

            {/* HEADER */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1><span className="header-icon">📊</span> Dashboard Overview</h1>
                    <p className="header-subtitle">
                        Welcome back! Here's what's happening with your events today.
                    </p>
                </div>


            </div>

            {/* STATS */}
            <div className="stats-grid">
                {statsCards.map((stat, idx) => (
                    <div className="stat-card" key={idx}>
                        <div className="stat-icon" style={{ background: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p className="stat-title">{stat.title}</p>
                            <div className="stat-details">
                                <span className="stat-change">{stat.change}</span>
                                <span className="stat-detail">{stat.detail}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN LAYOUT */}
            <div className="dashboard-main">

                {/* LEFT SIDE */}
                <div className="dashboard-left">

                    {/* CHART */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>📈 Revenue Overview</h3>
                        </div>

                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#667eea" fill="#667eea33" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* EVENTS TABLE USING REAL DATA */}
                    <div className="table-card">
                        <div className="table-header">
                            <h3>📅 Latest Events</h3>
                            <Link to="/events" className="view-all">View All →</Link>
                        </div>

                        <table className="events-table">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Tickets Left</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.title}</td>

                                    <td>{getTicketsAvailable(event)}</td>

                                    <td>
                                        {isSoldOut(event) ? (
                                            <span className="status-badge soldout">Sold Out</span>
                                        ) : (
                                            <span className="status-badge available">Available</span>
                                        )}
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            {/*<Link to={`/events/${event.id}/edit`} className="action-btn edit">*/}
                                            {/*    ✏️*/}
                                            {/*</Link>*/}

                                            <button className="action-btn delete" onClick={() => handleDelete(event.id)}>
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="dashboard-right">

                    {/* CATEGORY PIE CHART */}
                    <div className="pie-card">
                        <h3>📊 Event Categories</h3>

                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={categoryData} dataKey="value" label outerRadius={75}>
                                    {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="notifications-card">
                        <h3>🔔 Notifications</h3>
                        {notifications.map((n) => (
                            <div key={n.id} className={`notification-item ${n.type}`}>
                                {n.message} – {n.time}
                            </div>
                        ))}
                    </div>

                </div>
                <div className="users-table-container">
                    <h3>👥 User Management</h3>

                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="user-details">
                                            <div className="user-name">{user.username || 'User'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((role, idx) => (
                                            <span key={idx} className={`role-badge ${role.toLowerCase()}`}>
                        {role.replace('ROLE_', '')}
                    </span>
                                        ))
                                    ) : (
                                        <span className="role-badge user">USER</span>
                                    )}
                                </td>
                                <td>
            <span className="status-badge active">
                {user.enabled ? 'Active' : 'Inactive'}
            </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>

                    <div className="user-pagination">
                        <button
                            onClick={() => setPage(p => Math.max(p-1,0))}
                            disabled={page === 0}
                        >
                            Previous
                        </button>
                        <span> Page {page+1} </span>
                        <button
                            onClick={() => setPage(p => p+1)}
                            disabled={users.length < size}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
            <div className="user-pagination">
                <button onClick={() => setPage(p => Math.max(p-1,0))} disabled={page === 0}>
                    Previous
                </button>
                <span> Page {page+1} </span>
                <button onClick={() => setPage(p => p+1)} disabled={users.length < size}>
                    Next
                </button>
            </div>

        </div>
    );
};

export default Dashboard;
