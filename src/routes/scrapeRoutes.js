const express = require('express');
const router = express.Router();
const scrapeService = require('../services/scrapeService');

// Debug middleware to log all incoming requests
router.use((req, res, next) => {
  console.log('\n=== INCOMING REQUEST ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('========================\n');
  next();
});

// Check product endpoint
router.post('/check-product', async (req, res) => {
  console.log('\n=== CHECK-PRODUCT ROUTE HANDLER ===');
  console.log('Start time:', new Date().toISOString());
  console.log('Request body:', req.body);
  
  try {
    const { productUrl } = req.body;
    
    if (!productUrl) {
      console.error('❌ No URL provided in request');
      return res.status(400).json({ 
        success: false, 
        message: 'Product URL is required',
        receivedBody: req.body 
      });
    }

    console.log('🔍 Starting product check for URL:', productUrl);
    const startTime = Date.now();
    
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Scraping operation timed out after 25 seconds'));
      }, 25000);
    });

    // Race between scraping and timeout
    const result = await Promise.race([
      scrapeService.scrapeProduct(productUrl),
      timeoutPromise
    ]);
    
    const endTime = Date.now();
    console.log('✅ Product check completed');
    console.log('Duration:', endTime - startTime, 'ms');
    console.log('Result:', result);
    
    res.json({
      success: true,
      data: result,
      duration: endTime - startTime
    });
  } catch (error) {
    console.error('❌ Error in check-product route:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check product',
      error: error.message
    });
  }
});

module.exports = router; 