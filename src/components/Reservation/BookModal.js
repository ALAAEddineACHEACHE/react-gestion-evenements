import React, { useState } from 'react';
import '../styles/reservation.css';

const BookModal = ({ event, onClose, onBook }) => {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const ticketPrice = event.ticketPrice || 0;
    const totalPrice = (ticketPrice * quantity).toFixed(2);

    // Calculer les tickets disponibles
    const availableTickets = () => {
        const total = event.totalTickets || 0;
        const sold = event.ticketsSold || 0;
        return total - sold;
    };

    const ticketsAvailable = availableTickets(); // On stocke la valeur pour éviter de recalculer à chaque fois

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= ticketsAvailable) {
            setQuantity(value);
            setError('');
        }
    };

    const incrementQuantity = () => {
        if (quantity < ticketsAvailable) {
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

        if (quantity > ticketsAvailable) {
            setError(`Only ${ticketsAvailable} tickets available`);
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
            // Gestion des erreurs venant du parent - version corrigée
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to create reservation';
            setError(errorMessage);
        }
    };

    // Formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    // Formater l'heure
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
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

                {/* Event Info - Version améliorée */}
                <div className="event-summary">
                    <div className="event-header">
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-price-badge">
                            <span className="price-tag">${ticketPrice.toFixed(2)}</span>
                            <span className="price-label">per ticket</span>
                        </div>
                    </div>

                    <div className="event-details-grid">
                        <div className="detail-card">
                            <div className="detail-icon-wrapper">
                                <span className="detail-icon">📍</span>
                            </div>
                            <div className="detail-content">
                                <div className="detail-label">Location</div>
                                <div className="detail-value">{event.location}</div>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon-wrapper">
                                <span className="detail-icon">📅</span>
                            </div>
                            <div className="detail-content">
                                <div className="detail-label">Date</div>
                                <div className="detail-value">
                                    <div>{formatDate(event.startAt)}</div>
                                    <div className="detail-time">{formatTime(event.startAt)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="detail-icon-wrapper">
                                <span className="detail-icon">👥</span>
                            </div>
                            <div className="detail-content">
                                <div className="detail-label">Availability</div>
                                <div className="detail-value">
                                    <div className={`availability-status ${ticketsAvailable > 0 ? 'available' : 'sold-out'}`}>
                                        {ticketsAvailable > 0 ? (
                                            <>
                                                <span className="availability-dot"></span>
                                                {ticketsAvailable} tickets left
                                            </>
                                        ) : (
                                            'Sold Out'
                                        )}
                                    </div>
                                </div>
                            </div>
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
                                {ticketsAvailable} tickets available
                                {ticketsAvailable <= 0 && (
                                    <span className="sold-out-badge">SOLD OUT</span>
                                )}
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
                                    max={ticketsAvailable}
                                    className="quantity-input"
                                />
                                <span className="quantity-label">tickets</span>
                            </div>

                            <button
                                type="button"
                                className="quantity-btn plus"
                                onClick={incrementQuantity}
                                disabled={quantity >= ticketsAvailable}
                            >
                                +
                            </button>
                        </div>

                        <div className="quantity-hint">
                            <span className="hint-icon">💡</span>
                            Select between 1 and 4 tickets
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
                            disabled={isLoading || ticketsAvailable <= 0}
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