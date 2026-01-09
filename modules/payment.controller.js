const PaymentService = require('./payment.service');

class PaymentController {

  static async createPayment(req, res, next) {
    try {
      const payment = await PaymentService.createPayment(req.body);
      res.status(201).json(payment);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  static async confirmPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.confirmPayment(id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  static async refundPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.refundPayment(id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  static async getPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPayment(id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  static async getPaymentEvents(req, res, next) {
    try {
      const { id } = req.params;
      const events = await PaymentService.getPaymentEvents(id);
      res.json(events);
    } catch (err) {
      next(err);
    }
  }
  static async listPayments(req, res, next) {
    try {
      const payments = await PaymentService.listPayments();
      res.json(payments);
    } catch (err) {
        next(err);
    }
  }
}

module.exports = PaymentController;
