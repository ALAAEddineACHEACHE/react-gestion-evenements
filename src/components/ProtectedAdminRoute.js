// src/components/Auth/ProtectedAdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Seul ROLE_ADMIN peut accéder au dashboard admin
    if (userRole !== 'ROLE_ADMIN') {
        // Rediriger selon le rôle
        switch(userRole) {
            case 'ROLE_ORGANIZER':
                return <Navigate to="/events" />;
            case 'ROLE_USER':
                return <Navigate to="/events" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedAdminRoute;