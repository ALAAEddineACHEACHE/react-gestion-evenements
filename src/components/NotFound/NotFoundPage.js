import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/notfound.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                {/* Animated 404 Text */}
                <div className="error-code">
                    <span className="digit">4</span>
                    <span className="digit zero">0</span>
                    <span className="digit">4</span>
                </div>

                {/* Title */}
                <h1 className="error-title">Oops! Page Not Found</h1>

                {/* Message */}
                <p className="error-message">
                    The page you're looking for seems to have wandered off into the digital void.
                    It might have been moved, deleted, or perhaps never existed in the first place.
                </p>

                {/* Animated Illustration */}
                <div className="illustration-container">
                    <div className="astronaut">
                        <div className="helmet"></div>
                        <div className="body"></div>
                        <div className="left-arm"></div>
                        <div className="right-arm"></div>
                        <div className="left-leg"></div>
                        <div className="right-leg"></div>
                    </div>
                    <div className="stars">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="star" style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`
                            }}></div>
                        ))}
                    </div>
                    <div className="planet"></div>
                    <div className="satellite"></div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="primary-btn" onClick={handleGoBack}>
                        <span className="btn-icon">↩️</span>
                        Go Back
                    </button>

                    <Link to="/events" className="secondary-btn">
                        <span className="btn-icon">🏠</span>
                        Home Page
                    </Link>

                    <Link to="/events" className="tertiary-btn">
                        <span className="btn-icon">🎫</span>
                        Browse Events
                    </Link>
                </div>

                {/* Search Suggestion */}
                <div className="search-suggestion">
                    <p className="suggestion-title">Or try searching:</p>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search events, categories, locations..."
                            className="search-input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/events?search=${e.target.value}`);
                                }
                            }}
                        />
                        <button
                            className="search-btn"
                            onClick={() => {
                                const input = document.querySelector('.search-input');
                                if (input.value.trim()) {
                                    navigate(`/events?search=${input.value}`);
                                }
                            }}
                        >
                            🔍
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>500+</h3>
                            <p>Events Available</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3>10K+</h3>
                            <p>Active Users</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                            <h3>4.8</h3>
                            <p>Average Rating</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="floating-particles">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default NotFoundPage;