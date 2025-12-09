// src/components/Payment/PaymentPage.js - Version modifiée
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/payment.css';
import usePayment from "../components/hooks/usePayment";
import useReservation from "../components/hooks/useReservation";
import axios from 'axios';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { processPayment, isLoading, error, paymentResult } = usePayment();
    const { getUserReservations } = useReservation();

    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [deletingReservation, setDeletingReservation] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        method: 'CARD'
    });

    // États pour les messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    useEffect(() => {
        loadUserReservations();
    }, []);

    // Fonction pour afficher un message temporaire
    const showTemporaryMessage = (type, message, duration = 5000) => {
        switch (type) {
            case 'success':
                setSuccessMessage(message);
                setTimeout(() => setSuccessMessage(''), duration);
                break;
            case 'error':
                setErrorMessage(message);
                setTimeout(() => setErrorMessage(''), duration);
                break;
            case 'warning':
                setWarningMessage(message);
                setTimeout(() => setWarningMessage(''), duration);
                break;
            case 'info':
                setInfoMessage(message);
                setTimeout(() => setInfoMessage(''), duration);
                break;
        }
    };

    const loadUserReservations = async () => {
        try {
            setLoadingReservations(true);
            const response = await getUserReservations();
            console.log('Loaded reservations response:', response);

            const reservationsArray = response.reservations || [];
            console.log('Reservations array:', reservationsArray);

            const formattedReservations = reservationsArray.map(reservation => ({
                id: reservation.id,
                eventTitle: reservation.event?.title || 'Event',
                quantity: reservation.quantity,
                ticketPrice: reservation.event?.ticketPrice || 0,
                totalAmount: reservation.quantity * (reservation.event?.ticketPrice || 0),
                status: reservation.status || 'PENDING',
                createdAt: reservation.createdAt || new Date().toISOString(),
                eventId: reservation.eventId,
                event: reservation.event,
                payment: reservation.payment
            }));

            const unpaidReservations = formattedReservations.filter(
                reservation => !reservation.payment && reservation.status !== 'PAID'
            );

            console.log('Unpaid reservations:', unpaidReservations);
            setReservations(unpaidReservations);

            if (unpaidReservations.length > 0) {
                setSelectedReservation(unpaidReservations[0]);
            } else {
                setSelectedReservation(null);
            }

        } catch (err) {
            console.error('Failed to load reservations:', err);
            setReservations([]);
            showTemporaryMessage('error', 'Failed to load your reservations. Please try again.');
        } finally {
            setLoadingReservations(false);
        }
    };

    const handleDeleteReservation = async (reservationId) => {
        if (!reservationId) return;

        setDeletingReservation(reservationId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:8080/api/reservations/${reservationId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200 || response.status === 204) {
                // Mettre à jour la liste des réservations
                const updatedReservations = reservations.filter(r => r.id !== reservationId);
                setReservations(updatedReservations);

                // Si la réservation supprimée était sélectionnée, sélectionner la première disponible
                if (selectedReservation && selectedReservation.id === reservationId) {
                    if (updatedReservations.length > 0) {
                        setSelectedReservation(updatedReservations[0]);
                    } else {
                        setSelectedReservation(null);
                    }
                }

                // Fermer le modal
                setShowDeleteModal(false);
                setReservationToDelete(null);

                // Afficher un beau message de succès
                showTemporaryMessage('success', 'Reservation cancelled successfully! 🎫');
            }
        } catch (error) {
            console.error('Failed to delete reservation:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to cancel reservation';
            showTemporaryMessage('error', `Failed: ${errorMsg}`);
        } finally {
            setDeletingReservation(null);
        }
    };

    const confirmDeleteReservation = (reservation) => {
        setReservationToDelete(reservation);
        setShowDeleteModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const formattedValue = value
                .replace(/\s/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .trim();
            setFormData({
                ...formData,
                [name]: formattedValue.slice(0, 19)
            });
        } else if (name === 'expiryDate') {
            const formattedValue = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .slice(0, 5);
            setFormData({
                ...formData,
                [name]: formattedValue
            });
        } else if (name === 'cvv') {
            setFormData({
                ...formData,
                [name]: value.replace(/\D/g, '').slice(0, 3)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedReservation) {
            showTemporaryMessage('warning', 'Please select a reservation to pay');
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            const paymentData = {
                reservationId: selectedReservation.id,
                method: formData.method,
                cardNumber: formData.cardNumber.replace(/\s/g, ''),
                cardHolder: formData.cardHolder,
                expiryDate: formData.expiryDate,
                cvv: formData.cvv,
                amount: selectedReservation.totalAmount
            };

            console.log('Processing payment:', paymentData);
            const result = await processPayment(paymentData);
            console.log('Payment result:', result);

            // Afficher un message de succès magnifique
            showTemporaryMessage('success',
                `Payment successful! 💰 $${selectedReservation.totalAmount.toFixed(2)} paid for ${selectedReservation.eventTitle}`,
                8000
            );

            await loadUserReservations();

            setFormData({
                cardNumber: '',
                cardHolder: '',
                expiryDate: '',
                cvv: '',
                method: 'CARD'
            });

        } catch (err) {
            console.error('Payment error:', err);
            showTemporaryMessage('error',
                err.response?.data?.message || err.message || 'Payment failed. Please try again.'
            );
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
            errors.push('Card number must be 16 digits');
        }

        if (!formData.cardHolder) {
            errors.push('Card holder name is required');
        }

        if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            errors.push('Expiry date must be in MM/YY format');
        }

        if (!formData.cvv || formData.cvv.length !== 3) {
            errors.push('CVV must be 3 digits');
        }

        if (errors.length > 0) {
            showTemporaryMessage('error', errors.join('\n'));
            return false;
        }

        const [month, year] = formData.expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (parseInt(year) < currentYear ||
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showTemporaryMessage('error', 'Card has expired. Please use a valid card.');
            return false;
        }

        return true;
    };

    const calculateTotal = () => {
        if (!reservations.length) return 0;
        return reservations.reduce((total, reservation) => total + reservation.totalAmount, 0);
    };

    // Fonction pour fermer manuellement un message
    const closeMessage = (type) => {
        switch (type) {
            case 'success': setSuccessMessage(''); break;
            case 'error': setErrorMessage(''); break;
            case 'warning': setWarningMessage(''); break;
            case 'info': setInfoMessage(''); break;
        }
    };

    if (loadingReservations) {
        return (
            <div className="payment-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your reservations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            {/* Messages fixes en haut de l'écran */}
            {successMessage && (
                <div className="fixed-message success-message">
                    <div className="success-icon">✓</div>
                    <div className="message-content">
                        <div className="message-title">
                            <span>Success!</span>
                        </div>
                        <div className="message-text">{successMessage}</div>
                    </div>
                    <button
                        className="close-message-btn"
                        onClick={() => closeMessage('success')}
                    >
                        &times;
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="fixed-message error-message">
                    <div className="error-icon">!</div>
                    <div className="message-content">
                        <div className="message-title">
                            <span>Error!</span>
                        </div>
                        <div className="message-text">{errorMessage}</div>
                    </div>
                    <button
                        className="close-message-btn"
                        onClick={() => closeMessage('error')}
                    >
                        &times;
                    </button>
                </div>
            )}

            {warningMessage && (
                <div className="fixed-message warning-message">
                    <div className="warning-icon">⚠️</div>
                    <div className="message-content">
                        <div className="message-title">
                            <span>Warning!</span>
                        </div>
                        <div className="message-text">{warningMessage}</div>
                    </div>
                    <button
                        className="close-message-btn"
                        onClick={() => closeMessage('warning')}
                    >
                        &times;
                    </button>
                </div>
            )}

            {infoMessage && (
                <div className="fixed-message info-message">
                    <div className="info-icon">ℹ️</div>
                    <div className="message-content">
                        <div className="message-title">
                            <span>Information</span>
                        </div>
                        <div className="message-text">{infoMessage}</div>
                    </div>
                    <button
                        className="close-message-btn"
                        onClick={() => closeMessage('info')}
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="payment-header">
                <h1>Complete Your Payment</h1>
                <p>Secure checkout with High-level encryption</p>
            </div>

            {reservations.length === 0 ? (
                <div className="no-payments">
                    <div className="no-payments-icon">💰</div>
                    <h2>No Pending Payments</h2>
                    <p>You don't have any reservations to pay for.</p>
                    <div className="suggestions">
                        <p className="hint">Make a reservation first, then come back here to pay.</p>
                    </div>
                    <button
                        className="back-to-events-btn"
                        onClick={() => navigate('/events')}
                    >
                        Browse Events
                    </button>
                </div>
            ) : (
                <div className="payment-content">
                    {/* Messages inline */}
                    {error && (
                        <div className="inline-message error-message">
                            <span className="error-icon">!</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {paymentResult && (
                        <div className="inline-message success-message payment-success-animated">
                            <span className="success-icon">✓</span>
                            <div className="message-content">
                                <div className="message-title">
                                    <span>Payment Successful!</span>
                                </div>
                                <div className="message-text">
                                    <p>Amount: ${paymentResult.payment?.amount?.toFixed(2) || selectedReservation?.totalAmount.toFixed(2)}</p>
                                    <p>Status: {paymentResult.payment?.status || 'PAID'}</p>
                                    {paymentResult.payment?.id && (
                                        <p>Transaction ID: {paymentResult.payment.id}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Left Column: Reservations Summary */}
                    <div className="reservations-summary">
                        <div className="summary-header">
                            <h3>Your Reservations ({reservations.length})</h3>
                            <button
                                className="refresh-btn"
                                onClick={loadUserReservations}
                                disabled={isLoading}
                            >
                                ↻ Refresh
                            </button>
                        </div>

                        <div className="reservations-list">
                            {reservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className={`reservation-item ${selectedReservation?.id === reservation.id ? 'selected' : ''}`}
                                >
                                    <div
                                        className="reservation-info"
                                        onClick={() => setSelectedReservation(reservation)}
                                    >
                                        <h4>{reservation.eventTitle}</h4>
                                        <p className="reservation-details">
                                            <span className="quantity">{reservation.quantity} ticket(s)</span>
                                            <span className="price">@ ${reservation.ticketPrice} each</span>
                                        </p>
                                        <span className="reservation-date">
                                            Reserved on: {new Date(reservation.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="reservation-status">
                                            Status: <span className={`status-${reservation.status?.toLowerCase()}`}>
                                                {reservation.status}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="reservation-actions">
                                        <div className="reservation-amount">
                                            ${reservation.totalAmount.toFixed(2)}
                                        </div>
                                        <button
                                            className="cancel-reservation-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDeleteReservation(reservation);
                                            }}
                                            disabled={deletingReservation === reservation.id}
                                            title="Cancel this reservation"
                                        >
                                            {deletingReservation === reservation.id ? (
                                                <span className="small-spinner"></span>
                                            ) : (
                                                '✕'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="total-summary">
                            <div className="total-row">
                                <span>Total Amount to Pay:</span>
                                <span className="total-amount">${calculateTotal().toFixed(2)}</span>
                            </div>
                            <p className="total-hint">
                                {reservations.length} reservation{reservations.length !== 1 ? 's' : ''} pending
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Payment Form */}
                    <div className="payment-form-section">
                        <div className="selected-reservation-info">
                            {selectedReservation ? (
                                <>
                                    <h4>Paying for: {selectedReservation.eventTitle}</h4>
                                    <div className="reservation-detail">
                                        <span>Amount: <strong>${selectedReservation.totalAmount.toFixed(2)}</strong></span>
                                        <span>Quantity: {selectedReservation.quantity} ticket(s)</span>
                                    </div>
                                </>
                            ) : (
                                <div className="no-selection">
                                    <p>Select a reservation to pay</p>
                                </div>
                            )}
                        </div>

                        {selectedReservation && (
                            <>
                                <div className="payment-card">
                                    <div className="card-header">
                                        <div className="card-chip"></div>
                                        <div className="card-logo">VISA</div>
                                    </div>

                                    <div className="card-number-display">
                                        {formData.cardNumber || '•••• •••• •••• ••••'}
                                    </div>

                                    <div className="card-details">
                                        <div className="card-holder">
                                            <div className="card-label">CARD HOLDER</div>
                                            <div className="card-value">
                                                {formData.cardHolder || 'YOUR NAME'}
                                            </div>
                                        </div>
                                        <div className="card-expiry">
                                            <div className="card-label">EXPIRES</div>
                                            <div className="card-value">
                                                {formData.expiryDate || 'MM/YY'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="payment-form">
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            className="card-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Card Holder Name</label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            value={formData.cardHolder}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="card-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry Date (MM/YY)</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className="card-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>CVV</label>
                                            <div className="cvv-container">
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    maxLength="3"
                                                    className="cvv-input"
                                                    required
                                                />
                                                <div className="cvv-hint">3 digits on back</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="payment-actions">
                                        <button
                                            type="button"
                                            className="secondary-btn"
                                            onClick={() => navigate('/events')}
                                            disabled={isLoading}
                                        >
                                            Back to Events
                                        </button>

                                        <button
                                            type="submit"
                                            className="primary-btn"
                                            disabled={isLoading || !selectedReservation}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="lock-icon">🔒</span>
                                                    Pay ${selectedReservation.totalAmount.toFixed(2)}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="security-guarantee">
                                        <div className="security-icons">
                                            <span className="security-icon" title="256-bit encryption">🔒</span>
                                            <span className="security-icon" title="PCI compliant">🛡️</span>
                                            <span className="security-icon" title="Verified by VISA">✅</span>
                                        </div>
                                        <p className="security-text">
                                            Your payment is secure and encrypted. We never store your card details.
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && reservationToDelete && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <div className="delete-modal-header">
                            <h3>Cancel Reservation</h3>
                            <button
                                className="close-modal-btn"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setReservationToDelete(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="delete-modal-content">
                            <div className="warning-message">
                                <span className="warning-icon">⚠️</span>
                                <div>
                                    <p>Are you sure you want to cancel this reservation?</p>
                                    <div className="reservation-details-modal">
                                        <p><strong>Event:</strong> {reservationToDelete.eventTitle}</p>
                                        <p><strong>Tickets:</strong> {reservationToDelete.quantity}</p>
                                        <p><strong>Amount:</strong> ${reservationToDelete.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <p className="warning-text">
                                        This action cannot be undone. The tickets will be released back to available inventory.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="delete-modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setReservationToDelete(null);
                                }}
                                disabled={deletingReservation === reservationToDelete.id}
                            >
                                Keep Reservation
                            </button>
                            <button
                                className="confirm-delete-btn"
                                onClick={() => handleDeleteReservation(reservationToDelete.id)}
                                disabled={deletingReservation === reservationToDelete.id}
                            >
                                {deletingReservation === reservationToDelete.id ? (
                                    <>
                                        <span className="small-spinner"></span>
                                        Cancelling...
                                    </>
                                ) : (
                                    'Cancel Reservation'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;