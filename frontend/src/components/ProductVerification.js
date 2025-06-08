import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Alert
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function ProductVerification({ onNext, updateOrderData }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null);

  const handleCheckProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/check-product`, { productUrl: url });
      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check product');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (product) {
      updateOrderData({ product });
      onNext();
    }
  };

  return (
    <Box className="privacy-container">
      <Typography variant="h5" className="privacy-title" gutterBottom sx={{ color: 'var(--text-primary)' }}>
        Enter Product URL
      </Typography>

      <form onSubmit={handleCheckProduct}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://amazon.com/product-url"
              required
              className="privacy-input"
              sx={{
                input: { color: 'var(--text-primary) !important' },
                label: { color: 'var(--text-secondary) !important' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--border-color)' },
                  '&:hover fieldset': { borderColor: 'var(--accent-color)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent-color)' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="privacy-button"
              sx={{
                background: 'var(--privacy-gradient)',
                '&:hover': {
                  background: 'var(--accent-color)'
                }
              }}
            >
              {loading ? 'Checking...' : 'Check Product'}
            </Button>
          </Grid>
        </Grid>
      </form>

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

      {product && (
        <Card className="privacy-card fade-in" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <CardMedia
            component="img"
            height="200"
            image={product.image}
            alt={product.title}
            sx={{ objectFit: 'contain', borderRadius: 3, width: 'auto', maxWidth: 320, mb: 2, background: 'none' }}
          />
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" className="privacy-subtitle" gutterBottom>
              {product.title}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ color: 'var(--accent-color)', fontWeight: 700 }}
            >
              ${product.price}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleConfirm}
                className="privacy-button"
                sx={{ mr: 1, background: 'var(--privacy-gradient)', '&:hover': { background: 'var(--accent-color)' } }}
              >
                Yes, add this product
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setProduct(null); setUrl(''); }}
                className="privacy-button"
                sx={{ borderColor: 'var(--border-color)', '&:hover': { borderColor: 'var(--accent-color)', backgroundColor: 'rgba(74, 158, 255, 0.08)' } }}
              >
                No, try again
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ProductVerification; 