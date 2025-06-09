const axios = require('axios');
const cheerio = require('cheerio');
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

// Debug logging for environment variables
console.log('\n=== SCRAPER INITIALIZATION ===');
console.log('ScraperAPI Key exists:', !!SCRAPER_API_KEY);
console.log('ScraperAPI Key length:', SCRAPER_API_KEY ? SCRAPER_API_KEY.length : 0);
console.log('Node version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('================================\n');

// Map common currency symbols to ISO codes
const currencySymbolMap = {
  '$': 'USD', // fallback, but can be AUD, CAD, etc. (try to detect from page)
  'A$': 'AUD',
  'C$': 'CAD',
  'CA$': 'CAD',
  'AU$': 'AUD',
  'NZ$': 'NZD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
  '₩': 'KRW',
  '₽': 'RUB',
  '₺': 'TRY',
  '₪': 'ILS',
  '₫': 'VND',
  '₱': 'PHP',
  '฿': 'THB',
  '₴': 'UAH',
  'R$': 'BRL',
  '₦': 'NGN',
  '₲': 'PYG',
  '₡': 'CRC',
  '₵': 'GHS',
  '₸': 'KZT',
  '₮': 'MNT',
  '₺': 'TRY',
  '₼': 'AZN',
  '₽': 'RUB',
  '₾': 'GEL',
  '₿': 'BTC',
};

class ScrapeService {
  async scrapeProduct(url) {
    console.log('\n=== SCRAPING REQUEST START ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Target URL:', url);
    console.log('Request ID:', Math.random().toString(36).substring(7));

    if (!SCRAPER_API_KEY) {
      console.error('❌ SCRAPER_API_KEY is not set in environment variables');
      throw new Error('SCRAPER_API_KEY is not set in environment variables');
    }

    try {
      // Step 1: URL Construction
      console.log('\n1️⃣ CONSTRUCTING SCRAPERAPI URL');
      const scraperApiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}&country_code=us&premium=true&fast=true&keep_headers=true`;
      console.log('Base URL:', 'http://api.scraperapi.com');
      console.log('Parameters:', {
        api_key: '***' + SCRAPER_API_KEY.slice(-4),
        url: url,
        country_code: 'us',
        premium: true,
        fast: true,
        keep_headers: true
      });
      
      // Step 2: Request Configuration
      console.log('\n2️⃣ CONFIGURING REQUEST');
      const requestConfig = {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        maxRedirects: 3
      };
      console.log('Request config:', {
        timeout: requestConfig.timeout,
        maxRedirects: requestConfig.maxRedirects,
        headers: requestConfig.headers
      });

      // Step 3: Making Request
      console.log('\n3️⃣ MAKING REQUEST TO SCRAPERAPI');
      console.log('Start time:', new Date().toISOString());
      const startTime = Date.now();
      
      const response = await axios.get(scraperApiUrl, requestConfig);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Step 4: Response Processing
      console.log('\n4️⃣ PROCESSING RESPONSE');
      console.log('End time:', new Date().toISOString());
      console.log('Duration:', duration, 'ms');
      console.log('Status:', response.status);
      console.log('Status text:', response.statusText);
      console.log('Response headers:', response.headers);
      console.log('Response size:', response.data.length, 'bytes');
      console.log('First 100 chars of response:', response.data.substring(0, 100));

      // Step 5: HTML Parsing
      console.log('\n5️⃣ PARSING HTML');
      const $ = cheerio.load(response.data);
      console.log('HTML loaded successfully');
      
      // Step 6: Product Processing
      console.log('\n6️⃣ PROCESSING PRODUCT');
      let result;
      if (url.includes('amazon')) {
        console.log('Processing Amazon product...');
        result = await this.scrapeAmazon($, url);
      } else if (url.includes('shopify')) {
        console.log('Processing Shopify product...');
        result = await this.scrapeShopify($);
      } else {
        console.error('❌ Unsupported store platform');
        throw new Error('Unsupported store platform');
      }
      
      console.log('\n=== SCRAPING REQUEST COMPLETE ===');
      console.log('Final result:', result);
      console.log('Total duration:', duration, 'ms');
      console.log('================================\n');
      
      return result;

    } catch (error) {
      console.error('\n❌ SCRAPING ERROR OCCURRED');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);
      
      if (error.response) {
        console.error('\nResponse details:');
        console.error('Status:', error.response.status);
        console.error('Status text:', error.response.statusText);
        console.error('Headers:', error.response.headers);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('\nRequest details:');
        console.error('Request made but no response received');
        console.error('Request config:', error.config);
      } else {
        console.error('\nError details:');
        console.error('Error occurred while setting up request');
        console.error('Error config:', error.config);
      }
      
      if (error.code === 'ECONNABORTED') {
        console.error('\n⏰ TIMEOUT ANALYSIS');
        console.error('Request timed out after 15 seconds');
        console.error('Possible causes:');
        console.error('1. ScraperAPI service issues');
        console.error('2. Network connectivity problems');
        console.error('3. ScraperAPI rate limiting');
        console.error('4. Target site blocking the request');
      }
      
      console.error('\n=== SCRAPING REQUEST FAILED ===');
      console.error('Timestamp:', new Date().toISOString());
      console.error('================================\n');
      
      throw new Error('Failed to scrape product information');
    }
  }

  async scrapeAmazon($, url) {
    const title = $('#productTitle').text().trim();

    // Primary price selectors in order of reliability
    const priceSelectors = [
      '#corePrice_feature_div .a-price .a-offscreen',  // Most reliable main price
      '#corePrice_feature_div .a-price[data-a-color="price"] .a-offscreen', // Backup main price
      '#priceblock_ourprice', // Legacy selector
      '#price_inside_buybox', // Buy box price
      '.a-price[data-a-color="price"] .a-offscreen' // Generic price
    ];

    let priceText = '';
    let priceElement = null;

    // Try each selector until we find a price
    for (const selector of priceSelectors) {
      priceElement = $(selector).first();
      if (priceElement.length) {
        priceText = priceElement.text().trim();
        console.log(`Found price with selector "${selector}":`, priceText);
        break;
      }
    }

    // If no price found, log error
    if (!priceText) {
      console.error('No price found with any selector');
      throw new Error('Could not find product price');
    }

    // Extract currency symbol and clean price text
    const currencyMatch = priceText.match(/^[^\d]*/);
    const priceSymbol = currencyMatch ? currencyMatch[0].trim() : '$';
    
    // Clean price text and convert to number
    const cleanPrice = priceText.replace(/[^0-9.,]/g, '').replace(',', '.');
    const price = parseFloat(cleanPrice);

    if (isNaN(price)) {
      console.error('Invalid price format:', priceText);
      throw new Error('Invalid price format');
    }

    // Detect currency
    const detectedCurrency = this.detectCurrency(priceText, $, url);
    let priceUSD = price;
    
    // Convert to USD if necessary
    if (detectedCurrency && detectedCurrency !== 'USD' && price > 0) {
      try {
        priceUSD = await this.convertToUSD(price, detectedCurrency);
        console.log(`Converted ${price} ${detectedCurrency} to ${priceUSD} USD`);
      } catch (err) {
        console.error('Currency conversion failed:', err);
        // Fall back to original price if conversion fails
        priceUSD = price;
      }
    }

    // Round USD price to 2 decimal places
    priceUSD = Math.round((priceUSD + Number.EPSILON) * 100) / 100;

    // Get the main product image
    const image = $('#landingImage').attr('src') || 
                 $('#imgBlkFront').attr('src') || 
                 $('.a-dynamic-image').first().attr('src');

    if (!image) {
      console.error('No product image found');
    }

    const result = {
      title,
      price: priceUSD,
      image,
      currency: 'USD',
      originalPrice: price,
      originalCurrency: detectedCurrency
    };

    console.log('Scraped product data:', result);
    return result;
  }

  async scrapeShopify($) {
    const title = $('h1.product-title').text().trim();
    const priceText = $('.product-price').text();
    const detectedCurrency = this.detectCurrency(priceText, $);
    const price = this.extractPrice(priceText);
    let priceUSD = price;
    let currency = detectedCurrency;
    if (currency !== 'USD' && price > 0) {
      priceUSD = await this.convertToUSD(price, currency);
      currency = 'USD';
    }
    const image = $('.product-featured-image img').attr('src');

    return {
      title,
      price: priceUSD,
      image,
      currency: 'USD',
      originalPrice: price,
      originalCurrency: detectedCurrency
    };
  }

  extractPrice(priceText) {
    if (!priceText) return 0;
    // Remove currency symbols and other non-numeric characters except decimal point
    const cleanPrice = priceText.replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice);
    return isNaN(price) ? 0 : price;
  }

  detectCurrency(priceText, $, url) {
    // Try to detect currency from price text
    if (!priceText) return 'USD';
    // Check for explicit currency symbols
    for (const [symbol, code] of Object.entries(currencySymbolMap)) {
      if (priceText.includes(symbol)) return code;
    }
    // Try to detect from meta tags or page
    const metaCurrency = $("meta[itemprop='priceCurrency']").attr('content');
    if (metaCurrency) return metaCurrency;
    // Try to infer from Amazon domain
    if (url && url.includes('amazon.com.au')) return 'AUD';
    if (url && url.includes('amazon.co.uk')) return 'GBP';
    if (url && url.includes('amazon.de')) return 'EUR';
    if (url && url.includes('amazon.fr')) return 'EUR';
    if (url && url.includes('amazon.ca')) return 'CAD';
    if (url && url.includes('amazon.co.jp')) return 'JPY';
    // Default fallback
    return 'USD';
  }

  async convertToUSD(amount, currency) {
    if (!amount || !currency || currency.toUpperCase() === 'USD') return amount;
    try {
      const from = currency.toUpperCase();
      const apiKey = '9ab718253e53c36ac7a22f4c';
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
      console.log('Currency conversion URL:', url);
      const res = await axios.get(url);
      console.log('Currency conversion response:', res.data);
      if (res.data && res.data.conversion_rates && res.data.conversion_rates[from]) {
        // To convert from EUR to USD: USD = amount / rate[EUR]
        const rate = res.data.conversion_rates[from];
        const usdAmount = amount / rate;
        return usdAmount;
      }
      return amount;
    } catch (err) {
      console.error('Currency conversion error:', err);
      return amount;
    }
  }
}

module.exports = new ScrapeService(); 
//