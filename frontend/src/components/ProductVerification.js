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

const API_BASE_URL = process.env.REACT_APP_API_URL;

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
          alignItems: 'center',
          justifyContent: 'center',
          mt: 4,
        }}>
          <CardMedia
            component="img"
            height="140"
            image={product.image}
            alt={product.title}
            sx={{
              width: 140,
              height: 140,
              objectFit: 'contain',
              borderRadius: 3.5,
              background: 'rgba(255,255,255,0.10)',
              boxShadow: '0 2px 8px 0 rgba(16,22,36,0.10)',
              mt: 3,
              mb: 2,
            }}
          />
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" className="privacy-subtitle" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', mb: 1 }}>
              {product.title}
            </Typography>
            <Typography variant="h5" sx={{ color: 'var(--accent-color)', fontWeight: 900, fontSize: 28, mb: 1, textShadow: '0 1px 8px rgba(255,153,0,0.10)' }}>
              ${product.price}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleConfirm}
                className="privacy-button"
                sx={{
                  borderRadius: 99,
                  background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 16,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 2px 8px 0 rgba(255,153,0,0.12)',
                  transition: 'all 0.18s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, var(--accent-color-hover) 0%, var(--accent-color) 100%)',
                    boxShadow: '0 4px 16px 0 rgba(255,153,0,0.18)',
                  }
                }}
              >
                Yes, add this product
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setProduct(null); setUrl(''); }}
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