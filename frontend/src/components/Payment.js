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
  Modal,
  TextField,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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
        console.error('Failed to fetch SOL price:', err);
        setSolPrice(null);
      }
    };
    fetchSolPrice();

    // Refresh price every minute
    const interval = setInterval(fetchSolPrice, 60000);
    return () => clearInterval(interval);
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
      // TODO: Implement actual payment processing
      // This is a placeholder for future implementation
      console.log('Payment initiated with:', {
        orderData,
        totalAmount: totalFees.totalPrice,
        solAmount,
        timestamp: new Date().toISOString()
      });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setModalOpen(true);
      setPaymentStatus('pending');
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Payment error:', err);
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

  const PaymentModal = () => (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="payment-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        bgcolor: 'rgba(30, 34, 45, 0.95)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
        color: 'white',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography id="payment-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Payment Instructions
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Amount to pay: {solAmount} SOL
        </Typography>
        <Typography sx={{ mb: 2, color: 'var(--accent-color)' }}>
          This is a placeholder for payment implementation.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={() => setModalOpen(false)}
          sx={{
            mt: 2,
            background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, var(--accent-color-hover) 0%, var(--accent-color) 100%)',
            }
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );

  return (
    <Box className="privacy-container">
      <Typography variant="h5" className="privacy-title" gutterBottom sx={{ color: 'var(--text-primary)' }}>
        Payment
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="privacy-card fade-in" sx={{
            background: 'rgba(30, 34, 45, 0.55)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,255,255,0.13)',
            borderRadius: 5,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            p: 0,
            overflow: 'visible',
            minHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" className="privacy-subtitle" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', mb: 2 }}>
                Order Summary
              </Typography>
              {orderData.products.map((product, idx) => (
                <Box key={idx} sx={{ mb: 3, display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 4, p: 2.5, boxShadow: '0 2px 8px 0 rgba(16,22,36,0.10)', transition: 'transform 0.15s', '&:hover': { transform: 'scale(1.025)', boxShadow: '0 4px 16px 0 rgba(16,22,36,0.16)' } }}>
                  <CardMedia
                    component="img"
                    height="84"
                    image={product.image}
                    alt={product.title}
                    sx={{ width: 84, objectFit: 'contain', borderRadius: 3.5, background: 'rgba(255,255,255,0.10)', boxShadow: '0 2px 8px 0 rgba(16,22,36,0.10)', mr: 3 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 17, mb: 0.5, lineHeight: 1.3, whiteSpace: 'normal', wordBreak: 'break-word', letterSpacing: 0.1 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: 22, mb: 0.5, letterSpacing: 0.2, textShadow: '0 1px 8px rgba(255,153,0,0.10)' }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    {solPrice && (
                      <Typography variant="body2" sx={{ color: 'var(--accent-color)', fontWeight: 500, fontSize: 15, opacity: 0.8 }}>
                        { (product.price / solPrice).toFixed(4) } SOL
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              <Typography variant="h6" className="privacy-subtitle" gutterBottom sx={{ mt: 2, fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
                Shipping Information
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: 16, mb: 1 }}>
                {orderData.shippingData.name}<br />
                {orderData.shippingData.address.street}<br />
                {orderData.shippingData.address.city}, {orderData.shippingData.address.state} {orderData.shippingData.address.zip}<br />
                {orderData.shippingData.address.country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="privacy-card fade-in" sx={{
            background: 'rgba(30, 34, 45, 0.55)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,255,255,0.13)',
            borderRadius: 5,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            p: 0,
            overflow: 'visible',
            minHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" className="privacy-subtitle" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', mb: 2 }}>
                Price Breakdown
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Grid item><Typography sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Base Price:</Typography></Grid>
                  <Grid item><Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>${totalFees.basePrice.toFixed(2)}{solPrice && (<>&nbsp;|&nbsp;{(totalFees.basePrice / solPrice).toFixed(4)} SOL</>)}</Typography></Grid>
                </Grid>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)', my: 0.5 }} />
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Grid item><Typography sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Shipping Fee:</Typography></Grid>
                  <Grid item><Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>${totalFees.shippingFee.toFixed(2)}{solPrice && (<>&nbsp;|&nbsp;{(totalFees.shippingFee / solPrice).toFixed(4)} SOL</>)}</Typography></Grid>
                </Grid>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)', my: 0.5 }} />
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Grid item><Typography sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Merchant Fee (2%):</Typography></Grid>
                  <Grid item><Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>${totalFees.merchantFee.toFixed(2)}{solPrice && (<>&nbsp;|&nbsp;{(totalFees.merchantFee / solPrice).toFixed(4)} SOL</>)}</Typography></Grid>
                </Grid>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.10)', my: 0.5 }} />
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Grid item><Typography sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Site Fee (2%):</Typography></Grid>
                  <Grid item><Typography sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>${totalFees.siteFee.toFixed(2)}{solPrice && (<>&nbsp;|&nbsp;{(totalFees.siteFee / solPrice).toFixed(4)} SOL</>)}</Typography></Grid>
                </Grid>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', my: 1 }} />
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item><Typography variant="h6" sx={{ color: 'var(--accent-color)', fontWeight: 900, fontSize: 22 }}>Total:</Typography></Grid>
                  <Grid item><Typography variant="h6" sx={{ color: 'var(--accent-color)', fontWeight: 900, fontSize: 22 }}>${totalFees.totalPrice.toFixed(2)}{solPrice && (<>&nbsp;|&nbsp;{(totalFees.totalPrice / solPrice).toFixed(4)} SOL</>)}</Typography></Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={onBack}
                  disabled={loading}
                  className="privacy-button"
                  sx={{
                    borderRadius: 99,
                    borderColor: 'var(--accent-color)',
                    color: 'var(--accent-color)',
                    fontWeight: 700,
                    fontSize: 16,
                    px: 4,
                    py: 1.5,
                    background: 'rgba(255,255,255,0.08)',
                    boxShadow: '0 2px 8px 0 rgba(255,153,0,0.08)',
                    transition: 'all 0.18s',
                    '&:hover': {
                      borderColor: 'var(--accent-color)',
                      color: '#fff',
                      background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
                      boxShadow: '0 4px 16px 0 rgba(255,153,0,0.16)',
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePayNow}
                  disabled={loading || !solPrice}
                  sx={{
                    background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
                    color: '#fff',
                    minWidth: 200,
                    '&:hover': {
                      background: 'linear-gradient(90deg, var(--accent-color-hover) 0%, var(--accent-color) 100%)',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    `Pay ${solAmount ? `${solAmount} SOL` : 'Now'}`
                  )}
                </Button>
              </Box>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    backgroundColor: 'rgba(245, 101, 101, 0.1)',
                    color: 'var(--error-color)',
                    border: '1px solid var(--error-color)'
                  }}
                >
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <PaymentModal />
    </Box>
  );
}

export default Payment; 