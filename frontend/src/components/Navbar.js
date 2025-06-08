import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      component={motion.div}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: scrolled 
          ? 'rgba(0, 0, 0, 0.8)'
          : 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : 'none',
        boxShadow: 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: '64px', md: '80px' },
          px: { xs: 2, md: 4 },
          maxWidth: '1400px',
          mx: 'auto',
          width: '100%',
        }}
      >
        <Box 
          component={RouterLink}
          to="/"
          sx={{ 
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9
            }
          }}
        >
          <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontWeight: 800, 
              fontSize: { xs: 24, md: 28 }, 
              letterSpacing: 1,
              background: 'linear-gradient(45deg, #fff 30%, #a8a8a8 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ANONZON
          </Box>
        </Box>

        <Stack 
          direction="row" 
          spacing={{ xs: 2, md: 4 }}
          sx={{
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          <Button
            component={RouterLink}
            to="/revshare"
            variant="text"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              fontSize: { xs: 16, md: 18 },
              textTransform: 'none',
              px: 1,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
              }
            }}
          >
            Rev Share
          </Button>
          <Button
            component={RouterLink}
            to="/socials"
            variant="text"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              fontSize: { xs: 16, md: 18 },
              textTransform: 'none',
              px: 1,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
              }
            }}
          >
            Socials
          </Button>
          <Button
            component={RouterLink}
            to="/howitworks"
            variant="text"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              fontSize: { xs: 16, md: 18 },
              textTransform: 'none',
              px: 1,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
              }
            }}
          >
            How it Works
          </Button>
          <Button
            component={RouterLink}
            to="/app"
            variant="contained"
            sx={{
              fontSize: { xs: 16, md: 18 },
              fontWeight: 700,
              px: { xs: 3, md: 4 },
              py: 1.2,
              ml: { xs: 1, md: 2 },
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'none',
              textTransform: 'none',
              letterSpacing: 0.5,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Open App
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 