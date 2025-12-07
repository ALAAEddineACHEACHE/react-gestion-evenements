// src/components/Auth/ProtectedOrganizerRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedOrganizerRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // 'ROLE_USER', 'ROLE_ADMIN', 'ROLE_ORGANIZER'

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Seul ROLE_ORGANIZER peut accéder
    if (userRole !== 'ROLE_ORGANIZER') {
        // Rediriger selon le rôle
        switch(userRole) {
            case 'ROLE_ADMIN':
                return <Navigate to="/dashboard" />;
            case 'ROLE_USER':
                return <Navigate to="/events" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedOrganizerRoute;