
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
  _id?: string; // MongoDB style ID
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  fromCountry: string;
  toCountry: string;
  message: string;
  timestamp: number;
  createdAt?: string;
  status: 'PENDING' | 'ANALYZING' | 'DEPLOYED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ChatMessage {
  _id?: string;
  id: string;
  sender: 'user' | 'coo';
  text: string;
  timestamp: number;
  userId: string;
}

export interface UserSession {
  _id?: string;
  id: string;
  name?: string;
  lastActive: number;
  lastMessage?: string;
  nodeStatus: 'ONLINE' | 'OFFLINE' | 'SUSPENDED';
}

export interface SystemStatus {
  dbConnected: boolean;
  activeNodes: number;
  serverLoad: string;
  latency: string;
}
