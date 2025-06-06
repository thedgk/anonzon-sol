const express = require('express');
const router = express.Router();
const scrapeService = require('../services/scrapeService');
const helioService = require('../services/helioService');
const emailService = require('../services/emailService');
const geoip = require('geoip-lite');
const TrackedUrl = require('../models/TrackedUrl');

// Check product endpoint
router.post('/check-product', async (req, res) => {
  try {
    const { productUrl } = req.body;
    
    if (!productUrl) {
      return res.status(400).json({
        success: false,
        message: 'Product URL is required'
      });
    }

    // Scrape product information
    const productInfo = await scrapeService.scrapeProduct(productUrl);

    // Save the checked URL and product info to MongoDB
    await TrackedUrl.findOneAndUpdate(
      { url: productUrl },
      { url: productUrl, checkedAt: new Date(), productInfo },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      data: productInfo
    });
  } catch (error) {
    console.error('Product check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check product',
      error: error.message
    });
  }
});

// Create order endpoint
router.post('/order', async (req, res) => {
  try {
    const { productData, shippingData, pricing } = req.body;
    
    if (!productData || !shippingData || !pricing) {
      return res.status(400).json({
        success: false,
        message: 'Missing required data'
      });
    }

    // Get client's IP and determine shipping origin
    const clientIp = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(clientIp);
    const shippingOrigin = geo ? geo.country : 'US';

    // Convert to SOL using Binance
    const solAmount = await helioService.convertToSOL(pricing.totalPrice);

    // Create Helio payment link
    const paymentLink = await helioService.createPaymentLink({
      amount: solAmount,
      currency: 'SOL',
      metadata: {
        productData,
        shippingData,
        pricing,
        shippingOrigin
      }
    });

    // Save order to database/file
    const order = {
      id: Date.now().toString(),
      status: 'pending',
      productData,
      shippingData,
      pricing: {
        ...pricing,
        solAmount
      },
      paymentLink,
      shippingOrigin,
      createdAt: new Date()
    };

    console.log('Order created:', order);

    res.json({
      success: true,
      data: {
        paymentLink,
        solAmount
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

module.exports = router; 