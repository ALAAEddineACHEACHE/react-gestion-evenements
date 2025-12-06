// src/App.js - Updated with Forgot Password
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Verify from './components/Auth/Verify';
import AllEvents from './components/Events/AllEvents';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./components/Events/CreateEvent";

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/create-event" element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} />
              <Route path="/events" element={isAuthenticated ? <AllEvents /> : <Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;