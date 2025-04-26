import { Request, Response } from 'express';
import { generatePersonalizedMessage, LinkedInProfile, validateProfileData } from '../services/message.service';

export const createPersonalizedMessage = async (req: Request, res: Response) => {
  try {
    const profileData: LinkedInProfile = req.body;
    
    // Validate required fields
    const missingFields = validateProfileData(profileData);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        requiredFields: missingFields
      });
    }
    
    const message = await generatePersonalizedMessage(profileData);
    res.status(200).json({ 
      success: true,
      message 
    });
  } catch (error) {
    console.error('Error in createPersonalizedMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating personalized message',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
