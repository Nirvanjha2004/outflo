import { Request, Response } from 'express';
import Campaign, { CampaignStatus } from '../models/campaign.model';
import mongoose from 'mongoose';

// Get all campaigns (excluding deleted ones)
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: CampaignStatus.DELETED } });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    if (campaign.status === CampaignStatus.DELETED) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign', error });
  }
};

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Validate accountIDs (ensure they're valid ObjectIDs)
    const validAccountIDs = accountIDs?.filter((id: string) => 
      mongoose.Types.ObjectId.isValid(id)
    ).map((id: string) => new mongoose.Types.ObjectId(id));
    
    const newCampaign = new Campaign({
      name,
      description,
      status: status || CampaignStatus.ACTIVE,
      leads: leads || [],
      accountIDs: validAccountIDs || []
    });
    
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};

// Update campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Check if campaign exists
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    if (campaign.status === CampaignStatus.DELETED) {
      return res.status(400).json({ message: 'Cannot update a deleted campaign' });
    }
    
    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Validate accountIDs (ensure they're valid ObjectIDs)
    let validAccountIDs;
    if (accountIDs) {
      validAccountIDs = accountIDs.filter((id: string) => 
        mongoose.Types.ObjectId.isValid(id)
      ).map((id: string) => new mongoose.Types.ObjectId(id));
    }
    
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(leads && { leads }),
        ...(validAccountIDs && { accountIDs: validAccountIDs })
      },
      { new: true }
    );
    
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign', error });
  }
};

// Soft delete campaign (set status to DELETED)
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    if (campaign.status === CampaignStatus.DELETED) {
      return res.status(400).json({ message: 'Campaign already deleted' });
    }
    
    campaign.status = CampaignStatus.DELETED;
    await campaign.save();
    
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign', error });
  }
};
