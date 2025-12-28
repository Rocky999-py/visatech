import { GoogleGenAI } from "@google/genai";

export const generateVisaStrategy = async (fromCountry: string, toCountry: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the lead architect at VISATECH AI. 
      Generate a professional technical deployment strategy for a visa appointment automation bot for the route: ${fromCountry} to ${toCountry}.
      
      The output MUST be in two parts:
      1. A technical log in JSON format (wrapped in triple backticks) containing: "endpoint_status", "fingerprint_mode", "ip_rotation_strategy", and "expected_latency".
      2. A concise engineering summary (100 words max) explaining how our ML behavioral models will bypass the specific portal protection for this route.
      
      Use advanced technical terminology (e.g., Canvas Fingerprinting, TLS Handshake Obfuscation, Residential Proxy Backbones).`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "PROTOCOL_ERROR: Matrix initialization failed. Contact system architect.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "ANALYSIS_OFFLINE: Please initialize manual consultation via WhatsApp Protocol.";
  }
};