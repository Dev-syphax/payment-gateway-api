const { randomUUID } = require('crypto');
const PaymentRepository = require('./payment.repository');

class PaymentService {
    static async createPayment({ amount, currency, payment_method, provider, reference }) {
        const existing= await PaymentRepository.getPaymentByReference(reference);
        if (existing) return existing;
        const payment={
            id: randomUUID(),
            amount,
            currency,
            status: 'PENDING',
            payment_method,
            provider,
            reference,
        };
        return PaymentRepository.createPayment(payment);
    }
    static async confirmPayment(paymentId) {
        const payment = await PaymentRepository.getPaymentById(paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.status !== 'PENDING') {
            throw new Error(`Cannot confirm payment with status ${payment.status}`);
        }
        const providerResult = this.simulateProvider();
        const newStatus = providerResult.success ? 'SUCCESS' : 'FAILED';
        return PaymentRepository.updatePaymentStatus(paymentId, newStatus, providerResult);
    }
    static async refundPayment(paymentId) {
        const payment = await PaymentRepository.getPaymentById(paymentId);
        if (!payment) throw new Error('Payment not found');
        if (payment.status !== 'SUCCESS') {
            throw new Error(`Only successful payments can be refunded`);
        }
        return PaymentRepository.updatePaymentStatus(paymentId, 'REFUNDED', { reason: 'User requested refund' });
    }
    static async getPayment(paymentId) {
        const payment = await PaymentRepository.getPaymentById(paymentId);
        if (!payment) throw new Error('Payment not found');
        return payment;
    }
    static async getPaymentEvents(paymentId) {
        return PaymentRepository.listPaymentEvents(paymentId);
    }
    static async listPayments() {
        const { rows } = await PaymentRepository.listAllPayments();
        return rows;
    }
    static simulateProvider() {
        const success = Math.random() > 0.2;
        return {
            success,
            provider_reference: randomUUID(),
            processed_at: new Date().toISOString()
        };
    }
}
module.exports = PaymentService;