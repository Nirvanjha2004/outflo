import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, useTheme } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              color="text.primary" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Box component="span" sx={{ 
                bgcolor: theme.palette.primary.main,
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                mr: 1,
                fontWeight: 800
              }}>OUT</Box>
              FLO
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Automate your LinkedIn outreach and boost your sales with personalized messages.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex' }}>
              <Link href="#" color="inherit" sx={{ mr: 2 }}>
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit" sx={{ mr: 2 }}>
                <LinkedInIcon />
              </Link>
              <Link href="#" color="inherit">
                <GitHubIcon />
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Product
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Features
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Pricing
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Use Cases
            </Link>
            <Link href="#" color="inherit" display="block">
              Integrations
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Documentation
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Blog
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Guides
            </Link>
            <Link href="#" color="inherit" display="block">
              API
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              About
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Careers
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
            <Link href="#" color="inherit" display="block">
              Press
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Privacy
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Terms
            </Link>
            <Link href="#" color="inherit" display="block">
              Security
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 4, mb: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Outflo. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Made with ❤️ for sales professionals
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
