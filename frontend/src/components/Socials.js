import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, List, ListItem, ListItemText, Divider, Link, Paper, Grid } from '@mui/material';
import backgroundImg from './Background.webp';

const whiteText = { color: '#fff' };

const bgPositions = [
  { top: '12%', left: '10%', rotate: 30 },
  { top: '50%', left: '60%', rotate: 110 },
  { top: '75%', left: '20%', rotate: 220 },
];

const Socials = () => (
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
          Socials
        </Typography>
        <Typography variant="h5" sx={{ color: 'var(--text-secondary)', mb: 4, fontWeight: 400, maxWidth: 700, mx: 'auto' }}>
          Stay plugged into Anonzon — where privacy meets culture and commerce moves in silence.
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>Twitter / X</Typography>
              <Typography sx={{ color: '#fff', mb: 2 }}>
                We keep things loud so you can shop quiet.
              </Typography>
              <List sx={{ color: '#fff', mb: 0 }}>
                <ListItem>
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>@anonzon_</b> <Link href="https://twitter.com/anonzon_" target="_blank" rel="noopener" sx={{ color: '#fff', textDecoration: 'underline' }}>Twitter</Link></span>}
                    secondary={<span style={{ color: '#fff' }}>Main account. Platform updates, drops, memes, and marketplace alpha.</span>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>@anonzonorders</b> <Link href="https://twitter.com/anonzonorders" target="_blank" rel="noopener" sx={{ color: '#fff', textDecoration: 'underline' }}>Twitter</Link></span>}
                    secondary={<span style={{ color: '#fff' }}>Live feed of real, anonymized orders. See what the underworld is buying — in real time.</span>}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>Discord</Typography>
              <Typography sx={{ color: '#fff', mb: 2 }}>
                Home of the real ones.<br />Alpha leaks, burner wallet support, feedback loops, and the occasional chaos.
              </Typography>
              <Typography sx={{ color: '#fff', mb: 2 }}>
                Join the Anonzon Discord: <Link href="https://discord.gg/YOURINVITE" target="_blank" rel="noopener" sx={{ color: '#fff', textDecoration: 'underline' }}>discord.gg/YOURINVITE</Link>
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Use a burner. Stay masked. Don't be weird.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Box>
);

export default Socials; 