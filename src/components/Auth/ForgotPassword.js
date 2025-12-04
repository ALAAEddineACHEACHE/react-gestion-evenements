// src/components/Auth/ForgotPassword.js
import React, { useState } from 'react';
import '../styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: email, 2: code, 3: new password
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // eslint-disable-next-line no-unused-vars
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = '/password-reset-success';
        }, 1500);

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');

        if (verificationCode.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setResetStep(3);
        setError('');
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            // Show success message and redirect
            setTimeout(() => {
                window.location.href = '/login?reset=success';
            }, 2000);
        }, 1500);
    };

    const handleInputChange = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Auto-focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`digit-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleResendCode = () => {
        setError('');
        setSuccess(false);
        // Resend code logic here
        setTimeout(() => {
            setSuccess(true);
        }, 1000);
    };

    return (
        <div className="auth-container">
            <div className="auth-card forgot-password-card">
                <div className="auth-header">
                    <div className="password-lock-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2>Reset Your Password</h2>
                    <p className="step-description">
                        {resetStep === 1 && 'Enter your email to receive a reset code'}
                        {resetStep === 2 && 'Enter the 6-digit code sent to your email'}
                        {resetStep === 3 && 'Create your new password'}
                    </p>
                </div>

                {success && resetStep === 1 && (
                    <div className="success-message">
                        <span className="success-icon">✓</span>
                        Reset code sent to {email}
                    </div>
                )}

                {error && <div className="error-message-global">{error}</div>}

                {/* Step 1: Email Input */}
                {resetStep === 1 && (
                    <form onSubmit={handleEmailSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <span className="input-icon">✉️</span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Code'
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: Code Verification */}
                {resetStep === 2 && (
                    <form onSubmit={handleCodeSubmit} className="auth-form">
                        <div className="verification-container">
                            <p className="verification-hint">Check your email for the 6-digit code</p>
                            <div className="verification-code-container">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`digit-${index}`}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        maxLength="1"
                                        className="verification-input"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <div className="code-actions">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="resend-button"
                                    disabled={isLoading}
                                >
                                    Resend Code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResetStep(1)}
                                    className="back-button"
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={code.join('').length !== 6 || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {resetStep === 3 && (
                    <form onSubmit={handlePasswordReset} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="password-hint">
                                Must be at least 6 characters long
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-with-icon">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="password-strength">
                            <div className={`strength-bar ${newPassword.length >= 6 ? 'strong' : 'weak'}`}></div>
                            <span className="strength-text">
                {newPassword.length >= 6 ? 'Strong password' : 'Weak password'}
              </span>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>
                        Remember your password? <a href="/login">Back to Login</a>
                    </p>
                </div>

                <div className="progress-steps">
                    <div className={`step ${resetStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <span className="step-label">Email</span>
                    </div>
                    <div className={`step-line ${resetStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${resetStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <span className="step-label">Verify</span>
                    </div>
                    <div className={`step-line ${resetStep >= 3 ? 'active' : ''}`}></div>
                    <div className={`step ${resetStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span className="step-label">Reset</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
}
export default ForgotPassword;