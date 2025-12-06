import React, { useState } from 'react';
import '../styles/auth.css';
import useAuth from "../hooks/useAuth";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { authenticate } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage(""); // reset error message
        setSuccessMessage(""); // reset success message

        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const data = await authenticate(formData);
            const role = data?.user?.role;

            setSuccessMessage("Login successful! Redirecting...");

            setTimeout(() => {
                if (role === "ROLE_ORGANIZER") window.location.href = "/create-event";
                else if (role === "ROLE_USER") window.location.href = "/events";
                else if (role === "ROLE_ADMIN") window.location.href = "/dashboard";
                else window.location.href = "/";
            }, 1400);

        } catch (err) {
            console.error(err.response || err);
            setErrorMessage("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src="/logo512.png" alt="Gestion Evenement Logo" className="auth-logo" />
                    <h2>Welcome Back</h2>
                    <p>Sign in to manage your events</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">

                    {/* Success Message */}
                    {successMessage && (
                        <p className="success-message">
                            {successMessage}
                        </p>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="error-message-box">
                            {errorMessage}
                        </p>
                    )}

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
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="auth-button">
                        Sign In
                    </button>

                    <div className="auth-footer">
                        <p>
                            Don't have an account? <a href="/register">Sign up</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
