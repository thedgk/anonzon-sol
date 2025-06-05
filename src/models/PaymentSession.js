const mongoose = require('mongoose');

const PaymentSessionSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  publicKey: String,
  encryptedPrivateKey: String,
  status: { type: String, enum: ['pending', 'paid', 'expired'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  txHash: String,
  paidAt: Date
});

module.exports = mongoose.model('PaymentSession', PaymentSessionSchema); 