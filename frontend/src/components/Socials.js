import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, List, ListItem, ListItemText, Divider, Link } from '@mui/material';

const whiteText = { color: '#fff' };

const Socials = () => (
  <>
    <Navbar />
    <Box sx={{ mt: 12, ...whiteText, textAlign: 'center', maxWidth: 700, mx: 'auto', px: 2 }}>
      <Typography variant="h3" gutterBottom sx={whiteText}>Social</Typography>
      <Typography variant="body1" sx={{ mb: 3, ...whiteText }}>
        Stay plugged into Anonzon — where privacy meets culture and commerce moves in silence.
      </Typography>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>Twitter / X</Typography>
      <Typography variant="body1" sx={{ mb: 2, ...whiteText }}>
        We keep things loud so you can shop quiet.
      </Typography>
      <List sx={{ textAlign: 'left', mb: 3 }}>
        <ListItem>
          <ListItemText
            primary={<span style={whiteText}><b>@anonzon_</b> <Link href="https://twitter.com/anonzon_" target="_blank" rel="noopener" sx={{ color: '#fff', textDecoration: 'underline' }}>Twitter</Link></span>}
            secondary={<span style={whiteText}>Main account. Platform updates, drops, memes, and marketplace alpha.</span>}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<span style={whiteText}><b>@anonzonorders</b> <Link href="https://twitter.com/anonzonorders" target="_blank" rel="noopener" sx={{ color: '#fff', textDecoration: 'underline' }}>Twitter</Link></span>}
            secondary={<span style={whiteText}>Live feed of real, anonymized orders. See what the underworld is buying — in real time.</span>}
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 3, borderColor: '#fff' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, ...whiteText }}>Discord</Typography>
      <Typography variant="body1" sx={{ mb: 2, ...whiteText }}>
        Home of the real ones.<br />
        Alpha leaks, burner wallet support, feedback loops, and the occasional chaos.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, ...whiteText }}>
        Join the Anonzon Discord: <Link href="https://discord.gg/YOURINVITE" target="_blank" rel="noopener" sx={{ color: '#fff', textDecoration: 'underline' }}>discord.gg/YOURINVITE</Link>
      </Typography>
      <Typography variant="body2" sx={{ ...whiteText }}>
        Use a burner. Stay masked. Don't be weird.
      </Typography>
    </Box>
  </>
);

export default Socials; 