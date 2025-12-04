// src/components/Auth/Verify.js
import React, { useState, useEffect } from 'react';
import '../styles/auth.css';

const Verify = ({ onVerify }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length === 6) {
            localStorage.setItem('token', 'dummy-token');
            if (onVerify) onVerify();
        }
    };

    const handleResend = () => {
        setTimeLeft(120);
        setCanResend(false);
        // Resend verification code logic here
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="auth-container">
            <div className="auth-card verify-card">
                <div className="auth-header">
                    <img src="/logo512.png" alt="Gestion Evenement Logo" className="auth-logo" />
                    <h2>Verify Your Email</h2>
                    <p>Enter the 6-digit code sent to your email</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <div className="timer-container">
                        {!canResend ? (
                            <p className="timer">Resend code in: {formatTime(timeLeft)}</p>
                        ) : (
                            <button type="button" onClick={handleResend} className="resend-button">
                                Resend Code
                            </button>
                        )}
                    </div>

                    <button type="submit" className="auth-button">
                        Verify Email
                    </button>

                    <div className="auth-footer">
                        <p>Didn't receive the code? Check your spam folder or request a new code.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verify;