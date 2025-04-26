export interface LinkedInProfile {
  _id: string;
  fullName: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  profileImageUrl?: string;
  connectionDegree?: string;
  aboutSummary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkedInProfilesResponse {
  success: boolean;
  count: number;
  data: LinkedInProfile[];
}
