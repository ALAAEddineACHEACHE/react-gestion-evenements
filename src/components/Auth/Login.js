// src/components/Auth/Login.js - Version corrigée avec debugging
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import useAuth from "../hooks/useAuth";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();
    const { authenticate } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (loginError) setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        // Validation
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            console.log('🔑 [Login] Attempting authentication...');
            const response = await authenticate(formData);

            console.log('✅ [Login] Authentication successful:', response);

            // Extraire token et user de la réponse normalisée
            const { token, user } = response;

            // Vérifier et extraire le rôle
            const role = user.role || 'ROLE_USER';
            const userId = user.id || user.userId;
            const email = user.email || formData.email;
            const username = user.username || email.split('@')[0];

            console.log(`👤 [Login] User info - ID: ${userId}, Role: ${role}, Email: ${email}`);

            // Stocker dans localStorage
            const userData = {
                id: userId,
                email: email,
                username: username,
                role: role
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);

            console.log('💾 [Login] Data stored in localStorage');

            // Déclencher les événements pour mettre à jour l'UI
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('auth-change'));

            // Rediriger selon le rôle
            console.log(`🔄 [Login] Redirecting based on role: ${role}`);
            switch(role) {
                case 'ROLE_ADMIN':
                    navigate('/dashboard');
                    break;
                case 'ROLE_ORGANIZER':
                    navigate('/events');
                    break;
                case 'ROLE_USER':
                default:
                    navigate('/events');
                    break;
            }

        } catch (error) {
            console.error('❌ [Login] Authentication failed:', error);

            // Afficher un message d'erreur plus précis
            let errorMessage = 'Invalid email or password';

            if (error.response) {
                // Erreur du serveur
                const serverError = error.response.data;
                console.error('❌ [Login] Server error details:', serverError);

                errorMessage = serverError.message ||
                    serverError.error ||
                    `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Pas de réponse du serveur
                console.error('❌ [Login] No response from server');
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                // Erreur de configuration
                console.error('❌ [Login] Request setup error:', error.message);
                errorMessage = error.message;
            }

            setLoginError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src="/logo192.png" alt="Gestion Evenement Logo" className="auth-logo" />
                    <h2>Welcome Back</h2>
                    <p>Sign in to access your account</p>
                </div>

                {loginError && (
                    <div className="error-message-global">
                        <span className="error-icon">!</span>
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="auth-footer">
                        <p>
                            Don't have an account? <a href="/register">Sign up</a>
                        </p>
                        <p className="demo-credentials">
                            <small>
                                Test with: user@example.com / password123
                            </small>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;