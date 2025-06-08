import React from 'react';
import { AppBar, Toolbar, Box, Button, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar 
      position="fixed" 
      elevation={1} 
      className="privacy-nav"
      sx={{
        backgroundColor: 'var(--primary-bg)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <Toolbar 
        className="privacy-nav-content"
        sx={{ 
          justifyContent: 'space-between',
          minHeight: '64px',
          padding: '0 2rem'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontWeight: 900, 
          fontSize: 28, 
          letterSpacing: 1,
          background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ANONZON
        </Box>
        <Stack 
          direction="row" 
          spacing={2}
          sx={{
            marginLeft: 'auto' // This ensures buttons are pushed to the right
          }}
        >
          <Button
            variant="outlined"
            className="privacy-button"
            sx={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              '&:hover': {
                borderColor: 'var(--accent-color)',
                backgroundColor: 'rgba(74, 158, 255, 0.08)',
                color: 'var(--accent-color)'
              }
            }}
            href="#token-purchase"
          >
            Token Purchase
          </Button>
          <Button
            variant="contained"
            className="privacy-button"
            sx={{
              background: 'var(--privacy-gradient)',
              color: 'var(--text-primary)',
              '&:hover': {
                background: 'var(--accent-color)',
                color: 'var(--text-primary)'
              }
            }}
            href="#how-it-works"
          >
            How it Works
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 