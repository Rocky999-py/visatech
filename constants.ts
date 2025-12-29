
import { Country, PricingPlan, PlanType } from './types';

/** 
 * PRODUCTION API CONFIGURATION
 * Replace with your deployed backend URL (e.g., https://your-api.vercel.app/api)
 */
export const API_BASE_URL = 'https://visatech-api-production.up.railway.app/api'; 
export const IS_PRODUCTION = true; // Toggle this to true for real DB connectivity

export const COUNTRIES: Country[] = [
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Schengen Area', code: 'EU', flag: '🇪🇺' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    type: PlanType.BASIC,
    minPrice: 1450,
    maxPrice: 2100,
    description: 'Entry-level automation for individual applicants. Handles low-security portals with standard timing.',
    accuracy: '94% Accuracy',
    latency: '850ms - 1.2s',
    mode: 'STANDARD',
    features: [
      'Single Route Targeting',
      'Basic Fingerprint Masking',
      'Email Notification Relay',
      'Standard Proxy Backbone'
    ]
  },
  {
    type: PlanType.STANDARD,
    minPrice: 2200,
    maxPrice: 5000,
    description: 'Designed for small agencies. Improved feasibility for moderate-security portals like VFS Global.',
    accuracy: '97.2% Accuracy',
    latency: '300ms - 500ms',
    mode: 'STANDARD',
    features: [
      '3 Concurrent Threads',
      'Advanced OCR Decoding',
      'SMS & WhatsApp Triggers',
      'Multi-Embassy Support'
    ]
  },
  {
    type: PlanType.EXPRESS,
    minPrice: 5100,
    maxPrice: 17000,
    description: 'High-frequency engine for high-paying tasks. Essential for USA F1/B1 slots where timing is sub-second.',
    accuracy: '99.4% Accuracy',
    latency: '< 50ms',
    mode: 'SUPER SONIC',
    features: [
      'Unlimited Concurrency',
      'Super Sonic Execution',
      'ML Behavioral Mimicry',
      'Priority Support Queue'
    ]
  },
  {
    type: PlanType.CUSTOM,
    minPrice: 0,
    maxPrice: 0,
    description: 'The ultimate feasibility solution. Tailored source-code for the most secure government portals globally.',
    accuracy: '99.9% Accuracy',
    latency: 'Sub-Atomic',
    mode: 'SUPER SONIC',
    features: [
      'Source Code Ownership',
      'Private Proxy Matrix',
      'Dedicated Dev-Ops Team',
      'On-Premise Deployment'
    ]
  }
];

export const WHATSAPP_NUMBER = '+8801300172795';
export const ADMIN_PIN = '434343';
export const LOGO_CLICK_TARGET = 30;
