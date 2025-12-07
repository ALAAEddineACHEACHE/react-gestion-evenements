// src/components/Events/EventForm.js
import React, { useState } from 'react';
import DateTimePicker from '../UI/DateTimePicker';


const EventForm = ({ onSubmit, isSubmitting,onFormChange,mode = "create"  }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        startAt: '',
        endAt: '',
        totalTickets: '',
        ticketPrice: '',
        category: '',
        image: null,
        termsAccepted: false
    });

    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'conference', label: 'Conference', emoji: '🎤' },
        { value: 'workshop', label: 'Workshop', emoji: '💡' },
        { value: 'sports', label: 'Sports', emoji: '⚽' },
        { value: 'networking', label: 'Networking', emoji: '🤝' },
        { value: 'exhibition', label: 'Exhibition', emoji: '🖼️' },
        { value: 'other', label: 'Other', emoji: '🎭' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateTimeChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //
    //     const previewUrl = URL.createObjectURL(file); // 🔥 OBLIGATOIRE
    //
    //     setFormData({ ...formData, image: file });
    //     if (file) {
    //         onFormChange({
    //             imagePreview: previewUrl
    //         });
    //     }
    //
    // };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        // Mettre à jour le state local
        setFormData(prev => ({
            ...prev,
            image: file
        }));

        // NOTIFIER le parent (CreateEvent) pour la preview
        if (onFormChange) {
            onFormChange({
                imagePreview: previewUrl
            });
        }
    };




    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.startAt) {
            newErrors.startAt = 'Start date/time is required';
        }

        if (!formData.endAt) {
            newErrors.endAt = 'End date/time is required';
        } else if (formData.startAt && formData.endAt <= formData.startAt) {
            newErrors.endAt = 'End time must be after start time';
        }

        if (!formData.totalTickets) {
            newErrors.totalTickets = 'Number of tickets is required';
        } else if (formData.totalTickets < 1) {
            newErrors.totalTickets = 'Must have at least 1 ticket';
        } else if (formData.totalTickets > 4) {
            newErrors.totalTickets = 'You cannot reserve more than 4 Tickets';
        }

        if (!formData.ticketPrice) {
            newErrors.ticketPrice = 'Ticket price is required';
        } else if (formData.ticketPrice < 0) {
            newErrors.ticketPrice = 'Price cannot be negative';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'You must accept the terms';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Format data for submission
        const eventData = {
            ...formData,
            organizerId: 2, // This would come from auth context in real app
            startAt: new Date(formData.startAt).toISOString(),
            endAt: new Date(formData.endAt).toISOString(),
            totalTickets: parseInt(formData.totalTickets),
            ticketPrice: parseFloat(formData.ticketPrice),
            category: formData.category,
            image: formData.image,
        };

        onSubmit(eventData);
    };

    const calculateDuration = () => {
        if (formData.startAt && formData.endAt) {
            const start = new Date(formData.startAt);
            const end = new Date(formData.endAt);
            const diff = end - start;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `${hours}h ${minutes}m`;
        }
        return '--';
    };

    const calculateRevenue = () => {
        if (formData.totalTickets && formData.ticketPrice) {
            return (formData.totalTickets * formData.ticketPrice).toFixed(2);
        }
        return '0.00';
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
                {/* Left Column */}
                <div className="form-column">
                    <div className="form-section">
                        <h3 className="section-title">Basic Information</h3>

                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`form-input ${errors.title ? 'input-error' : ''}`}
                                placeholder="Enter event title (e.g., Tech Conference 2024)"
                            />
                            {errors.title && <span className="error-text">{errors.title}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                                placeholder="Describe your event in detail..."
                                rows="4"
                            />
                            <div className="character-count">
                                {formData.description.length}/500 characters
                            </div>
                            {errors.description && <span className="error-text">{errors.description}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="location" className="form-label">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`form-input ${errors.location ? 'input-error' : ''}`}
                                placeholder="Enter venue or online meeting link"
                            />
                            {errors.location && <span className="error-text">{errors.location}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <div className="category-grid">
                                {categories.map((cat) => (
                                    <label key={cat.value} className="category-option">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.value}
                                            checked={formData.category === cat.value}
                                            onChange={handleChange}
                                            className="category-radio"
                                        />
                                        <div className={`category-card ${formData.category === cat.value ? 'selected' : ''}`}>
                                            <span className="category-emoji">{cat.emoji}</span>
                                            <span className="category-label">{cat.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.category && <span className="error-text">{errors.category}</span>}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                    <div className="form-section">
                        <h3 className="section-title">Event Details</h3>

                        <div className="datetime-row">
                            <div className="form-group">
                                <label htmlFor="startAt" className="form-label">
                                    Start Date & Time *
                                </label>
                                <DateTimePicker
                                    id="startAt"
                                    value={formData.startAt}
                                    onChange={(value) => handleDateTimeChange('startAt', value)}
                                    error={errors.startAt}
                                    minDate={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endAt" className="form-label">
                                    End Date & Time *
                                </label>
                                <DateTimePicker
                                    id="endAt"
                                    value={formData.endAt}
                                    onChange={(value) => handleDateTimeChange('endAt', value)}
                                    error={errors.endAt}
                                    minDate={formData.startAt || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="duration-display">
                            <span className="duration-label">Total Duration:</span>
                            <span className="duration-value">{calculateDuration()}</span>
                        </div>

                        <div className="tickets-row">
                            <div className="form-group">
                                <label htmlFor="totalTickets" className="form-label">
                                    Total Tickets *
                                </label>
                                <div className="input-with-addon">
                                    <input
                                        type="number"
                                        id="totalTickets"
                                        name="totalTickets"
                                        value={formData.totalTickets}
                                        onChange={handleChange}
                                        className={`form-input ${errors.totalTickets ? 'input-error' : ''}`}
                                        placeholder="0"
                                        min="1"
                                    />
                                    <span className="input-addon">tickets</span>
                                </div>
                                {errors.totalTickets && <span className="error-text">{errors.totalTickets}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="ticketPrice" className="form-label">
                                    Ticket Price *
                                </label>
                                <div className="input-with-addon">
                                    <input
                                        type="number"
                                        id="ticketPrice"
                                        name="ticketPrice"
                                        value={formData.ticketPrice}
                                        onChange={handleChange}
                                        className={`form-input ${errors.ticketPrice ? 'input-error' : ''}`}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="input-addon">$</span>
                                </div>
                                {errors.ticketPrice && <span className="error-text">{errors.ticketPrice}</span>}
                            </div>
                        </div>

                        <div className="revenue-preview">
                            <div className="revenue-item">
                                <span className="revenue-label">Estimated Revenue:</span>
                                <span className="revenue-value">${calculateRevenue()}</span>
                            </div>
                            <div className="revenue-hint">
                                Based on all tickets sold at current price
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Event Image</label>
                            <div className="image-upload">
                                <label htmlFor="image-upload" className="upload-area">
                                    {formData.image ? (
                                        <>
                                            <span className="upload-icon">📷</span>
                                            <span className="upload-text">{formData.image.name}</span>
                                            <span className="upload-hint">Click to change</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="upload-icon">📁</span>
                                            <span className="upload-text">Upload event image</span>
                                            <span className="upload-hint">PNG, JPG up to 5MB</span>
                                        </>
                                    )}
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="upload-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-section terms-section">
                <label className="terms-checkbox">
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="terms-text">
            I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and confirm that I have the right to organize this event.
          </span>
                </label>
                {errors.termsAccepted && <span className="error-text">{errors.termsAccepted}</span>}
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => window.history.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="primary-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            {mode === "update" ? "Updating Event..." : "Creating Event..."}
                        </>
                    ) : (
                        <>
                            <span className="button-icon">🎉</span>
                            {mode === "update" ? "Update Event" : "Create Event"}
                        </>
                    )}
                </button>

            </div>
        </form>
    );
};

export default EventForm;