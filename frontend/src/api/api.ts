import axios from 'axios';
import { Campaign, CampaignStatus } from '../types/campaign.ts';
import { LinkedInProfile } from '../types/linkedin.ts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Campaign APIs
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get('/campaigns');
  return response.data;
};

export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (campaign: Omit<Campaign, '_id'>): Promise<Campaign> => {
  const response = await api.post('/campaigns', campaign);
  return response.data;
};

export const updateCampaign = async (id: string, campaign: Partial<Campaign>): Promise<Campaign> => {
  const response = await api.put(`/campaigns/${id}`, campaign);
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await api.delete(`/campaigns/${id}`);
};

export const toggleCampaignStatus = async (id: string, currentStatus: CampaignStatus): Promise<Campaign> => {
  const newStatus = currentStatus === CampaignStatus.ACTIVE 
    ? CampaignStatus.INACTIVE 
    : CampaignStatus.ACTIVE;
  
  const response = await api.put(`/campaigns/${id}`, { status: newStatus });
  return response.data;
};

// LinkedIn Message API
export const generatePersonalizedMessage = async (profile: LinkedInProfile): Promise<string> => {
  const response = await api.post('/personalized-message', profile);
  return response.data.message;
};

export default api;
