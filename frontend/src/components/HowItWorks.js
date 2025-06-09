import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';
import backgroundImg from './Background.webp';

const whiteText = { color: '#fff' };

const bgPositions = [
  { top: '8%', left: '12%', rotate: 20 },
  { top: '60%', left: '15%', rotate: 80 },
  { top: '30%', left: '65%', rotate: 150 },
  { top: '75%', left: '85%', rotate: 270 },
];

const HowItWorks = () => (
  <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'var(--primary-bg)', overflow: 'hidden' }}>
    {bgPositions.map((pos, idx) => (
      <img
        key={idx}
        src={backgroundImg}
        alt="bg"
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: 512,
          height: 512,
          opacity: 0.12,
          zIndex: 0,
          pointerEvents: 'none',
          transform: `rotate(${pos.rotate}deg)`,
          filter: 'blur(0.5px)',
        }}
      />
    ))}
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <Box sx={{ mt: 12, textAlign: 'center', maxWidth: 900, mx: 'auto', px: 2 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#fff', fontWeight: 900, mb: 2 }}>
          How it Works
        </Typography>
        <Typography variant="h5" sx={{ color: 'var(--text-secondary)', mb: 4, fontWeight: 400, maxWidth: 700, mx: 'auto' }}>
          The concept is simple: What if you could buy anything from Amazon or Shopify, using only crypto — no KYC, no accounts, fully anonymous?
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <List sx={{ color: '#fff', mb: 0 }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>1. Paste the Product Link</b></span>}
                    secondary={<span style={{ color: '#fff' }}>Found something you want on Amazon? Just drop the product link into our form — no signups, no tracking.</span>}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>2. Enter a Delivery Address</b></span>}
                    secondary={<span style={{ color: '#fff' }}>Type where it should be shipped. We don't ask for your name or ID — just a valid shipping address.</span>}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>3. Get a Final Price in USDC</b></span>}
                    secondary={<span style={{ color: '#fff' }}>We calculate: Product price, Shipping & taxes, A small Anonzon service fee. Your total is shown in SOL, payable discreetly via Solana.</span>}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>4. Pay Anonymously with Crypto</b></span>}
                    secondary={<span style={{ color: '#fff' }}>We generate a unique Solana wallet address just for your order. Send the exact SOL amount — no banks, no middlemen.</span>}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>5. We Handle the Rest</b></span>}
                    secondary={<span style={{ color: '#fff' }}>Our system buys the product and ships it directly to you using our own infrastructure. No receipts, no platform accounts — just seamless fulfillment.</span>}
                  />
                </ListItem>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>6. Get Your Stuff. That's It.</b></span>}
                    secondary={<span style={{ color: '#fff' }}>Track it on-chain. Wait for your delivery. No questions asked.</span>}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>Shopping for the New Era</Typography>
              <Typography sx={{ color: '#fff', mb: 1 }}>
                Global. Decentralized. Anonymous.<br />No KYC. No banks. No surveillance.<br />Just you, your wallet, and the things you want.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Box>
);

export default HowItWorks; 