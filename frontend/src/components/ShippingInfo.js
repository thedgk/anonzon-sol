import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { useLoadScript } from '@react-google-maps/api';

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

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3WPPU1l0mvRnouXleJa3JZZknQBNGvLw';

const libraries = ['places'];

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
  const [isLoading, setIsLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      const input = document.getElementById('address-search');
      if (input) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        });

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          if (place.address_components) {
            let streetNumber = '';
            let streetName = '';
            let city = '';
            let state = '';
            let zip = '';
            let country = '';

            for (const component of place.address_components) {
              const types = component.types;

              if (types.includes('street_number')) {
                streetNumber = component.long_name;
              }
              if (types.includes('route')) {
                streetName = component.long_name;
              }
              if (types.includes('locality')) {
                city = component.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                state = component.short_name;
              }
              if (types.includes('postal_code')) {
                zip = component.long_name;
              }
              if (types.includes('country')) {
                country = component.long_name;
              }
            }

            setShippingData(prev => ({
              ...prev,
              address: {
                street: `${streetNumber} ${streetName}`.trim(),
                city,
                state,
                zip,
                country
              }
            }));
          }
        });

        setAutocomplete(autocompleteInstance);
      }
    }
  }, [isLoaded, loadError]);

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

  if (loadError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading Google Maps API. Please try again later.
      </Alert>
    );
  }

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
              label="Email (optional but used for confirmation and tracking)"
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
              id="address-search"
              label="Search Address"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
              placeholder="Start typing your address..."
            />
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
                  backgroundColor: 'var(--accent-color)',
                  '&:hover': {
                    backgroundColor: 'var(--accent-color-hover)'
                  }
                }}
              >
                Continue
              </Button>
            </Box>
          </form>
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
                      bgcolor: 'rgba(255,255,255,0.04)',
                      borderRadius: 4,
                      p: 2.5,
                      boxShadow: '0 2px 8px 0 rgba(16,22,36,0.10)',
                      transition: 'transform 0.15s',
                      '&:hover': { transform: 'scale(1.025)', boxShadow: '0 4px 16px 0 rgba(16,22,36,0.16)' },
                    }}
                  >
                    <Box sx={{
                      minWidth: 84,
                      maxWidth: 84,
                      minHeight: 84,
                      maxHeight: 84,
                      borderRadius: 3.5,
                      overflow: 'hidden',
                      bgcolor: 'rgba(255,255,255,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                      boxShadow: '0 2px 8px 0 rgba(16,22,36,0.10)',
                    }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: 16,
                          background: 'rgba(255,255,255,0.10)'
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: 17,
                          mb: 0.5,
                          lineHeight: 1.3,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          letterSpacing: 0.1,
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'var(--accent-color)',
                          fontWeight: 800,
                          fontSize: 22,
                          mb: 0.5,
                          letterSpacing: 0.2,
                          textShadow: '0 1px 8px rgba(255,153,0,0.10)'
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