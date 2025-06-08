import React from 'react';
import { AppBar, Toolbar, Box, Button, Stack } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      className="privacy-nav"
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #ececec',
        boxShadow: 'none',
      }}
    >
      <Toolbar 
        className="privacy-nav-content"
        sx={{ 
          justifyContent: 'space-between',
          minHeight: '64px',
          padding: '0 2rem',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontWeight: 900, 
          fontSize: 28, 
          letterSpacing: 1,
          color: '#222',
          fontFamily: 'Inter, sans-serif',
        }}>
          ANONZON
        </Box>
        <Stack 
          direction="row" 
          spacing={4}
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
              color: '#222',
              fontWeight: 500,
              fontSize: 18,
              textTransform: 'none',
              px: 1,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(0,0,0,0.04)',
                color: '#111',
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
              color: '#222',
              fontWeight: 500,
              fontSize: 18,
              textTransform: 'none',
              px: 1,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(0,0,0,0.04)',
                color: '#111',
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
              color: '#222',
              fontWeight: 500,
              fontSize: 18,
              textTransform: 'none',
              px: 1,
              minWidth: 0,
              '&:hover': {
                background: 'rgba(0,0,0,0.04)',
                color: '#111',
              }
            }}
          >
            How it Works
          </Button>
          <Button
            variant="contained"
            sx={{
              fontSize: 18,
              fontWeight: 700,
              px: 4,
              py: 1.2,
              ml: 2,
              background: '#222',
              color: '#fff',
              borderRadius: 999,
              boxShadow: 'none',
              textTransform: 'none',
              letterSpacing: 0.5,
              minWidth: 0,
              '&:hover': {
                background: '#111',
                color: '#fff',
              }
            }}
            href="/app"
          >
            Open App
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 