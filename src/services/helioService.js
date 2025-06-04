const axios = require('axios');

class HelioService {
  constructor() {
    this.apiKey = process.env.HELIO_API_KEY;
    this.baseUrl = 'https://api.helio.xyz'; // Replace with actual Helio API endpoint
  }

  async convertToSOL(fiatAmount) {
    try {
      // Get SOL/USDT price from Binance
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
        params: {
          symbol: 'SOLUSDT'
        }
      });

      // SOL price in USDT (which is approximately 1:1 with USD)
      const solPrice = parseFloat(response.data.price);
      
      // Convert fiat amount to SOL
      return fiatAmount / solPrice;
    } catch (error) {
      console.error('SOL conversion error:', error);
      throw new Error('Failed to convert price to SOL');
    }
  }

  async createPaymentLink({ amount, currency, metadata }) {
    try {
      // For testing purposes, return a mock payment link
      console.log('Creating mock payment link with:', { amount, currency, metadata });
      return `https://helio.xyz/pay/test-${Date.now()}`;
      
      // Uncomment this when you have a real Helio API key
      /*
      const response = await axios.post(
        `${this.baseUrl}/payment-links`,
        {
          amount,
          currency,
          metadata
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.paymentLink;
      */
    } catch (error) {
      console.error('Payment link creation error:', error);
      throw new Error('Failed to create payment link');
    }
  }

  async verifyWebhookSignature(req) {
    // For testing, always return true
    return true;
  }
}

module.exports = new HelioService(); 