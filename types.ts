
export interface Country {
  name: string;
  code: string;
  flag: string;
}

export enum PlanType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  CUSTOM = 'CUSTOM'
}

export interface PricingPlan {
  type: PlanType;
  minPrice: number;
  maxPrice: number;
  features: string[];
  description: string;
  accuracy: string;
  latency: string;
  mode: 'STANDARD' | 'SUPER SONIC';
}

export interface DeploymentRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  fromCountry: string;
  toCountry: string;
  message: string;
  timestamp: number;
  status: 'PENDING' | 'ANALYZING' | 'DEPLOYED' | 'ARCHIVED';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coo';
  text: string;
  timestamp: number;
  userId: string;
}

export interface UserSession {
  id: string;
  name?: string;
  lastActive: number;
}
