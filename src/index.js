require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Connection, PublicKey } = require('@solana/web3.js');

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const { sweepToMasterWallet } = require('./services/solanaService');
const PaymentSession = require('./models/PaymentSession');
const { decrypt } = require('./utils/cryptoUtils');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

// Routes
app.use('/api', orderRoutes);
app.use('/api', scrapeRoutes);
app.use('/helio-webhook', webhookRoutes);
app.use('/api/payments', paymentRoutes);

// Sweep endpoint (admin only, simple version)
app.post('/api/sweep', async (req, res) => {
  const masterWallet = process.env.MASTER_WALLET;
  if (!masterWallet) return res.status(500).json({ error: 'No master wallet set' });
  const paidSessions = await PaymentSession.find({ status: 'paid', swept: { $ne: true } });
  const results = [];
  for (const session of paidSessions) {
    try {
      const privateKey = decrypt(session.encryptedPrivateKey);
      const sweepResult = await sweepToMasterWallet(privateKey, masterWallet);
      if (sweepResult.success) {
        session.swept = true;
        await session.save();
      }
      results.push({ sessionId: session._id, ...sweepResult });
    } catch (err) {
      results.push({ sessionId: session._id, error: err.message });
    }
  }
  res.json({ results });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const heliusRpcUrl = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_RPC_KEY}`;
const heliusConnection = new Connection(heliusRpcUrl);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 