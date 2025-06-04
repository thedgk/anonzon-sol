# Solana Amazon Backend Server

A Node.js backend server that processes orders from Amazon and Shopify, converts prices to USDC, and handles payments through Helio.

## Features

- Product scraping from Amazon and Shopify
- Price conversion to USDC using CoinGecko
- Payment processing through Helio
- Email notifications for successful orders
- IP-based shipping origin detection
- Webhook handling for payment confirmations

## Prerequisites

- Node.js (v14 or higher)
- npm
- API keys for:
  - Helio
  - CoinGecko
  - SendGrid

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solana-amazon
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
HELIO_API_KEY=your_helio_api_key
COINGECKO_API_KEY=your_coingecko_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
ADMIN_EMAIL=your_admin_email@example.com
```

## Running the Server

Start the server:
```bash
node src/index.js
```

The server will start on port 3000 (or the port specified in your .env file).

## API Endpoints

### POST /order
Creates a new order and returns payment information.

Request body:
```json
{
  "productUrl": "https://amazon.com/product-url",
  "name": "Customer Name",
  "address": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zip": "12345",
    "country": "Country"
  }
}
```

### POST /helio-webhook
Handles payment notifications from Helio.

## Error Handling

The server includes comprehensive error handling for:
- Invalid requests
- Scraping failures
- API errors
- Payment processing issues

## Security

- Helmet.js for security headers
- CORS enabled
- Environment variable protection
- Webhook signature verification

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 