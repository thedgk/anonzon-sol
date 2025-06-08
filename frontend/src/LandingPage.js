import React from 'react';
import { Box, Button, Typography, Container, Grid, useTheme, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components
const AnimatedBox = motion(Box);
const AnimatedTypography = motion(Typography);
const AnimatedGrid = motion(Grid);

// Recent Orders Carousel
const RecentOrdersCarousel = () => {
  const sampleOrders = [
    { id: 1, product: "iPhone 15 Pro", amount: "2.5 SOL", status: "Delivered" },
    { id: 2, product: "MacBook Air M4", amount: "5.2 SOL", status: "Processing" },
    { id: 3, product: "AirPods Pro", amount: "1.8 SOL", status: "Shipped" },
    { id: 4, product: "iPad Pro", amount: "3.7 SOL", status: "Processing" },
    { id: 5, product: "Apple Watch", amount: "2.1 SOL", status: "Delivered" },
  ];

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
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...sampleOrders, ...sampleOrders].map((order, index) => (
          <Paper
            key={`${order.id}-${index}`}
            sx={{
              p: 2,
              minWidth: 200,
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
              {order.product}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {order.amount} • {order.status}
            </Typography>
          </Paper>
        ))}
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
      overflow: 'hidden'
    }}>
      {/* Recent Orders Carousel */}
      <RecentOrdersCarousel />

      {/* Hero Section */}
      <AnimatedBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <AnimatedTypography 
                variant="h1" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #fff 30%, #a8a8a8 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  mb: 3,
                  lineHeight: 1.2
                }}
              >
                Shopping, Anonymous
              </AnimatedTypography>
              
              <AnimatedTypography 
                variant="h5" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                sx={{ 
                  mb: 4, 
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                The future of shopping is here. Buy anything from Amazon or Shopify using crypto — 
                no KYC, no accounts, fully anonymous.
              </AnimatedTypography>

              <AnimatedBox 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
              >
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: '#fff',
                    color: '#000',
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={handleBuyToken}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Buy Token
                </Button>
              </AnimatedBox>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <AnimatedBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '24px',
                    zIndex: -1
                  }
                }}
              >
                <Box sx={{
                  width: '100%',
                  height: 400,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} />
              </AnimatedBox>
            </Grid>
          </Grid>
        </Container>
      </AnimatedBox>

      {/* Process Flow Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Container maxWidth="lg">
          <AnimatedTypography
            variant="h2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            sx={{
              textAlign: 'center',
              mb: 6,
              color: '#fff',
              fontWeight: 700
            }}
          >
            How It Works
          </AnimatedTypography>
          <Grid container spacing={4}>
            <ProcessStep
              number="1"
              title="Paste Product Link"
              description="Simply paste the Amazon or Shopify product link you want to purchase."
              delay={0.2}
            />
            <ProcessStep
              number="2"
              title="Enter Delivery Details"
              description="Provide your delivery address and any special instructions."
              delay={0.4}
            />
            <ProcessStep
              number="3"
              title="Pay with SOL"
              description="Complete your purchase using Solana cryptocurrency."
              delay={0.6}
            />
            <ProcessStep
              number="4"
              title="Track Your Order"
              description="Monitor your order status and receive updates through your wallet."
              delay={0.8}
            />
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <AnimatedGrid
              item
              xs={12}
              md={3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  Simple Process
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  Paste a product link, enter delivery details, and pay in SOL. That's it.
                </Typography>
              </Box>
            </AnimatedGrid>
            <AnimatedGrid
              item
              xs={12}
              md={3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  Fully Anonymous
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  No KYC, no accounts needed. Your privacy is our priority.
                </Typography>
              </Box>
            </AnimatedGrid>
            <AnimatedGrid
              item
              xs={12}
              md={3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  Global Access
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  Shop from anywhere in the world with just your crypto wallet.
                </Typography>
              </Box>
            </AnimatedGrid>
            <AnimatedGrid
              item
              xs={12}
              md={3}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  Secure Delivery
        </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  Discreet packaging and secure shipping to protect your privacy.
        </Typography>
              </Box>
            </AnimatedGrid>
          </Grid>
      </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 