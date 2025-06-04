const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

router.post('/', async (req, res) => {
  try {
    const { event, data } = req.body;

    // Verify the webhook signature (implement your verification logic)
    // await helioService.verifyWebhookSignature(req);

    if (event === 'payment.success') {
      const { orderId, amount, currency } = data;

      // Update order status in database/file
      // await orderService.updateOrderStatus(orderId, 'paid');

      // Get order details
      // const order = await orderService.getOrder(orderId);

      // Send email notification to admin
      await emailService.sendOrderConfirmation({
        orderId,
        amount,
        currency,
        // Include other order details
      });

      res.json({ success: true, message: 'Webhook processed successfully' });
    } else {
      res.json({ success: true, message: 'Webhook received but no action taken' });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message
    });
  }
});

module.exports = router; 