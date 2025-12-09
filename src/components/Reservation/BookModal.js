// src/components/Reservation/BookModal.js
import React, { useState } from 'react';
import '../styles/reservation.css';

const BookModal = ({ event, onClose, onBook }) => {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const availableTickets = event.totalTickets || event.availableTickets || 0;
    const ticketPrice = event.ticketPrice || 0;
    const totalPrice = (ticketPrice * quantity).toFixed(2);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= availableTickets) {
            setQuantity(value);
            setError('');
        }
    };

    const incrementQuantity = () => {
        if (quantity < availableTickets) {
            setQuantity(prev => prev + 1);
            setError('');
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (quantity < 1) {
            setError('Quantity must be at least 1');
            return;
        }

        if (quantity > availableTickets) {
            setError(`Only ${availableTickets} tickets available`);
            return;
        }

        setIsLoading(true);

        try {
            // Appelez onBook qui vient du parent (AllEvents.js)
            // Le parent gère l'appel API via useReservation
            await onBook({
                eventId: event.id,
                quantity: quantity
            });

            // Si onBook réussit, affichez le succès
            setSuccess('Reservation created successfully!');

            // Le parent gérera la fermeture du modal et la notification
            // On ne ferme pas le modal ici, le parent le fera

        } catch (err) {
            // Gestion des erreurs venant du parent
            setError(err.message || 'Failed to create reservation');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="book-modal-overlay" onClick={onClose}>
            <div className="book-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="header-content">
                        <h2>
                            <span className="header-icon">🎫</span>
                            Book Tickets
                        </h2>
                        <p>Reserve your spot for this amazing event</p>
                    </div>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Event Info */}
                <div className="event-summary">
                    <div className="event-image">
                        {/* Vous pouvez ajouter l'image si disponible */}
                        {/* <img src={event.image || 'https://via.placeholder.com/100'} alt={event.title} /> */}
                    </div>
                    <div className="event-info">
                        <h3>{event.title}</h3>
                        <div className="event-details">
                            <span className="detail-item">
                                <span className="detail-icon">📍</span>
                                {event.location}
                            </span>
                            <span className="detail-item">
                                <span className="detail-icon">📅</span>
                                {new Date(event.startAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="reservation-form">
                    {/* Quantity Selector */}
                    <div className="form-section">
                        <div className="section-header">
                            <h4>Select Quantity</h4>
                            <span className="available-tickets">
                                {availableTickets} tickets available
                            </span>
                        </div>

                        <div className="quantity-selector">
                            <button
                                type="button"
                                className="quantity-btn minus"
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>

                            <div className="quantity-display">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                    max={availableTickets}
                                    className="quantity-input"
                                />
                                <span className="quantity-label">tickets</span>
                            </div>

                            <button
                                type="button"
                                className="quantity-btn plus"
                                onClick={incrementQuantity}
                                disabled={quantity >= availableTickets}
                            >
                                +
                            </button>
                        </div>

                        <div className="quantity-hint">
                            <span className="hint-icon">💡</span>
                            Select between 1 and {availableTickets} tickets
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="price-summary">
                        <div className="price-row">
                            <span className="price-label">Ticket Price</span>
                            <span className="price-value">${ticketPrice.toFixed(2)}</span>
                        </div>

                        <div className="price-row">
                            <span className="price-label">Quantity</span>
                            <span className="price-value">× {quantity}</span>
                        </div>

                        <div className="divider"></div>

                        <div className="price-row total">
                            <span className="price-label">Total Amount</span>
                            <span className="price-value">${totalPrice}</span>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">!</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            <span className="success-icon">✓</span>
                            {success}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={isLoading || !availableTickets}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <span className="button-icon">🔒</span>
                                    Book Now - ${totalPrice}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Note */}
                <div className="modal-footer">
                    <div className="security-note">
                        <span className="security-icon">🔒</span>
                        Your payment information is secure and encrypted
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookModal;