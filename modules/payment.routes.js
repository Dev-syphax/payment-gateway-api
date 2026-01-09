const express = require('express');
const PaymentController = require('./payment.controller');

const router = express.Router();

router.post('/', PaymentController.createPayment);
router.post('/:id/confirm', PaymentController.confirmPayment);
router.post('/:id/refund', PaymentController.refundPayment);
router.get('/:id', PaymentController.getPayment);
router.get('/:id/events', PaymentController.getPaymentEvents);
router.get('/', PaymentController.listPayments);

module.exports = router;