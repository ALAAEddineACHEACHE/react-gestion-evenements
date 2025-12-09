// src/mappers/paymentMapper.js
export const mapPaymentRequest = (form) => ({
    reservationId: form.reservationId,
    method: form.method || "CARD",
    cardNumber: form.cardNumber,
    cardHolder: form.cardHolder,
    expiryDate: form.expiryDate,
    cvv: form.cvv,
    amount: form.amount
});