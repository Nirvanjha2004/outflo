import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Divider
} from '@mui/material';
import LinkedInLeadSearch from '../components/LinkedInLeadSearch.tsx';
import LinkedInLeadsList from '../components/LinkedInLeadsList.tsx';

const LinkedInLeadsPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const handleSearchComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          LinkedIn Leads
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find and manage leads from LinkedIn to use in your campaigns
        </Typography>
      </Box>
      
      <LinkedInLeadSearch onSearchComplete={handleSearchComplete} />
      <LinkedInLeadsList refreshTrigger={refreshTrigger} />
    </Container>
  );
};

export default LinkedInLeadsPage;
