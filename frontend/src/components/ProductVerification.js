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
    <Box>
      <Typography variant="h5" gutterBottom>
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
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Product'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {product && (
        <Card sx={{ mt: 3 }}>
          <CardMedia
            component="img"
            height="200"
            image={product.image}
            alt={product.title}
            sx={{ objectFit: 'contain' }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="h5" color="primary">
              ${product.price}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                sx={{ mr: 1 }}
              >
                Yes, add this product
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setProduct(null);
                  setUrl('');
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