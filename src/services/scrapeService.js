const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

// Read proxies from proxies.txt
const proxiesFilePath = path.join(__dirname, '../proxies.txt');
const proxies = fs.readFileSync(proxiesFilePath, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

// Blacklist cache for failed proxies
const blacklistedProxies = new Set();

// User-Agent rotation list
const userAgents = [
  // Chrome Win
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  // Chrome Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Chrome/124.0.0.0 Safari/605.1.15',
  // Firefox Win
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  // Firefox Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0',
  // Edge Win
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  // Safari Mac
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  // Chrome Linux
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  // Mobile Chrome
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  // Mobile Safari
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1'
];

function getRandomUserAgent() {
  const idx = Math.floor(Math.random() * userAgents.length);
  return userAgents[idx];
}

function getRandomProxy() {
  // Only choose from non-blacklisted proxies
  const availableProxies = proxies.filter(p => !blacklistedProxies.has(p));
  // If all proxies are blacklisted, clear blacklist and try again
  if (availableProxies.length === 0) {
    blacklistedProxies.clear();
    availableProxies.push(...proxies);
  }
  const idx = Math.floor(Math.random() * availableProxies.length);
  const [host, port, username, password] = availableProxies[idx].split(':');
  return { host, port, auth: { username, password }, proxyString: availableProxies[idx] };
}

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
    let lastError;
    const maxAttempts = proxies.length;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const proxyObj = getRandomProxy();
      const proxy = proxyObj;
      const userAgent = getRandomUserAgent(); // User-Agent rotation
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': userAgent, // Rotating User-Agent
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'DNT': '1',
            'Referer': url
          },
          proxy: {
            host: proxy.host,
            port: parseInt(proxy.port, 10),
            auth: proxy.auth
          },
          timeout: 15000
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
        lastError = error;
        // Blacklist this proxy for the rest of this scrape
        blacklistedProxies.add(proxy.proxyString);
        continue;
      }
    }
    console.error('Scraping error:', lastError);
    throw new Error('Failed to scrape product information after trying all proxies');
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
//