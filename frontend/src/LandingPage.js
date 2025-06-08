import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Container } from '@mui/material';
import Navbar from './components/Navbar';

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--primary-bg)' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={900} gutterBottom sx={{ color: '#fff' }}>
          SHOPPING, ANONYMOUS
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, lineHeight: 1.4, color: '#fff' }}>
          The concept is simple:<br />
          What if you could buy anything from Amazon or Shopify, using only crypto — no KYC, no accounts, fully anonymous.<br /><br />
          You paste a link to the product you want. You enter where it should be delivered. That's it. You're then shown a final price in SOL, pay discreetly on Solana, and the item arrives at your door — no questions asked.<br /><br />
          It's shopping for the new era:<br />
          <b>global, decentralized, anonymous.</b><br />
          No banks. No middlemen. Just you, your wallet, and the things you want.
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage; 