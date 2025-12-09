// src/hooks/useReservation.js
import { useState } from 'react';
import axios from 'axios';
import { mapReservationRequest } from "../../mappers/reservationMapper";

const BASE_URL = "http://localhost:8080/api/reservations";

export default function useReservation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createReservation = async (reservationData) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const request = mapReservationRequest(reservationData);

            console.log('Creating reservation:', request);

            const response = await axios.post(`${BASE_URL}/reserve`, request, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Reservation response:', response.data);
            return response.data;

        } catch (err) {
            console.error('Reservation error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create reservation');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getUserReservations = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.get(`${BASE_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('User reservations:', response.data); // Log pour debug
            return response.data;

        } catch (err) {
            console.error('Get reservations error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch reservations');
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