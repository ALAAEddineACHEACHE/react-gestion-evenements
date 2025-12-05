import React, { useState, useEffect } from 'react';
import '../styles/auth.css';
import useAuth from "../hooks/useAuth";

const Verify = () => {
    const [code, setCode] = useState(['', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [canResend, setCanResend] = useState(false);
    const [successMessage, setSuccessMessage] = useState(''); // <-- message vert

    const { verifyAccount } = useAuth();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        const email = new URLSearchParams(window.location.search).get("email");

        try {
            await verifyAccount(email, verificationCode);

            // Message vert
            setSuccessMessage("Verification successful! Redirecting to login...");

            // Redirection après 1,5s
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);

        } catch (err) {
            alert("Invalid verification code");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card verify-card">
                <div className="auth-header">
                    <img src="/logo512.png" alt="Gestion Evenement Logo" className="auth-logo" />
                    <h2>Verify Your Email</h2>
                    <p>Enter the 4-digit code sent to your email</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">

                    {successMessage && <p className="success-message">{successMessage}</p>} {/* <-- message vert */}

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
