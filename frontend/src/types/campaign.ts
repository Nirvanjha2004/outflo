export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignFormData {
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string;
  accountIDs: string;
}
