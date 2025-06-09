import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Box, Button, Typography, Container, Grid, useTheme, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import backgroundImg from './components/Background.webp';

// Styled components
const AnimatedBox = motion(Box);
const AnimatedTypography = motion(Typography);
const AnimatedGrid = motion(Grid);

// Recent Orders Carousel
const RecentOrdersCarousel = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('https://anonzon-sol.onrender.com/api/tracked-urls/recent');
        const data = await res.json();
        if (data.success) {
          setOrders(data.items);
        }
      } catch (err) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      overflow: 'hidden',
      bgcolor: 'rgba(0,0,0,0.2)',
      py: 2
    }}>
      <AnimatedBox
        sx={{
          display: 'flex',
          gap: 4,
          px: 2,
        }}
        animate={{
          x: [0, -orders.length * 220],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: orders.length * 3,
            ease: 'linear',
          },
        }}
      >
        {[...orders, ...orders].map((order, index) => {
          const name = order.name ? order.name.split(' ').slice(0, 4).join(' ') : '';
          const sol = order.priceUSD ? (order.priceUSD / 155).toFixed(2) : '';
          return (
            <Paper
              key={index}
              sx={{
                p: 1,
                minWidth: 200,
                maxWidth: 200,
                minHeight: 100,
                maxHeight: 100,
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: '100%',
                mt: '7px',
                mb: '7px',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#fff', mb: 0.5, fontSize: 16, fontWeight: 600 }}>
                  {order.name ? order.name.slice(0, 16) : ''}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(74,158,255,0.95)', fontWeight: 700, fontSize: 15 }}>
                  {sol} SOL &bull; Processing
                </Typography>
              </Box>
              {order.image && (
                <img src={order.image} alt="product" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginLeft: 10 }} />
              )}
            </Paper>
          );
        })}
      </AnimatedBox>
    </Box>
  );
};

const ProcessStep = ({ number, title, description, delay }) => (
  <AnimatedGrid
    item
    xs={12}
    md={4}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <Typography sx={{ color: '#fff', fontWeight: 600 }}>{number}</Typography>
      </Box>
      <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
        {description}
      </Typography>
    </Box>
  </AnimatedGrid>
);

const getRandomPositions = () => {
  return Array.from({ length: 8 }).map(() => ({
    top: Math.random() * 88 + '%', // 0% to 88% (so 512px fits in 100vh)
    left: Math.random() * 88 + '%', // 0% to 88% (so 512px fits in 100vw)
    rotate: Math.random() * 360,
  }));
};

// Use 6 fixed positions for background images
const bgPositions = [
  { top: '8%', left: '6%', rotate: 12 },
  { top: '60%', left: '10%', rotate: 44 },
  { top: '20%', left: '70%', rotate: 88 },
  { top: '65%', left: '65%', rotate: 120 },
  { top: '40%', left: '40%', rotate: 200 },
  { top: '75%', left: '92%', rotate: 300 },
];

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleBuyToken = () => {
    // Add token purchase functionality here
    window.open('https://raydium.io/swap', '_blank');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'var(--primary-bg)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Render 6 fixed background images */}
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
        <Box sx={{ mt: { xs: 7, md: 8 }, mb: '10px' }}>
          <RecentOrdersCarousel />
        </Box>

        {/* Hero Section */}
        <Container maxWidth="md" sx={{ pb: 8, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: 36, md: 56 }, letterSpacing: -1, color: 'var(--text-primary)' }}>
            The Anonymous Shopping Experience
          </Typography>
          <Typography variant="h5" sx={{ color: 'var(--text-secondary)', mb: 4, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            Buy anything online, pay with crypto, and keep your privacy. No accounts. No tracking. Just paste a link and relax.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.7,
              fontWeight: 800,
              fontSize: 20,
              background: 'linear-gradient(90deg, #FFB366 0%, #FF8C42 100%)',
              color: '#fff',
              boxShadow: '0 6px 32px 0 rgba(255,140,66,0.13)',
              textTransform: 'none',
              letterSpacing: 0.5
            }}
            onClick={handleGetStarted}
          >
            Start Your First Order
          </Button>
        </Container>

        {/* Feature Highlights */}
        <Container maxWidth="md" sx={{ mb: 10 }}>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 180 }}>
                <Box sx={{ fontSize: 40, mb: 1 }}>⚡️</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--accent-color)' }}>Lightning Fast</Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>Order in seconds. We handle the rest, fast.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 180 }}>
                <Box sx={{ fontSize: 40, mb: 1 }}>🔒</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--accent-color)' }}>Truly Private</Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>No KYC. No accounts. No data sold. Ever.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 180 }}>
                <Box sx={{ fontSize: 40, mb: 1 }}>★</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--accent-color)' }}>Loved by Users</Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>Hundreds of happy, privacy-first shoppers.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* How It Works */}
        <Container maxWidth="md" sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 5, textAlign: 'center', color: 'var(--text-primary)' }}>
            How It Works
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 140 }}>
                <Box sx={{ fontSize: 32, mb: 1 }}>🛒</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--accent-color)' }}>Paste Link</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Paste any product link.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 140 }}>
                <Box sx={{ fontSize: 32, mb: 1 }}>📍</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--accent-color)' }}>Enter Address</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Just your delivery address.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 140 }}>
                <Box sx={{ fontSize: 32, mb: 1 }}>💸</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--accent-color)' }}>Pay with Crypto</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>We handle the rest.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'center', boxShadow: 'none', minHeight: 140 }}>
                <Box sx={{ fontSize: 32, mb: 1 }}>🚚</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--accent-color)' }}>Track & Receive</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Get updates, stay private.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Social Proof / Testimonials */}
        <Container maxWidth="md" sx={{ mb: 10 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 5, textAlign: 'center', color: 'var(--text-primary)' }}>
            Loved by Privacy-First Shoppers
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', boxShadow: 'none' }}>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                  "I never thought shopping online could be this private and easy. Anonzon is a game changer."
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'var(--accent-color)', fontWeight: 700 }}>@anonshopper</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', boxShadow: 'none' }}>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                  "No KYC, no accounts, just pure privacy. I recommend Anonzon to everyone."
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'var(--accent-color)', fontWeight: 700 }}>@cryptofriend</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Final CTA */}
        <Container maxWidth="md" sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: 'var(--text-primary)' }}>
            Ready to try private shopping?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.7,
              fontWeight: 800,
              fontSize: 20,
              background: 'linear-gradient(90deg, #FFB366 0%, #FF8C42 100%)',
              color: '#fff',
              boxShadow: '0 6px 32px 0 rgba(255,140,66,0.13)',
              textTransform: 'none',
              letterSpacing: 0.5
            }}
            onClick={handleGetStarted}
          >
            Start Your First Order
          </Button>
        </Container>

        {/* Footer */}
        <Box sx={{ py: 4, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 15, opacity: 0.7 }}>
          © {new Date().getFullYear()} Anonzon. Privacy-first shopping.
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage; 