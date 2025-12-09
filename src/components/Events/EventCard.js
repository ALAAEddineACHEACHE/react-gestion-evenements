import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import '../styles/events.css';

const EventCard = ({ event, onDelete,onBook }) => {
    const { user } = useContext(AuthContext);
    const userRole = localStorage.getItem('role');

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const formatTime = (dateString) =>
        dateString
            ? new Date(dateString).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
            : '';

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            onDelete(event.id);
        }
    };

    const getImageUrl = () => {
        if (!event.imageUrl) {
            return 'https://via.placeholder.com/400x200';
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

        return 'https://via.placeholder.com/400x200';
    };

    const imageUrl = getImageUrl();

    return (
        <div className="event-card">
            <div className="event-image">
                <img
                    src={imageUrl}
                    alt={event.title}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200';
                    }}
                />
                <span className="event-category">{event.category || 'General'}</span>
            </div>

            <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">
                    {event.description?.substring(0, 100)}...
                </p>

                <div className="event-details">
                    <div className="detail-item"><span>📍</span>{event.location}</div>
                    <div className="detail-item"><span>📅</span>{formatDate(event.startAt)}</div>
                    <div className="detail-item"><span>⏰</span>{formatTime(event.startAt)}</div>
                    <div className="detail-item"><span>🎟️</span>{event.totalTickets || 0} tickets</div>
                </div>

                <div className="event-actions">
                    <button className="action-btn primary">View Details</button>

                    {userRole === 'ROLE_USER' && (
                        <button
                            className="action-btn book"
                            onClick={() => onBook && onBook(event)} // Utilisez la prop onBook
                            disabled={!event.totalTickets || event.totalTickets <= 0}
                        >
                            🎫 Book Now
                        </button>
                    )}

                    {userRole === 'ROLE_ORGANIZER' && (
                        <>
                            <Link to={`/events/${event.id}/edit`} className="action-btn success">
                                Edit
                            </Link>
                            <button className="action-btn danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </>
                    )}

                    {userRole === 'ROLE_ADMIN' && (
                        <button className="action-btn info">
                            👁️ View Analytics
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
