const express = require('express');
const { Keypair, Connection, PublicKey } = require('@solana/web3.js');
const QRCode = require('qrcode');
const PaymentSession = require('../models/PaymentSession');
const { encrypt, decrypt } = require('../utils/cryptoUtils');
// const emailService = require('../services/emailService');
// const heliusService = require('../services/heliusService');
const router = express.Router();

const heliusRpcUrl = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_RPC_KEY}`;
const heliusConnection = new Connection(heliusRpcUrl);

// POST /create-invoice
router.post('/create-invoice', async (req, res) => {
  const { email, amount, products } = req.body;
  if (!email || !amount) return res.status(400).json({ error: 'Missing email or amount' });

  // Generate Solana wallet
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = Buffer.from(keypair.secretKey).toString('hex');
  // For now, do NOT encrypt the private key
  // const encryptedPrivateKey = encrypt(privateKey);

  // Debug logging
  console.log('--- PAYMENT DEBUG ---');
  console.log('Unencrypted Private Key:', privateKey);
  console.log('Public Address:', publicKey);
  if (products) {
    console.log('Products:', JSON.stringify(products, null, 2));
  }
  console.log('---------------------');

  // Save session (store unencrypted private key for now)
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const session = await PaymentSession.create({
    email, amount, publicKey, encryptedPrivateKey: privateKey, expiresAt
  });

  // Generate QR code (solana:<address>?amount=<amount>)
  const qrData = `solana:${publicKey}?amount=${amount}`;
  const qrCodeUrl = await QRCode.toDataURL(qrData);

  res.json({
    sessionId: session._id,
    publicKey,
    qrCodeUrl
  });
});

// GET /check-payment/:sessionId
router.get('/check-payment/:sessionId', async (req, res) => {
  const session = await PaymentSession.findById(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Expire if needed
  if (session.status === 'pending' && session.expiresAt < new Date()) {
    session.status = 'expired';
    await session.save();
  }

  res.json({
    status: session.status,
    paidAt: session.paidAt,
    txHash: session.txHash,
    publicKey: session.publicKey,
    amount: session.amount
  });
});

// POST /verify-txn
router.post('/verify-txn', async (req, res) => {
  const { sessionId, txnInput } = req.body;
  if (!sessionId || !txnInput) {
    return res.status(400).json({ error: 'Missing sessionId or txnInput' });
  }

  // Extract transaction ID from input (handle Solscan link or raw ID)
  let txnId = txnInput.trim();
  // Regex to extract txn ID from Solscan link
  const solscanMatch = txnId.match(/solscan\.io\/tx\/([A-Za-z0-9]+)/);
  if (solscanMatch && solscanMatch[1]) {
    txnId = solscanMatch[1];
  }

  const session = await PaymentSession.findById(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    // Fetch transaction details from Helius
    const txn = await heliusConnection.getTransaction(txnId, { commitment: 'confirmed' });
    if (!txn) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if the transaction sent SOL to the session's public key
    const destPubkey = session.publicKey;
    let amountReceived = 0;
    for (const inst of txn.transaction.message.instructions) {
      if (
        inst.programId && typeof inst.programId.toBase58 === 'function' &&
        inst.programId.toBase58() === '11111111111111111111111111111111'
      ) {
        const parsed = inst.parsed || {};
        if (parsed.info && parsed.info.destination === destPubkey) {
          amountReceived += parseFloat(parsed.info.lamports) / 1e9;
        }
      } else if (inst.parsed && inst.parsed.info && inst.parsed.info.destination === destPubkey) {
        // Handle parsed instructions (for SOL transfers)
        amountReceived += parseFloat(inst.parsed.info.lamports) / 1e9;
      }
    }

    // Fallback: check post balances if above fails
    if (amountReceived === 0) {
      const accountKeys = txn.transaction.message.accountKeys.map(k => k.toBase58());
      const destIdx = accountKeys.indexOf(destPubkey);
      if (destIdx !== -1) {
        const pre = txn.meta.preBalances[destIdx];
        const post = txn.meta.postBalances[destIdx];
        amountReceived = (post - pre) / 1e9;
      }
    }

    // Accept if amountReceived is at least (session.amount - 0.01)
    const minAcceptable = session.amount - 0.01;
    if (amountReceived >= minAcceptable) {
      session.status = 'paid';
      session.txHash = txnId;
      session.paidAt = new Date();
      await session.save();
      return res.json({ success: true, message: 'Payment verified', amountReceived });
    } else {
      return res.status(400).json({ success: false, message: `Insufficient amount received. Minimum accepted: ${minAcceptable} SOL`, amountReceived });
    }
  } catch (err) {
    console.error('Error verifying transaction:', err.message);
    return res.status(500).json({ error: 'Failed to verify transaction', details: err.message });
  }
});

// Webhook for Helius (to be implemented)
// router.post('/helius-webhook', ...);

module.exports = router; 