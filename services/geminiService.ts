import { GoogleGenAI } from "@google/genai";

export const generateVisaStrategy = async (fromCountry: string, toCountry: string) => {
  // Use the pre-configured API key from environment
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API Error: API_KEY is undefined. Check Vercel Environment Variables.");
    return "SYSTEM_CONFIG_ERROR: The Gemini API Key is missing. Please ensure 'API_KEY' is added correctly to your Vercel project settings.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the Lead Architect at VISATECH AI. 
      Analyze the appointment booking landscape for: ${fromCountry} to ${toCountry}.
      
      Provide a technical deployment strategy that includes:
      1. A technical log in JSON format (wrapped in triple backticks) with: "endpoint_status", "fingerprint_mode", "ip_rotation_strategy", and "expected_latency".
      2. A 100-word executive summary for the agency's CTO detailing how our ML-driven behavior models bypass detection on this specific portal (VFS, BLS, or Consulate directly).
      
      Use extreme technical jargon: Canvas Spoofing, TLS Fingerprint Randomization, Residential Backbone, and Neural OCR layers.`,
      config: {
        temperature: 0.9,
      }
    });
    
    return response.text || "COMMUNICATION_TIMEOUT: The Matrix failed to respond. Retrying uplink...";
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    return `ANALYSIS_FAILED: ${error instanceof Error ? error.message : 'Unknown Protocol Error'}. Ensure your API key is valid and redeploy your Vercel project.`;
  }
};