const axios = require('axios');
const cheerio = require('cheerio');
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

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
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      if (url.includes('amazon')) {
        return await this.scrapeAmazon($, url);
      } else if (url.includes('shopify')) {
        return await this.scrapeShopify($);
      } else {
        throw new Error('Unsupported store platform');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      throw new Error('Failed to scrape product information');
    }
  }

  async scrapeAmazon($, url) {
    const title = $('#productTitle').text().trim();

    // Try to extract price using Amazon's price structure
    let priceWhole = $('.a-price .a-price-whole').first().text().replace(/[^0-9]/g, '');
    let priceFraction = $('.a-price .a-price-fraction').first().text().replace(/[^0-9]/g, '');
    let priceSymbol = $('.a-price .a-price-symbol').first().text().trim();

    let priceText = '';
    if (priceWhole) {
      priceText = priceWhole;
      if (priceFraction) {
        priceText += '.' + priceFraction;
      } else {
        priceText += '.00';
      }
    }

    // Fallback to previous logic if not found
    if (!priceText || isNaN(parseFloat(priceText))) {
      const priceSelectors = [
        '.a-price .a-offscreen',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '.a-price-whole',
        '.a-price .a-offscreen',
        '.a-price[data-a-color="price"] .a-offscreen'
      ];
      for (const selector of priceSelectors) {
        const priceElement = $(selector).first();
        if (priceElement.length) {
          priceText = priceElement.text().replace(/[^0-9.,]/g, '');
          break;
        }
      }
    }

    // Use a-price-symbol for currency if available
    let detectedCurrency = priceSymbol || this.detectCurrency(priceText, $, url);
    // Map symbol to ISO code if possible
    if (detectedCurrency && detectedCurrency.length === 1) {
      detectedCurrency = currencySymbolMap[detectedCurrency] || detectedCurrency;
    }

    const price = parseFloat(priceText.replace(',', '.'));
    let priceUSD = price;
    let currency = detectedCurrency;

    // Debug logging
    console.log('Amazon scrape:', { price, detectedCurrency });

    if (currency && currency !== 'USD' && price > 0) {
      try {
        priceUSD = await this.convertToUSD(price, currency);
        console.log(`Converted ${price} ${currency} to ${priceUSD} USD`);
        currency = 'USD';
      } catch (err) {
        console.error('Currency conversion failed:', err);
      }
    }

    // Round USD price to 2 decimal places
    priceUSD = Math.round((priceUSD + Number.EPSILON) * 100) / 100;

    const image = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src');

    return {
      title,
      price: priceUSD,
      image,
      currency: 'USD',
      originalPrice: price,
      originalCurrency: detectedCurrency
    };
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