import React, { useState } from 'react';
import EventForm from './EventForm';
import '../styles/createEvent.css';
import useEvents from "../hooks/useEvent";
import {IMAGE_BASE_URL} from "../services/eventService";

const CreateEvent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { create, uploadImage } = useEvents();
    const [resetKey, setResetKey] = useState(0);


    // 🔥 Preview state
    const [eventPreview, setEventPreview] = useState({
        imagePreview: null
    });

    // 🔥 Callback from EventForm
    const handleFormChange = (data) => {
        setEventPreview(prev => ({
            ...prev,
            ...data
        }));
    };
    // src/components/Events/CreateEvent.js
    const handleSubmit = async (form) => {
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // 1. Créer l'événement
            const res = await create(form);
            const eventId = res.event.id;

            // 2. Upload image si elle existe
            if (form.image && form.image instanceof File) {
                try {
                    console.log("Uploading image:", form.image);
                    await uploadImage(eventId, form.image);
                    console.log("Image uploaded successfully");

                    // Mettre à jour la preview avec l'URL finale
                    setEventPreview(prev => ({
                        ...prev,
                        imagePreview: `${IMAGE_BASE_URL}/${form.image.name}`

                    }));

                } catch (imageError) {
                    console.error("Image upload failed:", imageError);
                }
            }

            setSuccessMessage("Event created successfully!");

            // Reset formulaire après 4s
            setTimeout(() => {
                setSuccessMessage('');
                setResetKey(prev => prev + 1);
                setEventPreview({ imagePreview: null });
            }, 4000);

        } catch (err) {
            console.error("Create event error:", err);
            let errorMsg = err.response?.data?.message || "Failed to create event!";
            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };




    return (
        <div className="create-event-container">

            <div className="create-event-header">
                <div className="header">
                    <h1>Create New Event</h1>
                    <p>Fill in the details below to create an amazing event</p>
                </div>
                <div className="header-decoration">
                    <span className="decoration-icon">📝</span>
                </div>
            </div>

            {/* --- FORM --- */}
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
                    key={resetKey}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    onFormChange={handleFormChange}
                    mode="create"
                />
            </div>

            {/* --- PREVIEW --- */}
            <div className="event-preview-section">
                <h3>Preview</h3>

                <div className="preview-card">
                    {eventPreview.imagePreview ? (
                        <div className="preview-image-container">
                            <img
                                src={eventPreview.imagePreview}
                                alt="Preview"
                                className="preview-image"
                            />
                        </div>

                    ) : (
                        <div className="preview-placeholder">
                            <span className="preview-icon">👁️</span>
                            <p>Your event will appear here as you fill the form...</p>
                            <p>Live preview available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
