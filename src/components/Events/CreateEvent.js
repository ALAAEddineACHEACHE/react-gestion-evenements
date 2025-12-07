// src/components/Events/CreateEvent.js

import React, { useState } from 'react';
import EventForm from './EventForm';
import '../styles/createEvent.css';
import useEvents from "../hooks/useEvent";

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
            // 1. Créer l'événement d'abord
            const res = await create(form);
            const eventId = res.event.id;

            // 2. Uploader l'image SI elle existe
            if (form.image && form.image instanceof File) {
                try {
                    await uploadImage(eventId, form.image);
                    console.log("Image uploaded successfully");
                } catch (imageError) {
                    console.error("Image upload failed:", imageError);
                    // Vous pouvez choisir de continuer même si l'image échoue
                }
            }

            setSuccessMessage("Event created successfully!");

            // Réinitialiser le formulaire
            setTimeout(() => {
                setSuccessMessage('');
                setResetKey(prev => prev + 1);
                // Réinitialiser aussi la preview
                setEventPreview({
                    imagePreview: null
                });
            }, 4000);

        } catch (err) {
            console.error("Create event error:", err);
            let errorMsg = "Failed to create event!";

            // Messages d'erreur plus spécifiques
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            }

            setErrorMessage(errorMsg);
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };
    // const handleSubmit = async (form) => {
    //     setIsSubmitting(true);
    //     setSuccessMessage('');
    //     setErrorMessage('');
    //
    //     try {
    //         const res = await create(form);
    //         const eventId = res.event.id;
    //
    //         if (form.image) {
    //             await uploadImage(eventId, form.image);
    //         }
    //
    //         setSuccessMessage("Event created successfully!");
    //         setTimeout(() => {
    //             setSuccessMessage('');
    //             setResetKey(prev => prev + 1);  // 🔥 force reset du formulaire
    //         }, 4000);
    //     } catch (err) {
    //         console.error(err);
    //         setErrorMessage("Failed to create event!");
    //         setTimeout(() => setErrorMessage(''), 3000);
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };



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
                        <img
                            src={eventPreview.imagePreview}
                            alt="Preview"
                            className="preview-image"
                        />
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
