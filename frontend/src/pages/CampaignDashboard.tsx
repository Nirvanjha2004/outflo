import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignsList from '../components/CampaignsList.tsx';
import CampaignForm from '../components/CampaignForm.tsx';
import LinkedInMessageGenerator from '../components/LinkedInMessageGenerator.tsx';
import { Campaign } from '../types/campaign';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CampaignDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [showCampaignForm, setShowCampaignForm] = useState<boolean>(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateCampaign = () => {
    setCampaignToEdit(null);
    setShowCampaignForm(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setCampaignToEdit(campaign);
    setShowCampaignForm(true);
  };

  const handleCampaignSaved = () => {
    setShowCampaignForm(false);
    setCampaignToEdit(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setShowCampaignForm(false);
    setCampaignToEdit(null);
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Outflo Dashboard
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Campaigns" />
          <Tab label="LinkedIn Message Generator" />
        </Tabs>
        <Divider />

        <TabPanel value={tabValue} index={0}>
          {!showCampaignForm ? (
            <>
              <Box display="flex" justifyContent="flex-end" mb={3}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCampaign}
                >
                  New Campaign
                </Button>
              </Box>
              <CampaignsList 
                onEditCampaign={handleEditCampaign}
                refreshTrigger={refreshTrigger}
              />
            </>
          ) : (
            <CampaignForm
              campaignToEdit={campaignToEdit}
              onSaved={handleCampaignSaved}
              onCancel={handleCancelForm}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <LinkedInMessageGenerator />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default CampaignDashboard;
