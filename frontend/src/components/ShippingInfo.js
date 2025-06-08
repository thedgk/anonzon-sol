import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert
} from '@mui/material';

// Add PALETTE for consistent color usage
const PALETTE = {
  card: '#232B3B',
  cardBorder: '#2D3952',
  accent: '#FF9900',
  accent2: '#FFC247',
  accent3: '#21D4FD',
  text: '#F3F6FA',
  textSecondary: '#AEB6C3',
};

function ShippingInfo({ onNext, onBack, updateOrderData, shippingData: initialShippingData, products, resetForNewProduct }) {
  const [shippingData, setShippingData] = useState(initialShippingData || {
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setShippingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setShippingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!shippingData.name || !shippingData.address.street || 
        !shippingData.address.city || !shippingData.address.state || 
        !shippingData.address.zip || !shippingData.address.country) {
      setError('Please fill in all required fields');
      return;
    }

    updateOrderData({ shippingData });
    onNext();
  };

  const handleAddAnotherProduct = () => {
    // Save shipping data, then go back to product entry
    updateOrderData({ shippingData });
    resetForNewProduct();
  };

  return (
    <Box className="privacy-container">
      <Typography variant="h5" className="privacy-title" gutterBottom sx={{ color: 'var(--text-primary)' }}>
        Shipping Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={shippingData.name}
              onChange={handleChange}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <TextField
              fullWidth
              label="Email (optional)"
              name="email"
              value={shippingData.email}
              onChange={handleChange}
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <TextField
              fullWidth
              label="Phone (optional)"
              name="phone"
              value={shippingData.phone}
              onChange={handleChange}
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <Typography variant="h6" className="privacy-subtitle" sx={{ mt: 2, color: 'var(--text-primary)' }}>
              Shipping Address
            </Typography>
            <TextField
              fullWidth
              label="Street Address"
              name="address.street"
              value={shippingData.address.street}
              onChange={handleChange}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={shippingData.address.city}
              onChange={handleChange}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <TextField
              fullWidth
              label="State/Province"
              name="address.state"
              value={shippingData.address.state}
              onChange={handleChange}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              name="address.zip"
              value={shippingData.address.zip}
              onChange={handleChange}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={shippingData.address.country}
              onChange={handleChange}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
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
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onBack}
                className="privacy-button"
                sx={{
                  borderColor: 'var(--border-color)',
                  '&:hover': {
                    borderColor: 'var(--accent-color)',
                    backgroundColor: 'rgba(74, 158, 255, 0.08)'
                  }
                }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                className="privacy-button"
                sx={{
                  background: 'var(--privacy-gradient)',
                  '&:hover': {
                    background: 'var(--accent-color)'
                  }
                }}
              >
                Continue to Payment
              </Button>
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="privacy-card">
            <CardContent>
              <Typography variant="h6" className="privacy-subtitle" gutterBottom>
                Product Summary
              </Typography>
              {products && products.length > 0 ? (
                products.map((product, idx) => (
                  <Box 
                    key={idx} 
                    className="fade-in"
                    sx={{ 
                      mb: 3, 
                      display: 'flex', 
                      alignItems: 'center', 
                      bgcolor: 'var(--secondary-bg)', 
                      borderRadius: 2, 
                      p: 2, 
                      boxShadow: '0 1px 4px 0 rgba(16,22,36,0.10)'
                    }}
                  >
                    <Box sx={{ 
                      minWidth: 72, 
                      maxWidth: 72, 
                      minHeight: 72, 
                      maxHeight: 72, 
                      borderRadius: 2, 
                      overflow: 'hidden', 
                      bgcolor: 'var(--primary-bg)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mr: 2 
                    }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain', 
                          borderRadius: 8, 
                          background: 'var(--primary-bg)' 
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: 'var(--text-primary)', 
                          fontWeight: 600, 
                          fontSize: 15, 
                          mb: 0.5, 
                          lineHeight: 1.3, 
                          whiteSpace: 'normal', 
                          wordBreak: 'break-word' 
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'var(--accent-color)', 
                          fontWeight: 700, 
                          fontSize: 18, 
                          mb: 0.5 
                        }}
                      >
                        ${product.price}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: 'var(--text-secondary)' }}>
                  No products added yet.
                </Typography>
              )}
              <Button
                variant="outlined"
                onClick={handleAddAnotherProduct}
                className="privacy-button"
                sx={{
                  mt: 2,
                  borderRadius: 99,
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  '&:hover': {
                    borderColor: 'var(--accent-color)',
                    color: 'var(--accent-color)',
                    backgroundColor: 'rgba(74, 158, 255, 0.08)'
                  }
                }}
              >
                Add Another Product
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ShippingInfo; 