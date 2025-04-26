import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { Campaign, CampaignStatus, CampaignFormData } from '../types/campaign.ts';
import { createCampaign, updateCampaign } from '../api/api.ts';

interface CampaignFormProps {
  campaignToEdit?: Campaign | null;
  onSaved: () => void;
  onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignToEdit,
  onSaved,
  onCancel
}) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    status: CampaignStatus.ACTIVE,
    leads: '',
    accountIDs: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CampaignFormData, string>>>({});
  
  useEffect(() => {
    if (campaignToEdit) {
      setFormData({
        name: campaignToEdit.name,
        description: campaignToEdit.description,
        status: campaignToEdit.status,
        leads: campaignToEdit.leads.join('\n'),
        accountIDs: campaignToEdit.accountIDs.join('\n')
      });
    } else {
      // Reset form if not editing
      setFormData({
        name: '',
        description: '',
        status: CampaignStatus.ACTIVE,
        leads: '',
        accountIDs: ''
      });
    }
  }, [campaignToEdit]);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CampaignFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof CampaignFormData]) {
      setErrors(prev => ({ ...prev, [name as string]: undefined }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const campaignData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        leads: formData.leads
          .split('\n')
          .map(lead => lead.trim())
          .filter(Boolean),
        accountIDs: formData.accountIDs
          .split('\n')
          .map(id => id.trim())
          .filter(Boolean)
      };
      
      if (campaignToEdit) {
        await updateCampaign(campaignToEdit._id, campaignData);
      } else {
        await createCampaign(campaignData);
      }
      
      onSaved();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setErrors({
        ...errors,
        name: 'Failed to save campaign. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        {campaignToEdit ? 'Edit Campaign' : 'Create New Campaign'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Campaign Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              rows={3}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value={CampaignStatus.ACTIVE}>ACTIVE</MenuItem>
                <MenuItem value={CampaignStatus.INACTIVE}>INACTIVE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn Profile URLs (one per line)"
              name="leads"
              value={formData.leads}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={loading}
              placeholder="https://linkedin.com/in/profile-1&#10;https://linkedin.com/in/profile-2&#10;https://linkedin.com/in/profile-3"
              helperText="Enter each LinkedIn profile URL on a new line"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Account IDs (one per line)"
              name="accountIDs"
              value={formData.accountIDs}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading}
              placeholder="123&#10;456&#10;789"
              helperText="Enter each account ID on a new line"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : campaignToEdit ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CampaignForm;
