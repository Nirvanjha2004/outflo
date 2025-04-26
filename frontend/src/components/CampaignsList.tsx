import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Switch,
  Typography,
  Box,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Campaign, CampaignStatus } from '../types/campaign.ts';
import { fetchCampaigns, toggleCampaignStatus, deleteCampaign } from '../api/api.ts';

interface CampaignsListProps {
  onEditCampaign: (campaign: Campaign) => void;
  refreshTrigger: number;
}

const CampaignsList: React.FC<CampaignsListProps> = ({ onEditCampaign, refreshTrigger }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const data = await fetchCampaigns();
        setCampaigns(data);
        setError(null);
      } catch (err) {
        setError('Failed to load campaigns');
        console.error('Error loading campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [refreshTrigger]);

  const handleStatusToggle = async (campaign: Campaign) => {
    try {
      const updatedCampaign = await toggleCampaignStatus(campaign._id, campaign.status);
      setCampaigns(campaigns.map(c => c._id === updatedCampaign._id ? updatedCampaign : c));
    } catch (err) {
      setError('Failed to update campaign status');
      console.error('Error toggling campaign status:', err);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      setError('Failed to delete campaign');
      console.error('Error deleting campaign:', err);
    }
  };

  const getStatusChipColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'success';
      case CampaignStatus.INACTIVE:
        return 'default';
      case CampaignStatus.DELETED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Box textAlign="center" my={4}>
        <Typography variant="h6" color="textSecondary">
          No campaigns found. Create your first campaign!
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Leads</TableCell>
            <TableCell align="center">Account IDs</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign._id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>{campaign.description}</TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Chip 
                    label={campaign.status.toUpperCase()} 
                    color={getStatusChipColor(campaign.status) as any} 
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Switch
                    checked={campaign.status === CampaignStatus.ACTIVE}
                    onChange={() => handleStatusToggle(campaign)}
                    disabled={campaign.status === CampaignStatus.DELETED}
                  />
                </Box>
              </TableCell>
              <TableCell align="center">{campaign.leads.length}</TableCell>
              <TableCell align="center">{campaign.accountIDs.length}</TableCell>
              <TableCell align="right">
                <IconButton 
                  aria-label="edit" 
                  color="primary" 
                  onClick={() => onEditCampaign(campaign)}
                  disabled={campaign.status === CampaignStatus.DELETED}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  aria-label="delete" 
                  color="error"
                  onClick={() => handleDeleteCampaign(campaign._id)}
                  disabled={campaign.status === CampaignStatus.DELETED}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CampaignsList;
