// src/hooks/usePayment.js
import { useState } from 'react';
import paymentService from '../services/paymentService';

export default function usePayment() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);

    const processPayment = async (paymentData) => {
        setIsLoading(true);
        setError(null);
        setPaymentResult(null);

        try {
            const result = await paymentService.createPayment(paymentData);
            setPaymentResult(result);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getUserPayments = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await paymentService.getUserPayments();
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch payments';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        processPayment,
        getUserPayments,
        isLoading,
        error,
        paymentResult
    };
}