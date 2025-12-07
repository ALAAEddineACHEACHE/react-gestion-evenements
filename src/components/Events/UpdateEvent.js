// src/components/Events/UpdateEvent.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from './EventForm';
import '../styles/updateEvent.css';

const UpdateEvent = ({ eventId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [eventData, setEventData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Simuler le chargement des données de l'événement
    useEffect(() => {
        const fetchEventData = async () => {
            setIsLoading(true);
            try {
                // Simuler un appel API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Données de test pour l'événement
                const mockEventData = {
                    id: eventId || 1,
                    title: "Tech Conference 2024",
                    description: "Annual technology conference featuring the latest innovations in AI, Blockchain, and Cloud Computing. Join industry leaders for networking and knowledge sharing.",
                    location: "Convention Center, Silicon Valley",
                    startAt: "2024-12-15T09:00",
                    endAt: "2024-12-15T18:00",
                    totalTickets: "500",
                    ticketPrice: "299.99",
                    category: "conference",
                    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
                    status: "upcoming",
                    organizerId: 2,
                    createdAt: "2024-01-15T10:00:00Z",
                    updatedAt: "2024-01-15T10:00:00Z"
                };

                setEventData(mockEventData);
            } catch (error) {
                setErrorMessage('Failed to load event data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    const handleUpdate = async (updatedData) => {
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Simuler l'appel API pour mettre à jour
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Event updated:', updatedData);
            setSuccessMessage('Event updated successfully!');

            // Mettre à jour les données locales
            setEventData(prev => ({ ...prev, ...updatedData }));

            setTimeout(() => {
                setSuccessMessage('');
                // Optionnel: rediriger après succès
                // navigate('/events');
            }, 3000);

        } catch (error) {
            setErrorMessage('Failed to update event. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                // Simuler la suppression
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Event deleted successfully!');
                // Redirection vers la liste des événements
                navigate('/events');
            } catch (error) {
                setErrorMessage('Failed to delete event');
            }
        }
    };

    const handleDuplicate = async () => {
        if (window.confirm('Do you want to create a duplicate of this event?')) {
            try {
                // Simuler la duplication
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Event duplicated successfully! You can edit the new event.');
                // Rediriger vers create event avec les données pré-remplies
                navigate('/create-event');
            } catch (error) {
                setErrorMessage('Failed to duplicate event');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading event data...</p>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="error-container">
                <div className="error-icon">❌</div>
                <h3>Event Not Found</h3>
                <p>The event you're trying to edit doesn't exist or you don't have permission to edit it.</p>
                <button onClick={() => navigate('/events')} className="back-button">
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="update-event-container">
            {/* Header simplifié */}
            <div className="update-event-header">
                <div className="header-content">
                    <div className="breadcrumb">
                        <button onClick={() => navigate('/events')} className="breadcrumb-link">
                            Events
                        </button>
                        <span className="breadcrumb-separator">/</span>
                        <button onClick={() => navigate(`/events/${eventData.id}`)} className="breadcrumb-link">
                            {eventData.title}
                        </button>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Edit</span>
                    </div>

                    <div className="header-main">
                        <h1>
                            <span className="edit-icon">✏️</span>
                            Edit Event
                        </h1>
                        <p>Update your event details below</p>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="update-event-content">
                {/* Messages de succès/erreur */}
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

                {/* Grille avec formulaire et aperçu */}
                <div className="update-grid">
                    {/* Colonne gauche: Formulaire */}
                    <div className="form-column">
                        <div className="form-card">
                            <div className="card-header">
                                <h3>Event Details</h3>
                                <span className="card-badge">Edit</span>
                            </div>

                            <EventForm
                                initialData={eventData}
                                onSubmit={handleUpdate}
                                isSubmitting={isSubmitting}
                                mode="update"
                            />
                        </div>
                    </div>

                    {/* Colonne droite: Aperçu et actions */}
                    <div className="preview-column">
                        {/* Aperçu en temps réel */}
                        <div className="preview-card">
                            <div className="card-header">
                                <h3>Live Preview</h3>
                                <span className="card-badge">Real-time</span>
                            </div>

                            <div className="preview-content">
                                <div className="preview-event-card">
                                    <div className="preview-image">
                                        <img src={eventData.image} alt="Event preview" />
                                        <span className="preview-category">{eventData.category}</span>
                                    </div>

                                    <div className="preview-details">
                                        <h4 className="preview-title">{eventData.title || "Event Title"}</h4>
                                        <p className="preview-description">
                                            {eventData.description?.substring(0, 100) || "Event description..."}
                                            {eventData.description?.length > 100 && "..."}
                                        </p>

                                        <div className="preview-meta">
                                            <div className="meta-item">
                                                <span className="meta-icon">📍</span>
                                                <span className="meta-text">{eventData.location || "Location"}</span>
                                            </div>

                                            <div className="meta-item">
                                                <span className="meta-icon">📅</span>
                                                <span className="meta-text">
                                                    {eventData.startAt
                                                        ? new Date(eventData.startAt).toLocaleDateString()
                                                        : "Date"}
                                                </span>
                                            </div>

                                            <div className="meta-item">
                                                <span className="meta-icon">⏰</span>
                                                <span className="meta-text">
                                                    {eventData.startAt
                                                        ? new Date(eventData.startAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })
                                                        : "Time"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Supprimé le bouton Book Now - seulement pour users */}
                                        <div className="preview-footer">
                                            <div className="ticket-info">
                                                <span className="ticket-price">
                                                    ${eventData.ticketPrice ? parseFloat(eventData.ticketPrice).toFixed(2) : "0.00"}
                                                </span>
                                                <span className="ticket-available">
                                                    {eventData.totalTickets || "0"} tickets available
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="preview-note">
                                    <span className="note-icon">💡</span>
                                    <p>This preview updates in real-time as you edit the form</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions dangereuses - Version simplifiée */}
                        <div className="danger-zone">
                            <div className="card-header">
                                <h3>Event Actions</h3>
                                <span className="card-badge warning">⚡</span>
                            </div>

                            <div className="danger-content">
                                <div className="action-item">
                                    <div className="action-info">
                                        <h4>Duplicate Event</h4>
                                        <p>Create a copy of this event with the same details.</p>
                                    </div>
                                    <button
                                        className="secondary-button"
                                        onClick={handleDuplicate}
                                        disabled={isSubmitting}
                                    >
                                        <span className="button-icon">⎘</span>
                                        Duplicate
                                    </button>
                                </div>

                                <div className="action-item">
                                    <div className="action-info">
                                        <h4>Delete Event</h4>
                                        <p>Permanently delete this event and all associated data.</p>
                                    </div>
                                    <button
                                        className="danger-button"
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                    >
                                        <span className="button-icon">🗑️</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Informations de l'événement */}
                        <div className="info-card">
                            <div className="card-header">
                                <h3>Event Information</h3>
                                <span className="card-badge info">ℹ️</span>
                            </div>

                            <div className="info-content">
                                <div className="info-item">
                                    <span className="info-label">Status</span>
                                    <span className={`info-value status-${eventData.status}`}>
                                        {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
                                    </span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Created</span>
                                    <span className="info-value">
                                        {new Date(eventData.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Last Updated</span>
                                    <span className="info-value">
                                        {new Date(eventData.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Event ID</span>
                                    <span className="info-value code">{eventData.id}</span>
                                </div>

                                <div className="info-item">
                                    <span className="info-label">Organizer ID</span>
                                    <span className="info-value code">{eventData.organizerId}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEvent;