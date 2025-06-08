import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const whiteText = { color: '#fff' };

const RevShare = () => (
  <>
    <Navbar />
    <Box sx={{ mt: 12, ...whiteText, textAlign: 'center', maxWidth: 700, mx: 'auto', px: 2 }}>
      <Typography variant="h3" gutterBottom sx={whiteText}>Revenue Share</Typography>
      <Typography variant="body1" sx={{ mb: 3, ...whiteText }}>
        Anonzon is more than a marketplace — it's a machine that gives back to its community. Every sale fuels the ecosystem, and the most committed holders get rewarded directly.
      </Typography>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>How It Works</Typography>
      <Typography variant="body1" sx={{ mb: 2, ...whiteText }}>
        Each week, 100% of Anonzon's platform revenue is split into two distinct tracks:
      </Typography>
      <List sx={{ textAlign: 'left', mb: 3 }}>
        <ListItem>
          <ListItemText
            primary={<span style={whiteText}><b>50% → Weekly Revenue Share</b></span>}
            secondary={<span style={whiteText}>SOL is distributed to the top 100 Anonzon token holders. No staking. No claiming. If you're on the leaderboard, you get paid — automatically, every week.</span>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<span style={whiteText}><b>50% → Daily Buy & Burn</b></span>}
            secondary={<span style={whiteText}>Every day, we use a portion of revenue to buy back Anonzon tokens from the market and permanently burn them. Supply decreases daily, increasing scarcity for all holders.</span>}
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>Holder Incentives</Typography>
      <List sx={{ textAlign: 'left', mb: 3 }}>
        <ListItem><ListItemText primary={<span style={whiteText}>Passive SOL payouts every week</span>} /></ListItem>
        <ListItem><ListItemText primary={<span style={whiteText}>Daily deflation of token supply via buybacks</span>} /></ListItem>
        <ListItem><ListItemText primary={<span style={whiteText}>On-chain transparency for every distribution and burn</span>} /></ListItem>
        <ListItem><ListItemText primary={<span style={whiteText}>No lockups or interaction needed — just hold and earn</span>} /></ListItem>
        <ListItem><ListItemText primary={<span style={whiteText}>Top 100 leaderboard determines eligibility</span>} /></ListItem>
      </List>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>Distribution Schedule</Typography>
      <List sx={{ textAlign: 'left', mb: 3 }}>
        <ListItem><ListItemText primary={<span style={whiteText}>Revenue share: Paid in SOL every 7 days to eligible wallets</span>} /></ListItem>
        <ListItem><ListItemText primary={<span style={whiteText}>Buybacks: Executed daily and burned in real time</span>} /></ListItem>
      </List>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>Why It Matters</Typography>
      <Typography variant="body1" sx={{ mb: 1, ...whiteText }}>
        This model rewards loyalty while reducing supply. The longer you hold, the more you earn — and the stronger the token becomes. It's self-reinforcing value with no middlemen and no manual claiming.
      </Typography>
    </Box>
  </>
);

export default RevShare; 