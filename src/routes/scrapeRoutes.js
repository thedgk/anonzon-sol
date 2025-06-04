const express = require('express');
const router = express.Router();
const scrapeService = require('../services/scrapeService');

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

module.exports = router; 