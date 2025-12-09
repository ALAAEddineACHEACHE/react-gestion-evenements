// src/App.js - Version corrigée
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import ForgotPassword from './components/Auth/ForgotPassword';
import AllEvents from './components/Events/AllEvents';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./components/Events/CreateEvent";
import UpdateEventPage from "./pages/UpdateEventPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedOrganizerRoute from "./components/ProtectedOrganizerRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import PaymentPage from "./pages/PaymentPage";

function App() {
  const isAuthenticated = localStorage.getItem('token');
  localStorage.getItem('role');
  return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Routes protégées par rôle */}
              <Route path="/dashboard" element={
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              } />

              <Route path="/create-event" element={
                <ProtectedOrganizerRoute>
                  <CreateEvent />
                </ProtectedOrganizerRoute>
              } />

              <Route path="/events" element={
                <ProtectedUserRoute>
                  <AllEvents />
                </ProtectedUserRoute>
              } />

              <Route path="/events/:id/edit" element={
                <ProtectedOrganizerRoute>
                  <UpdateEventPage />
                </ProtectedOrganizerRoute>
              } />

              {/* Route fallback */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/events" : "/login"} />} />
              <Route path="/payments" element={<PaymentPage />} />

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;