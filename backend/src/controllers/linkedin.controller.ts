import { Request, Response } from 'express';
import LinkedInScraper from '../services/linkedin-scraper.service';
import LinkedInProfile from '../models/linkedin-profile.model';

export const scrapeLinkedInProfiles = async (req: Request, res: Response) => {
  try {
    const { searchUrl } = req.body;
    
    if (!searchUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'LinkedIn search URL is required' 
      });
    }
    
    // Validate URL format
    if (!searchUrl.includes('linkedin.com/search/results/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LinkedIn search URL format'
      });
    }

    // This will be a long-running operation, so we'll respond immediately
    res.status(202).json({
      success: true,
      message: 'Scraping initiated. Check the leads endpoint for results.'
    });
    
    // Run scraping in the background
    try {
      await LinkedInScraper.scrapeSearchResults(searchUrl);
    } catch (error) {
      console.error('Background scraping failed:', error);
    }
    
  } catch (error) {
    console.error('Error in scrapeLinkedInProfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error scraping LinkedIn profiles',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getLinkedInProfiles = async (req: Request, res: Response) => {
  try {
    const { query = '', limit = 100 } = req.query;
    
    const profiles = await LinkedInScraper.getStoredProfiles(
      String(query),
      Number(limit)
    );
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
    
  } catch (error) {
    console.error('Error in getLinkedInProfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving LinkedIn profiles',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getLinkedInProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const profile = await LinkedInProfile.findById(id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
    
  } catch (error) {
    console.error('Error in getLinkedInProfileById:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving LinkedIn profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteLinkedInProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await LinkedInProfile.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
    
  } catch (error) {
    console.error('Error in deleteLinkedInProfileById:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting LinkedIn profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
