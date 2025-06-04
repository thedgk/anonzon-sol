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
  Divider
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Payment({ onBack, orderData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [solPrice, setSolPrice] = useState(null);

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

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Calculate total pricing for all products
      const totalBase = orderData.products.reduce((sum, p) => sum + p.price, 0);
      const totalFees = calculateFees(totalBase);
      const response = await axios.post(`${API_BASE_URL}/order`, {
        productData: orderData.products,
        shippingData: orderData.shippingData,
        pricing: totalFees
      });
      if (response.data.success) {
        window.location.href = response.data.data.paymentLink;
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total and per-product fees
  const productFees = orderData.products.map((product) => calculateFees(product.price));
  const totalBase = orderData.products.reduce((sum, p) => sum + p.price, 0);
  const totalFees = calculateFees(totalBase);

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
                  onClick={handlePayment}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Processing...' : 'Pay with Helio'}
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
    </Box>
  );
}

export default Payment; 