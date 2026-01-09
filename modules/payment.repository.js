const pool = require('../db/index');
const runTransaction = require('../db/transactions');

class PaymentRepository {
    static async createPayment(paymentData) {
        const { id, amount, currency, status, payment_method, provider, reference } = paymentData;
        const query = `
            INSERT INTO payments (id, amount, currency, status, payment_method, provider, reference)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const values = [id, amount, currency, status, payment_method, provider, reference];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
    static async getPaymentById(id) {
        const { rows } = await pool.query('SELECT * FROM payments WHERE id = $1;', [id]);
        return rows[0];
    }
    static async getPaymentByReference(reference) {
        const { rows } = await pool.query('SELECT * FROM payments WHERE reference = $1;', [reference]);
        return rows[0];
    }
    static async updatePaymentStatus(paymentId, newStatus, eventMetadata={}) {
        return runTransaction(async (client) => {
            const updateQuery = `
                UPDATE payments SET status = $1, updated_at = NOW()
                WHERE id = $2 RETURNING *;
            `;
            const updateValues = [newStatus, paymentId];
            const { rows } = await client.query(updateQuery, updateValues);
            const payment = rows[0];

            if (!payment) throw new Error(`Payment not found`);
            const eventQuery = `
                INSERT INTO payment_events (payment_id, event_type, metadata)
                VALUES ($1, $2, $3) RETURNING *;
            `;
            const eventValues = [paymentId, `STATUS_CHANGED_TO_${newStatus}`, eventMetadata];
            await client.query(eventQuery, eventValues);
            return payment;
        });
    }
    static async listPaymentEvents(paymentId) {
        const { rows } = await pool.query(
            'SELECT * FROM payment_events WHERE payment_id = $1 ORDER BY created_at DESC;', [paymentId]
        );
        return rows;
    }
    static async listAllPayments() {
        return pool.query('SELECT * FROM payments ORDER BY created_at DESC;');
    }
}

module.exports = PaymentRepository;