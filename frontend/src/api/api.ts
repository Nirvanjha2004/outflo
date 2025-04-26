import axios from 'axios';
import { Campaign, CampaignStatus } from '../types/campaign.ts';
import { LinkedInProfile, LinkedInProfilesResponse } from '../types/linkedin-profile.ts';
import { LinkedInProfile as PersonalizedMessageProfile } from '../types/linkedin.ts';

// Use environment variable or default to the deployed backend if in production
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.REACT_APP_API_URL || 
  (isProduction ? 'https://outflo-la6z.onrender.com' : 'http://localhost:5000');

console.log('API URL:', API_URL); // Helpful for debugging

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

// LinkedIn Profile APIs
export const scrapeLinkedInProfiles = async (searchUrl: string): Promise<{ success: boolean, message: string }> => {
  const response = await api.post('/linkedin/scrape', { searchUrl });
  return response.data;
};

export const getLinkedInProfiles = async (query: string = ''): Promise<LinkedInProfilesResponse> => {
  const response = await api.get('/linkedin', { params: { query } });
  return response.data;
};

export const getLinkedInProfileById = async (id: string): Promise<LinkedInProfile> => {
  const response = await api.get(`/linkedin/${id}`);
  return response.data.data;
};

export const deleteLinkedInProfileById = async (id: string): Promise<void> => {
  await api.delete(`/linkedin/${id}`);
};

// LinkedIn Message API
export const generatePersonalizedMessage = async (profile: PersonalizedMessageProfile): Promise<string> => {
  const response = await api.post('/personalized-message', profile);
  return response.data.message;
};

export default api;
