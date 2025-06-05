import React from 'react';
import { Box, Typography } from '@mui/material';

function OrderConfirmed() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Order has been confirmed.
      </Typography>
      <Typography variant="body1">
        Thank you for your purchase! Your order is being processed.
      </Typography>
    </Box>
  );
}

export default OrderConfirmed; 