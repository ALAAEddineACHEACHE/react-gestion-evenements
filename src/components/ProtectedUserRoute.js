// src/components/Auth/ProtectedUserRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedUserRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" />;
    }

    // Tous les rôles authentifiés peuvent voir les événements
    return children;
};

export default ProtectedUserRoute;