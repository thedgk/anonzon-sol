import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Container } from '@mui/material';

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'black', boxShadow: 'none', py: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 24 }}>
            ANONZON
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ fontWeight: 700, borderRadius: 3, px: 4, fontSize: 18 }}
            href="/app"
          >
            Open App
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={900} gutterBottom>
          SHOPPING, ANONYMOUS
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.4 }}>
          The concept is simple:<br />
          What if you could buy anything from Amazon or Shopify, using only crypto — no KYC, no accounts, fully anonymous.<br /><br />
          You paste a link to the product you want. You enter where it should be delivered. That's it. You're then shown a final price in USDC, pay discreetly on Solana, and the item arrives at your door — no questions asked.<br /><br />
          It's shopping for the new era:<br />
          <b>global, decentralized, anonymous.</b><br />
          No banks. No middlemen. Just you, your wallet, and the things you want.
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage; 