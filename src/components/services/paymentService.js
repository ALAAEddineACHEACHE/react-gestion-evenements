// src/services/paymentService.js
import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/payments";

export const paymentService = {
    // Créer un paiement
    createPayment: async (paymentData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post(`${BASE_URL}/pay`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Payment service error:', error);
            throw error;
        }
    },

    // Récupérer les paiements de l'utilisateur
    getUserPayments: async () => {
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

            return response.data;
        } catch (error) {
            console.error('Get payments error:', error);
            throw error;
        }
    },

    // Récupérer les détails d'un paiement
    getPaymentById: async (paymentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.get(`${BASE_URL}/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Get payment by ID error:', error);
            throw error;
        }
    }
};

export default paymentService;