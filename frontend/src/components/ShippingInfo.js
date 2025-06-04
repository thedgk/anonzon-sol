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
    <Box>
      <Typography variant="h5" gutterBottom>
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email (optional)"
              name="email"
              value={shippingData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone (optional)"
              name="phone"
              value={shippingData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Shipping Address
            </Typography>
            <TextField
              fullWidth
              label="Street Address"
              name="address.street"
              value={shippingData.address.street}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={shippingData.address.city}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="State/Province"
              name="address.state"
              value={shippingData.address.state}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              name="address.zip"
              value={shippingData.address.zip}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={shippingData.address.country}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={onBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Continue to Payment
              </Button>
            </Box>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Summary
              </Typography>
              {products && products.length > 0 ? (
                products.map((product, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={product.image}
                      alt={product.title}
                      sx={{ objectFit: 'contain', mb: 1 }}
                    />
                    <Typography variant="subtitle1">{product.title}</Typography>
                    <Typography variant="h6" color="primary">${product.price}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No products added yet.</Typography>
              )}
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleAddAnotherProduct}
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