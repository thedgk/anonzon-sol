import React, { useState, useEffect, useRef } from 'react';
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
  Autocomplete,
  Paper,
  Divider
} from '@mui/material';
import { GoogleMap, Marker } from '@react-google-maps/api';
// Removed useLoadScript to prevent DOM conflicts

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

const GOOGLE_MAPS_API_KEY = 'AIzaSyArrsSbCnKyupS_YKaCNBHJsf5wUnE_K3c';

// Global flag to prevent multiple loads
let googleMapsLoading = false;
let googleMapsLoaded = false;

function ShippingInfo({ onNext, onBack, updateOrderData, shippingData: initialShippingData, products, resetForNewProduct }) {
  console.log('🔍 ShippingInfo component rendering...');
  
  // Form state - this should always work
  const [shippingData, setShippingData] = useState({
    name: initialShippingData?.name || '',
    email: initialShippingData?.email || '',
    phone: initialShippingData?.phone || '',
    address: {
      street: initialShippingData?.address?.street || '',
      city: initialShippingData?.address?.city || '',
      state: initialShippingData?.address?.state || '',
      zip: initialShippingData?.address?.zip || '',
      country: initialShippingData?.address?.country || 'US'
    }
  });

  // Google Maps state - completely optional
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  const mapContainerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Simple timeout to try loading Google Maps (non-blocking)
  useEffect(() => {
    console.log('🔍 Starting Google Maps loading attempt...');
    
    // Set timeout to try Google Maps, but don't block the form
    const timeoutId = setTimeout(() => {
      console.log('⏰ Google Maps timeout reached, form is already available');
    }, 3000);

    // Try to load Google Maps as an enhancement only
    const loadGoogleMapsOptional = () => {
      try {
        // Check if already loaded
        if (window.google && window.google.maps) {
          console.log('✅ Google Maps already available');
          setShowGoogleMaps(true);
          clearTimeout(timeoutId);
          return;
        }

        // Check if script already exists
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          console.log('🔍 Google Maps script already exists, waiting...');
          return;
        }

        console.log('🔄 Loading Google Maps script...');
        
        // Create global callback
        window.initGoogleMapsSimple = () => {
          console.log('✅ Google Maps loaded successfully');
          setShowGoogleMaps(true);
          clearTimeout(timeoutId);
        };

        // Create script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsSimple&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
          console.log('❌ Google Maps failed to load, but form still works');
          clearTimeout(timeoutId);
        };
        
        document.head.appendChild(script);
        
      } catch (error) {
        console.log('❌ Error loading Google Maps:', error.message);
        clearTimeout(timeoutId);
      }
    };

    // Try loading Google Maps, but don't block anything
    loadGoogleMapsOptional();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Initialize Google Maps components when available
  useEffect(() => {
    if (!showGoogleMaps || !mapContainerRef.current) return;

    console.log('🗺️ Initializing Google Maps components...');

    const initializeMap = () => {
      try {
        // Create map
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 40.749933, lng: -73.98633 },
          zoom: 13,
          mapTypeControl: false,
        });

        // Get autocomplete input
        const input = document.getElementById('address-autocomplete');
        if (!input) {
          console.log('⚠️ Autocomplete input not found, retrying...');
          setTimeout(initializeMap, 500);
          return;
        }

        // Create autocomplete
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          fields: ['formatted_address', 'geometry', 'address_components'],
          types: ['address'],
          componentRestrictions: { country: 'us' }
        });

        // Create marker
        const marker = new window.google.maps.Marker({
          map: map,
          visible: false
        });

        // Add place changed listener
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry || !place.geometry.location) {
            console.log('⚠️ No geometry for selected place');
            return;
          }

          console.log('✅ Place selected:', place.formatted_address);

          // Parse address
          const components = place.address_components || [];
          let street = '', city = '', state = '', zip = '';

          components.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) {
              street = component.long_name + ' ';
            } else if (types.includes('route')) {
              street += component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('postal_code')) {
              zip = component.long_name;
            }
          });

          // Update form
          setShippingData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: street.trim(),
              city: city,
              state: state,
              zip: zip
            }
          }));

          // Update map
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          setSelectedPlace(place);
        });

        // Store refs
        mapRef.current = map;
        autocompleteRef.current = autocomplete;
        markerRef.current = marker;
        setMapsReady(true);
        
        console.log('✅ Google Maps initialized successfully');
        
      } catch (error) {
        console.log('❌ Error initializing Google Maps:', error.message);
      }
    };

    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, [showGoogleMaps]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
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
        [field]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', shippingData);
    
    // Validate required fields
    const requiredFields = ['name', 'address.street', 'address.city', 'address.state', 'address.zip'];
    const missingFields = requiredFields.filter(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return !shippingData[parent]?.[child]?.trim();
      }
      return !shippingData[field]?.trim();
    });
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    // Update order data and proceed
    updateOrderData({ shippingData });
    onNext();
  };

  console.log('🔍 Rendering form with state:', { showGoogleMaps, mapsReady });

  return (
    <div className="privacy-container">
      <Typography variant="h5" className="privacy-title" gutterBottom sx={{ color: 'var(--text-primary)' }}>
        Shipping Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full name or pseudonym"
              value={shippingData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            {/* Google Maps Section - Only show if loaded */}
            {showGoogleMaps && (
              <>
                <Typography variant="h6" className="privacy-subtitle" sx={{ mt: 2, mb: 2, color: 'var(--text-primary)' }}>
                  🗺️ Find Your Address
                </Typography>
                
                <Paper 
                  elevation={3} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    backgroundColor: 'rgba(30, 34, 45, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2
                  }}
                >
                  <TextField
                    fullWidth
                    id="address-autocomplete"
                    label="Search for your address"
                    placeholder="Type your address..."
                    className="privacy-input"
                    sx={{ 
                      mb: 2, 
                      input: { color: 'var(--text-primary) !important' }, 
                      label: { color: 'var(--text-secondary) !important' } 
                    }}
                  />
                  
                  <div
                    ref={mapContainerRef}
                    style={{
                      height: '250px',
                      width: '100%',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }}
                  />
                  
                  {selectedPlace && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      ✓ Address found and filled in the form below!
                    </Alert>
                  )}
                </Paper>
              </>
            )}

            <Typography variant="h6" className="privacy-subtitle" sx={{ mt: 2, mb: 2, color: 'var(--text-primary)' }}>
              {showGoogleMaps ? 'Or Enter Manually' : 'Enter Your Address'}
            </Typography>
            
            <TextField
              fullWidth
              label="Street Address"
              value={shippingData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            
            <TextField
              fullWidth
              label="City"
              value={shippingData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            
            <TextField
              fullWidth
              label="State"
              value={shippingData.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            
            <TextField
              fullWidth
              label="ZIP Code"
              value={shippingData.address.zip}
              onChange={(e) => handleInputChange('address.zip', e.target.value)}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            
            <TextField
              fullWidth
              label="Country"
              value={shippingData.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
              required
              className="privacy-input"
              sx={{ mb: 2, input: { color: 'var(--text-primary) !important' }, label: { color: 'var(--text-secondary) !important' } }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button 
                variant="outlined" 
                onClick={onBack}
                className="privacy-button"
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                className="privacy-button"
              >
                Continue
              </Button>
            </div>
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
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" className="privacy-subtitle" gutterBottom sx={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)', mb: 2 }}>
                Product Summary
              </Typography>
              {products && products.length > 0 ? (
                products.map((product, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <div style={{
                      minWidth: '84px',
                      maxWidth: '84px',
                      minHeight: '84px',
                      maxHeight: '84px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255,255,255,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '24px',
                    }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: 16, 
                          color: 'var(--text-primary)', 
                          lineHeight: 1.3, 
                          mb: 0.5 
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: 14, 
                          lineHeight: 1.4, 
                          mb: 1 
                        }}
                      >
                        {product.description}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: 18, 
                          color: 'var(--accent-color)' 
                        }}
                      >
                        ${product.price}
                      </Typography>
                    </div>
                  </div>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  No products selected
                </Typography>
              )}
              <Button
                variant="outlined"
                onClick={resetForNewProduct}
                sx={{ mt: 2, borderRadius: 99, borderColor: 'var(--border-color)', color: 'var(--text-secondary)', '&:hover': { borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'rgba(74, 158, 255, 0.08)' } }}
              >
                Add Another Product
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default ShippingInfo; 