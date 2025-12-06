// src/components/Events/CreateEvent.js
import React, { useState } from 'react';
import EventForm from './EventForm';
import '../styles/createEvent.css';

const CreateEvent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (eventData) => {
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Event created:', eventData);
            setSuccessMessage('Event created successfully!');

            // Reset form after 2 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            setErrorMessage('Failed to create event. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-event-container">
            <div className="create-event-header">
                <div className="header-content">
                    <h1>Create New Event</h1>
                    <p>Fill in the details below to create an amazing event</p>
                </div>
                <div className="header-decoration">
                    <span className="decoration-icon">📝</span>
                </div>
            </div>

            <div className="create-event-card">
                {successMessage && (
                    <div className="success-message">
                        <span className="success-icon">✓</span>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="error-message">
                        <span className="error-icon">!</span>
                        {errorMessage}
                    </div>
                )}

                <EventForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>

            <div className="event-preview-section">
                <h3>Preview</h3>
                <div className="preview-card">
                    <p>Your event will appear here as you fill the form...</p>
                    <div className="preview-placeholder">
                        <span className="preview-icon">👁️</span>
                        <p>Live preview available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;