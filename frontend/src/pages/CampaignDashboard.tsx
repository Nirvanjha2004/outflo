import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Grid,
  Card,
  CardContent,
  useTheme,
  Chip,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import EmailIcon from '@mui/icons-material/Email';
import CampaignsList from '../components/CampaignsList.tsx';
import CampaignForm from '../components/CampaignForm.tsx';
import LinkedInMessageGenerator from '../components/LinkedInMessageGenerator.tsx';
import { Campaign } from '../types/campaign';
import { useLocation, useNavigate } from 'react-router-dom';

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

// Mock data for dashboard stats
const mockStats = {
  totalCampaigns: 8,
  activeCampaigns: 3,
  totalLeads: 245,
  messagesSent: 189,
  responseRate: 32
};

const CampaignDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const initialTabValue = parseInt(queryParams.get('tab') || '0', 10);
  
  const [tabValue, setTabValue] = useState<number>(initialTabValue);
  const [showCampaignForm, setShowCampaignForm] = useState<boolean>(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update URL without reloading the page
    navigate(`?tab=${newValue}`, { replace: true });
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
  
  const statCards = [
    { 
      title: 'Total Campaigns', 
      value: mockStats.totalCampaigns, 
      icon: <CampaignIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main
    },
    { 
      title: 'Active Campaigns', 
      value: mockStats.activeCampaigns, 
      icon: <EmailIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main
    },
    { 
      title: 'Total Leads', 
      value: mockStats.totalLeads, 
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main 
    },
    { 
      title: 'Messages Sent', 
      value: mockStats.messagesSent, 
      icon: <MessageIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b'
    }
  ];

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your campaigns and generate personalized messages
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateCampaign}
            >
              New Campaign
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Dashboard Stats */}
      {!showCampaignForm && tabValue === 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: `${stat.color}10`,
                    zIndex: 0
                  }}
                />
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {stat.title}
                    </Typography>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  
                  {index === 3 && ( 
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={`${mockStats.responseRate}% Response Rate`}
                        size="small"
                        sx={{ 
                          bgcolor: `${theme.palette.success.main}20`, 
                          color: theme.palette.success.main,
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper 
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafd' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ px: 2 }}
          >
            <Tab 
              label="Campaigns" 
              icon={<CampaignIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64, textTransform: 'none', fontWeight: 600 }}
            />
            <Tab 
              label="Message Generator" 
              icon={<MessageIcon />} 
              iconPosition="start"
              sx={{ minHeight: 64, textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {!showCampaignForm ? (
            <CampaignsList 
              onEditCampaign={handleEditCampaign}
              refreshTrigger={refreshTrigger}
            />
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
