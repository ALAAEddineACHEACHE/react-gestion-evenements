import React, { useState } from 'react';
import '../styles/auth.css';
import useAuth from "../hooks/useAuth";
import {mapRegisterRequest} from "../../mappers/authMapper";

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // <-- message vert
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const payload = mapRegisterRequest(formData);
            await register(payload);

            // Affiche le message vert
            setSuccessMessage("Registered successfully! Please verify your email.");

            // Redirection vers VerifyPage après 1.5 secondes
            setTimeout(() => {
                window.location.href = `/verify?email=${formData.email}`;
            }, 1500);

        } catch (err) {
            console.error(err.response || err);
            alert("Registration failed!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src="/logo512.png" alt="Gestion Evenement Logo" className="auth-logo" />
                    <h2>Create Account</h2>
                    <p>Join us to check All Events</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">

                    {successMessage && <p className="success-message">{successMessage}</p>} {/* <-- message vert */}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'input-error' : ''}
                            placeholder="Enter a username"
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                            placeholder="Create a password"
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="auth-button">
                        Create Account
                    </button>

                    <div className="auth-footer">
                        <p>
                            Already have an account? <a href="/login">Sign in</a>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;
