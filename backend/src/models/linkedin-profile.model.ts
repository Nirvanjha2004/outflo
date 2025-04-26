import mongoose, { Schema, Document } from 'mongoose';

export interface ILinkedInProfile extends Document {
  fullName: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  profileImageUrl?: string;
  connectionDegree?: string;
  aboutSummary?: string;
  searchQuery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LinkedInProfileSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    jobTitle: { type: String, required: false },
    company: { type: String, required: false },
    location: { type: String, required: false },
    profileUrl: { type: String, required: true, unique: true },
    profileImageUrl: { type: String },
    connectionDegree: { type: String },
    aboutSummary: { type: String },
    searchQuery: { type: String },
  },
  { timestamps: true }
);

// Create a text index for searching
LinkedInProfileSchema.index({ 
  fullName: 'text', 
  jobTitle: 'text', 
  company: 'text', 
  location: 'text',
  aboutSummary: 'text' 
});

export default mongoose.model<ILinkedInProfile>('LinkedInProfile', LinkedInProfileSchema);
