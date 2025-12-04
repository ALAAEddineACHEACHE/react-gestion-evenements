// src/components/Events/EventCard.js
import React from 'react';
import '../styles/events.css';

const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="event-card">
            <div className="event-image">
                <img src={event.image} alt={event.title} />
                <span className="event-category">{event.category}</span>
            </div>
            <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>

                <div className="event-details">
                    <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <span>{event.time}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>{event.location}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">👥</span>
                        <span>{event.attendees} attendees</span>
                    </div>
                </div>

                <div className="event-actions">
                    <button className="action-btn primary">View Details</button>
                    <button className="action-btn secondary">Edit</button>
                    <button className="action-btn danger">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;