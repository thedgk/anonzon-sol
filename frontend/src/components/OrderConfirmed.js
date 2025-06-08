import React from 'react';
import { Box, Typography } from '@mui/material';

function OrderConfirmed() {
  return (
    <Box className="privacy-container fade-in" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" className="privacy-title" gutterBottom>
        Order has been confirmed.
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
        Thank you for your purchase! Your order is being processed.
      </Typography>
    </Box>
  );
}

export default OrderConfirmed; 