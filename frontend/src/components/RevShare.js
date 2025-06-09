import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, Grid } from '@mui/material';
import backgroundImg from './Background.webp';

const whiteText = { color: '#fff' };

const bgPositions = [
  { top: '10%', left: '8%', rotate: 15 },
  { top: '60%', left: '12%', rotate: 60 },
  { top: '25%', left: '70%', rotate: 120 },
  { top: '70%', left: '75%', rotate: 200 },
];

const RevShare = () => (
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
          Revenue Share
        </Typography>
        <Typography variant="h5" sx={{ color: 'var(--text-secondary)', mb: 4, fontWeight: 400, maxWidth: 700, mx: 'auto' }}>
          Anonzon is more than a marketplace — it's a machine that gives back to its community. Every sale fuels the ecosystem, and the most committed holders get rewarded directly.
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>How It Works</Typography>
              <Typography sx={{ color: '#fff', mb: 2 }}>
                Each week, 100% of Anonzon's platform revenue is split into two distinct tracks:
              </Typography>
              <List sx={{ color: '#fff', mb: 0 }}>
                <ListItem>
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>50% → Weekly Revenue Share</b></span>}
                    secondary={<span style={{ color: '#fff' }}>SOL is distributed to the top 100 Anonzon token holders. No staking. No claiming. If you're on the leaderboard, you get paid — automatically, every week.</span>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={<span style={{ color: '#fff' }}><b>50% → Daily Buy & Burn</b></span>}
                    secondary={<span style={{ color: '#fff' }}>Every day, we use a portion of revenue to buy back Anonzon tokens from the market and permanently burn them. Supply decreases daily, increasing scarcity for all holders.</span>}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>Holder Incentives</Typography>
              <List sx={{ color: '#fff', mb: 0 }}>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>Passive SOL payouts every week</span>} /></ListItem>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>Daily deflation of token supply via buybacks</span>} /></ListItem>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>On-chain transparency for every distribution and burn</span>} /></ListItem>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>No lockups or interaction needed — just hold and earn</span>} /></ListItem>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>Top 100 leaderboard determines eligibility</span>} /></ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>Distribution Schedule</Typography>
              <List sx={{ color: '#fff', mb: 0 }}>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>Revenue share: Paid in SOL every 7 days to eligible wallets</span>} /></ListItem>
                <ListItem><ListItemText primary={<span style={{ color: '#fff' }}>Buybacks: Executed daily and burned in real time</span>} /></ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(30,34,45,0.55)', backdropFilter: 'blur(18px)', border: '1.5px solid rgba(255,255,255,0.13)', textAlign: 'left', boxShadow: 'none', minHeight: 180 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'var(--accent-color)' }}>Why It Matters</Typography>
              <Typography sx={{ color: '#fff', mb: 1 }}>
                This model rewards loyalty while reducing supply. The longer you hold, the more you earn — and the stronger the token becomes. It's self-reinforcing value with no middlemen and no manual claiming.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Box>
);

export default RevShare; 