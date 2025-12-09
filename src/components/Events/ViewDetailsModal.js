import React from 'react';
import '../styles/events.css';
import {Link} from "react-router-dom";

const ViewDetailsModal = ({ event, onClose, onBook, hasAvailableTickets, userRole }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    const getImageUrl = () => {
        if (!event.imageUrl) {
            return 'https://via.placeholder.com/800x400';
        }

        if (event.imageUrl.startsWith('http')) {
            return event.imageUrl;
        }

        if (event.imageUrl.startsWith('/uploads/')) {
            return `http://localhost:8080/api/events${event.imageUrl}`;
        }

        if (!event.imageUrl.includes('/')) {
            return `http://localhost:8080/api/events/uploads/${event.imageUrl}`;
        }

        return 'https://via.placeholder.com/800x400';
    };

    const calculateAvailableTickets = () => {
        const totalTickets = event.totalTickets || 0;
        const ticketsSold = event.ticketsSold || 0;
        return totalTickets - ticketsSold;
    };

    const availableTickets = calculateAvailableTickets();

    return (
        <div className="details-modal-overlay" onClick={onClose}>
            <div className="details-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="details-modal-header">
                    <div className="header-content">
                        <h2>Event Details</h2>
                        <p>Complete information about the event</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="details-modal-content">
                    {/* Hero Image */}
                    <div className="details-hero-image">
                        <img
                            src={getImageUrl()}
                            alt={event.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400';
                            }}
                        />
                        <div className="hero-overlay">
                            <div className="hero-badge category-badge">
                                {event.category || 'General'}
                            </div>
                            <div className={`hero-badge availability-badge ${availableTickets > 0 ? 'available' : 'sold-out'}`}>
                                {availableTickets > 0 ?
                                    `${availableTickets} Tickets Available` :
                                    'Sold Out'
                                }
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="details-main-content">
                        <div className="details-header">
                            <h1>{event.title}</h1>
                            <div className="price-display">
                                <span className="price-amount">{formatPrice(event.ticketPrice || 0)}</span>
                                <span className="price-label">per ticket</span>
                            </div>
                        </div>

                        <p className="full-description">
                            {event.description || 'No description available.'}
                        </p>

                        {/* Info Grid */}
                        <div className="details-info-grid">
                            <div className="info-card">
                                <div className="info-icon">📍</div>
                                <div className="info-content">
                                    <div className="info-label">Location</div>
                                    <div className="info-value">{event.location}</div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">📅</div>
                                <div className="info-content">
                                    <div className="info-label">Date & Time</div>
                                    <div className="info-value">
                                        <div>{formatDate(event.startAt)}</div>
                                        <div className="time-value">{formatTime(event.startAt)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">👥</div>
                                <div className="info-content">
                                    <div className="info-label">Capacity</div>
                                    <div className="info-value">
                                        <div className="capacity-info">
                                            <span className="total">Total: {event.totalTickets || 0}</span>
                                            <span className="sold">Sold: {event.ticketsSold || 0}</span>
                                            <span className={`available ${availableTickets > 0 ? 'text-success' : 'text-danger'}`}>
                                                Available: {availableTickets}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">🎫</div>
                                <div className="info-content">
                                    <div className="info-label">Category</div>
                                    <div className="info-value">{event.category || 'General'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        {(event.additionalInfo || event.organizer) && (
                            <div className="additional-info">
                                <h3>Additional Information</h3>
                                <div className="additional-info-content">
                                    {event.organizer && (
                                        <div className="organizer-info">
                                            <strong>Organizer:</strong> {event.organizer}
                                        </div>
                                    )}
                                    {event.additionalInfo && (
                                        <p>{event.additionalInfo}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="details-modal-actions">
                    <button className="secondary-btn" onClick={onClose}>
                        Close
                    </button>

                    {userRole === 'ROLE_USER' && hasAvailableTickets && (
                        <button className="primary-btn book-now-btn" onClick={onBook}>
                            🎫 Book Now
                        </button>
                    )}

                    {userRole === 'ROLE_USER' && !hasAvailableTickets && (
                        <button className="disabled-btn" disabled>
                            Sold Out
                        </button>
                    )}

                    {userRole === 'ROLE_ORGANIZER' && (
                        <button className="primary-btn">
                            <Link to={`/events/${event.id}/edit`} className="action-btn success">
                                Edit
                            </Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewDetailsModal;