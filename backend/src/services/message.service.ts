import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();


const hf = new HfInference("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");

export interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export const validateProfileData = (profile: LinkedInProfile): string[] => {
  const requiredFields = ['name', 'job_title', 'company'];
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!profile[field as keyof LinkedInProfile]) {
      missingFields.push(field);
    }
  }

  return missingFields;
};

export const generatePersonalizedMessage = async (profile: LinkedInProfile): Promise<string> => {
  try {
    // Validate API key
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }
    
    // Ensure required fields are present
    const missingFields = validateProfileData(profile);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Create a variety of prompts to get different responses
    const promptVariations = [
      `Write a personalized LinkedIn outreach message to ${profile.name}, a ${profile.job_title} at ${profile.company} located in ${profile.location || 'their area'}. Mention how Outflo's automation tools can help with their outreach campaigns. Make it conversational and reference their background: ${profile.summary || 'their professional experience'}.`,
      
      `Craft a unique LinkedIn message for ${profile.name} who works as ${profile.job_title} at ${profile.company}. The message should be warm, professional, and explain how Outflo can increase their sales meetings through automated outreach. Include something personalized based on: ${profile.summary || 'their role'}.`,
      
      `Create a brief but compelling LinkedIn outreach message to ${profile.name} (${profile.job_title} at ${profile.company}). Focus on how Outflo's platform could benefit someone in their position by streamlining lead generation and follow-ups.`
    ];
    
    // Select a random prompt variation for diversity
    const randomPrompt = promptVariations[Math.floor(Math.random() * promptVariations.length)];
    
    // Using Hugging Face's text generation with more diverse parameters
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2", // Better model for diverse responses
      inputs: randomPrompt,
      parameters: {
        max_length: 200,
        temperature: 0.8, // Higher temperature for more randomness
        top_p: 0.9,        // Nucleus sampling for more diversity
        do_sample: true   // Enable sampling for varied outputs
      },
    });
    
    const generatedText = response.generated_text?.trim();
    
    // Ensure we have a meaningful response
    if (!generatedText || generatedText.length < 50) {
      throw new Error('Generated message too short or empty');
    }
    
    return generatedText;
  } catch (error) {
    console.error('Error generating message:', error);
    
    // Create a more varied fallback message
    const fallbackTemplates = [
      `Hi ${profile.name}! I noticed your work as a ${profile.job_title} at ${profile.company}. Outflo's automation tools could help streamline your lead generation - would you be open to a quick chat?`,
      
      `Hello ${profile.name}, I came across your profile and was impressed by your role at ${profile.company}. I think Outflo's outreach automation could help you increase your sales meetings. Would you be interested in learning more?`,
      
      `${profile.name}, I see you're making an impact as a ${profile.job_title}. Outflo has helped similar professionals boost their outreach efficiency by 40%. Would you like to see how it works?`
    ];
    
    // Select random fallback message
    return fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
  }
};
