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
  Alert,
  Container,
  Paper,
  IconButton,
  Divider,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import axios from 'axios';
import config from '../config';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Detailed debugging of environment variables
console.log('All env variables:', process.env);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Configure axios defaults
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: 'currentColor',
        },
      },
    },
  },
});

const ProductVerification = ({ onNext, onAddMultiple, updateOrderData, cartItems, onAddToCart, onRemoveFromCart }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/check-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productUrl: url }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to verify product');
      }

      setResult(responseData.data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (result) {
      onAddToCart(result);
      setResult(null);
      setUrl('');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleFinish = () => {
    if (cartItems.length > 0) {
      onAddMultiple(cartItems);
    } else if (result) {
      onNext(result);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: 'rgba(30, 34, 45, 0.9)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,255,255,0.13)',
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            color: '#fff',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
            Add Products {cartItems.length > 0 && `(${cartItems.length} added)`}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Product URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
              fullWidth
              sx={{
                background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
                color: '#fff',
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(90deg, var(--accent-color-hover) 0%, var(--accent-color) 100%)',
                }
              }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card sx={{
              background: 'rgba(30, 34, 45, 0.55)',
              backdropFilter: 'blur(18px)',
              border: '1.5px solid rgba(255,255,255,0.13)',
              borderRadius: 2,
              color: '#fff',
              mt: 3,
            }}>
              <Box sx={{ display: 'flex', p: 2 }}>
                {result.image && (
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 1 }}
                    image={result.image}
                    alt={result.title}
                  />
                )}
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                    {result.title}
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'var(--accent-color)', fontWeight: 600 }}>
                    {result.currency} ${Number(result.price).toFixed(2)}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleAddToCart}
                      sx={{
                        background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(90deg, var(--accent-color-hover) 0%, var(--accent-color) 100%)',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setResult(null);
                        setUrl('');
                      }}
                      sx={{
                        borderColor: 'var(--accent-color)',
                        color: 'var(--accent-color)',
                        '&:hover': {
                          borderColor: 'var(--accent-color)',
                          background: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          )}

          {cartItems.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                Cart Items
              </Typography>
              {cartItems.map((item, index) => (
                <Card key={index} sx={{ 
                  mb: 2, 
                  background: 'rgba(30, 34, 45, 0.55)',
                  backdropFilter: 'blur(18px)',
                  border: '1.5px solid rgba(255,255,255,0.13)',
                  color: '#fff'
                }}>
                  <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 1 }}
                      image={item.image}
                      alt={item.title}
                    />
                    <Box sx={{ flex: 1, ml: 2 }}>
                      <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--accent-color)' }}>
                        {item.currency} ${Number(item.price).toFixed(2)}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => onRemoveFromCart(index)}
                      size="small"
                      sx={{
                        borderColor: 'var(--accent-color)',
                        color: 'var(--accent-color)',
                        minWidth: 'auto',
                        px: 2,
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              ))}
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.13)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ color: 'var(--accent-color)' }}>
                  USD ${cartItems.reduce((total, item) => total + Number(item.price), 0).toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={() => onAddMultiple(cartItems)}
                fullWidth
                sx={{
                  background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color-hover) 100%)',
                  color: '#fff',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(90deg, var(--accent-color-hover) 0%, var(--accent-color) 100%)',
                  }
                }}
              >
                Proceed with {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ProductVerification; 