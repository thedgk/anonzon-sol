import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Divider,
  Modal
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Payment({ onBack, orderData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [solPrice, setSolPrice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [txnInput, setTxnInput] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch SOL/USD price from Binance
    const fetchSolPrice = async () => {
      try {
        const res = await axios.get('https://api.binance.com/api/v3/ticker/price', {
          params: { symbol: 'SOLUSDT' }
        });
        setSolPrice(parseFloat(res.data.price));
      } catch (err) {
        setSolPrice(null);
      }
    };
    fetchSolPrice();
  }, []);

  useEffect(() => {
    if (paymentStatus === 'paid') {
      setVerifyResult((prev) => ({ ...prev, message: 'Redirecting...' }));
      const timer = setTimeout(() => {
        navigate('/order-confirmed');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  const calculateFees = (basePrice) => {
    const shippingFee = basePrice < 100 ? basePrice * 0.10 : 10;
    const merchantFee = basePrice * 0.02;
    const siteFee = basePrice * 0.02;
    const totalPrice = basePrice + shippingFee + merchantFee + siteFee;
    return {
      basePrice,
      shippingFee,
      merchantFee,
      siteFee,
      totalPrice
    };
  };

  // Calculate total and per-product fees
  const productFees = orderData.products.map((product) => calculateFees(product.price));
  const totalBase = orderData.products.reduce((sum, p) => sum + p.price, 0);
  const totalFees = calculateFees(totalBase);
  const solAmount = solPrice ? (totalFees.totalPrice / solPrice).toFixed(4) : null;

  const handlePayNow = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/create-invoice`, {
        email: orderData.shippingData.email || 'noemail@anon.com',
        amount: solAmount
      });
      setInvoice(response.data);
      setModalOpen(true);
      setPaymentStatus('pending');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create payment invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTxn = async () => {
    setVerifyLoading(true);
    setVerifyResult(null);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/payments/verify-txn`, {
        sessionId: invoice.sessionId,
        txnInput: txnInput.trim(),
      });
      setVerifyResult({ success: true, message: res.data.message, amountReceived: res.data.amountReceived });
      setPaymentStatus('paid');
    } catch (err) {
      setVerifyResult({ success: false, message: err.response?.data?.message || err.response?.data?.error || 'Verification failed' });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Payment
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {orderData.products.map((product, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={product.image}
                    alt={product.title}
                    sx={{ objectFit: 'contain', mb: 1 }}
                  />
                  <Typography variant="subtitle1">{product.title}</Typography>
                  <Typography variant="body2">USD: ${product.price.toFixed(2)} {solPrice && (
                    <>
                      &nbsp;|&nbsp; SOL: {(product.price / solPrice).toFixed(4)}
                    </>
                  )}</Typography>
                </Box>
              ))}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Shipping Information
              </Typography>
              <Typography>
                {orderData.shippingData.name}<br />
                {orderData.shippingData.address.street}<br />
                {orderData.shippingData.address.city}, {orderData.shippingData.address.state} {orderData.shippingData.address.zip}<br />
                {orderData.shippingData.address.country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Price Breakdown
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Base Price:</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      ${totalFees.basePrice.toFixed(2)}
                      {solPrice && (
                        <>&nbsp;|&nbsp;{(totalFees.basePrice / solPrice).toFixed(4)} SOL</>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Shipping Fee:</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      ${totalFees.shippingFee.toFixed(2)}
                      {solPrice && (
                        <>&nbsp;|&nbsp;{(totalFees.shippingFee / solPrice).toFixed(4)} SOL</>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Merchant Fee (2%):</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      ${totalFees.merchantFee.toFixed(2)}
                      {solPrice && (
                        <>&nbsp;|&nbsp;{(totalFees.merchantFee / solPrice).toFixed(4)} SOL</>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Site Fee (2%):</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      ${totalFees.siteFee.toFixed(2)}
                      {solPrice && (
                        <>&nbsp;|&nbsp;{(totalFees.siteFee / solPrice).toFixed(4)} SOL</>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1 }} />
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6">Total:</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      ${totalFees.totalPrice.toFixed(2)}
                      {solPrice && (
                        <>&nbsp;|&nbsp;{(totalFees.totalPrice / solPrice).toFixed(4)} SOL</>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onBack}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePayNow}
                  disabled={loading || !solAmount}
                  fullWidth
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Payment Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 350, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Send Payment</Typography>
          {invoice && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>Send exactly <b>{solAmount} SOL</b> to:</Typography>
              <Typography variant="body2" sx={{ mb: 2, wordBreak: 'break-all' }}>{invoice.publicKey}</Typography>
              <img src={invoice.qrCodeUrl} alt="QR Code" style={{ width: 180, marginBottom: 16 }} />
              <Typography variant="body2" sx={{ mb: 2 }}>Scan QR or copy address to pay from your wallet.</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>After sending payment, paste your transaction ID or Solscan link below:</Typography>
              <input
                type="text"
                value={txnInput}
                onChange={e => setTxnInput(e.target.value)}
                placeholder="Transaction ID or Solscan link"
                style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
                disabled={verifyLoading || paymentStatus === 'paid'}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerifyTxn}
                disabled={verifyLoading || !txnInput || paymentStatus === 'paid'}
                sx={{ mb: 2 }}
              >
                {verifyLoading ? 'Verifying...' : 'Submit Transaction'}
              </Button>
              {verifyResult && (
                <Alert severity={verifyResult.success ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {verifyResult.message}
                  {verifyResult.success && verifyResult.amountReceived && (
                    <><br />Amount received: {verifyResult.amountReceived} SOL</>
                  )}
                </Alert>
              )}
              <Button variant="outlined" onClick={() => setModalOpen(false)} sx={{ mt: 1 }}>Close</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default Payment; 