import { useState } from 'react';
import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/reservations";

export default function useReservation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour créer une réservation
    const createReservation = async (reservationData) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post(`${BASE_URL}/reserve`, reservationData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Reservation API response:', response.data);
            return response.data;

        } catch (err) {
            console.error('Create reservation error:', err);

            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Failed to create reservation';

            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour récupérer les réservations de l'utilisateur
    const getUserReservations = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.get(`${BASE_URL}/my-reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Votre backend retourne { success: true, reservations: [...] }
            if (response.data.success && Array.isArray(response.data.reservations)) {
                return {
                    success: true,
                    reservations: response.data.reservations
                };
            } else {
                throw new Error('Invalid response format from server');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch reservations';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createReservation,
        getUserReservations,
        isLoading,
        error
    };
}