// src/components/Events/EventCard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/events.css';
import { AuthContext } from '../../providers/AuthProvider'; // Si vous avez un contexte d'auth

const EventCard = ({ event, onDelete }) => {
    const { user } = useContext(AuthContext); // Récupérer l'utilisateur connecté
    const userRole = localStorage.getItem('role'); // Ou depuis le contexte

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = () => {
        // Confirmation avant suppression
        const confirmed = window.confirm("Are you sure you want to delete this event?");
        if (confirmed) {
            onDelete(event.id);
        }
    };


    return (
        <div className="event-card">
            <div className="event-image">

                <img src={event.image ? `http://localhost:8080${event.image}` : 'https://via.placeholder.com/400x200'} alt={event.title} />
                <span className="event-category">{event.category || 'General'}</span>
            </div>
            <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description?.substring(0, 100)}...</p>

                <div className="event-details">
                    <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>{event.location}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(event.startAt)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <span>{formatTime(event.startAt)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">🎟️</span>
                        <span>{event.totalTickets || '0'} tickets</span>
                    </div>
                </div>

                {/* Actions selon le rôle */}
                <div className="event-actions">
                    <button className="action-btn primary">View Details</button>

                    {/* ROLE_USER: Peut seulement booker */}
                    {userRole === 'ROLE_USER' && (
                        <button className="action-btn book">
                            <span className="button-icon">🎫</span>
                            Book Now
                        </button>
                    )}

                    {/* ROLE_ORGANIZER: Peut edit et delete */}
                    {userRole === 'ROLE_ORGANIZER' && (
                        <>
                            <Link to={`/events/${event.id}/edit`} className="action-btn secondary">
                                <span className="button-icon">✏️</span>
                                Edit
                            </Link>
                            <button
                                className="action-btn danger"
                                onClick={handleDelete}
                            >
                                <span className="button-icon">🗑️</span>
                                Delete
                            </button>
                        </>
                    )}

                    {/* ROLE_ADMIN: Peut voir mais pas modifier (ou peut-être plus d'actions) */}
                    {userRole === 'ROLE_ADMIN' && (
                        <button className="action-btn info">
                            <span className="button-icon">👁️</span>
                            View Analytics
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;