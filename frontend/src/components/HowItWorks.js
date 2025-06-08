import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const whiteText = { color: '#fff' };

const HowItWorks = () => (
  <>
    <Navbar />
    <Box sx={{ mt: 12, ...whiteText, textAlign: 'center', maxWidth: 700, mx: 'auto', px: 2 }}>
      <Typography variant="h3" gutterBottom sx={whiteText}>How it Works</Typography>
      <Typography variant="body1" sx={{ mb: 3, ...whiteText }}>
        The concept is simple:
      </Typography>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>
        What if you could buy anything from Amazon or Shopify, using only crypto — no KYC, no accounts, fully anonymous?
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, ...whiteText }}>
        With Anonzon, it's possible.
      </Typography>
      <List sx={{ textAlign: 'left', mb: 3 }}>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={<span style={whiteText}><b>1. Paste the Product Link</b></span>}
            secondary={<span style={whiteText}>Found something you want on Amazon or Shopify? Just drop the product link into our form — no signups, no tracking.</span>}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={<span style={whiteText}><b>2. Enter a Delivery Address</b></span>}
            secondary={<span style={whiteText}>Type where it should be shipped. We don't ask for your name or ID — just a valid shipping address.</span>}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={<span style={whiteText}><b>3. Get a Final Price in USDC</b></span>}
            secondary={<span style={whiteText}>We calculate: Product price, Shipping & taxes, A small Anonzon service fee. Your total is shown in USDC, payable discreetly via Solana.</span>}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={<span style={whiteText}><b>4. Pay Anonymously with Crypto</b></span>}
            secondary={<span style={whiteText}>We generate a unique Solana wallet address just for your order. Send the exact USDC amount — no banks, no middlemen.</span>}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={<span style={whiteText}><b>5. We Handle the Rest</b></span>}
            secondary={<span style={whiteText}>Our system buys the product and ships it directly to you using our own infrastructure. No receipts, no platform accounts — just seamless fulfillment.</span>}
          />
        </ListItem>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={<span style={whiteText}><b>6. Get Your Stuff. That's It.</b></span>}
            secondary={<span style={whiteText}>Track it on-chain. Wait for your delivery. No questions asked.</span>}
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>
        Shopping for the New Era
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, ...whiteText }}>
        Global. Decentralized. Anonymous.<br />
        No KYC. No banks. No surveillance.<br />
        Just you, your wallet, and the things you want.
      </Typography>
    </Box>
  </>
);

export default HowItWorks; 