// src/components/Events/UpdateEvent.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from './EventForm';
import '../styles/updateEvent.css';
import useEvents from "../hooks/useEvent";

const UpdateEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Récupérer l'ID depuis l'URL
    const { getEvent, update,uploadImage } = useEvents(); // Utiliser votre hook

    const [isLoading, setIsLoading] = useState(true);
    const [eventData, setEventData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Charger les données réelles de l'événement
    useEffect(() => {
        const fetchEventData = async () => {
            setIsLoading(true);
            try {
                // Récupérer l'événement depuis l'API
                const response = await getEvent(id);
                setEventData(response.data);
                console.log("Event data loaded:", response.data);
            } catch (error) {
                console.error("Error loading event:", error);
                setErrorMessage('Failed to load event data');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id, getEvent]);

    const handleUpdate = async (updatedData) => {
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            console.log("Updating event with data:", updatedData);

            // 1. Extraire l'image du formulaire
            const { image, ...eventDataWithoutImage } = updatedData;

            // 2. Mettre à jour les données de l'événement (sans image)
            const result = await update(id, eventDataWithoutImage);
            console.log("Event update successful:", result);

            // 3. Si une nouvelle image est fournie, l'uploader séparément
            if (image && image instanceof File) {
                console.log("Uploading new image:", image.name);
                await uploadImage(id, image);
                console.log("Image uploaded successfully");

                // Récupérer l'événement mis à jour avec la nouvelle image
                const updatedEventResponse = await getEvent(id);
                setEventData(updatedEventResponse.data);
            } else {
                // Mettre à jour les données locales
                setEventData(prev => ({ ...prev, ...eventDataWithoutImage }));
            }

            setSuccessMessage('Event updated successfully!');

            // Rediriger après 3 secondes
            setTimeout(() => {
                navigate('/events');
            }, 3000);

        } catch (error) {
            console.error("Update error:", error);
            const errorMsg = error.response?.data?.message || "Failed to update event";
            setErrorMessage(errorMsg);
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

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format YYYY-MM-DDTHH:mm
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

    // Préparer les données pour le formulaire
    const formInitialData = {
        title: eventData.title || '',
        description: eventData.description || '',
        location: eventData.location || '',
        startAt: formatDateForInput(eventData.startAt),
        endAt: formatDateForInput(eventData.endAt),
        totalTickets: eventData.totalTickets?.toString() || '0',
        ticketPrice: eventData.ticketPrice?.toString() || '0',
        category: eventData.category || '',
        image: eventData.imageUrl || ''
    };

    return (
        <div className="update-event-page">
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
                                    initialData={formInitialData}
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
                                            <img
                                                src={eventData.imageUrl
                                                    ? eventData.imageUrl.startsWith('/uploads/')
                                                        ? `http://localhost:8080/api/events${eventData.imageUrl}`
                                                        : eventData.imageUrl
                                                    : 'https://via.placeholder.com/400x200'}
                                                alt="Event preview"
                                            />
                                            <span className="preview-category">{eventData.category || 'General'}</span>
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

                            {/* Actions rapides */}
                            <div className="actions-card">
                                <div className="card-header">
                                    <h3>Quick Actions</h3>
                                    <span className="card-badge warning">⚠️</span>
                                </div>

                                <div className="actions-content">
                                    <button
                                        className="action-button delete"
                                        onClick={handleDelete}
                                    >
                                        <span className="action-icon">🗑️</span>
                                        Delete Event
                                    </button>

                                    <button
                                        className="action-button secondary"
                                        onClick={() => navigate('/events')}
                                    >
                                        <span className="action-icon">←</span>
                                        Back to Events
                                    </button>

                                    <button
                                        className="action-button primary"
                                        onClick={() => navigate(`/events/${id}`)}
                                    >
                                        <span className="action-icon">👁️</span>
                                        View Event Page
                                    </button>
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