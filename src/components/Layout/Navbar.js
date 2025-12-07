import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // IMPORTANT

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/events">
                        <img src="/logo192.png" alt="Gestion Evenement" className="navbar-logo" />
                        <span className="navbar-title">Gestion Evenement</span>
                    </Link>
                </div>

                <div className="navbar-menu">
                    {!token ? (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-button">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            {/* USER */}
                            {role === "ROLE_USER" && (
                                <>
                                    <Link to="/events" className="nav-link">Events</Link>
                                </>
                            )}

                            {/* ORGANIZER */}
                            {role === "ROLE_ORGANIZER" && (
                                <>
                                    <Link to="/events" className="nav-link">Events</Link>
                                    <Link to="/create-event" className="nav-link">Create Event</Link>
                                </>
                            )}

                            {/* ADMIN */}
                            {role === "ROLE_ADMIN" && (
                                <>
                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                </>
                            )}

                            <button onClick={handleLogout} className="nav-button">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
