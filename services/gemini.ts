import { GoogleGenAI, Modality } from "@google/genai";
import { Telemetry, ComponentHealth } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to check if API key is set
const hasKey = !!process.env.API_KEY;

export const generateAuraResponse = async (
  userPrompt: string,
  telemetry: Telemetry,
  componentHealth: ComponentHealth
): Promise<string> => {
  if (!hasKey) {
    return "API Key missing. Please configure the environment.";
  }

  try {
    const systemContext = `
      You are AURA, an advanced AI agent for a connected vehicle ecosystem.
      Your goal is to assist the driver with vehicle health, safety (AURA JEEVAH), sustainability (AURA PRAVAHA), and diagnostics (AURA TATVA).
      
      CURRENT TELEMETRY DATA:
      - Voltage: ${telemetry.voltage.toFixed(1)} V (Ref: 12.6-14.4V)
      - Engine Temp: ${telemetry.temp}°C (Normal: ~90°C)
      - RPM: ${telemetry.rpm}
      - Speed: ${telemetry.speed} km/h
      - Fatigue Level: ${telemetry.fatigueLevel}% (Warning > 75%)
      - Stress Level: ${telemetry.stressLevel}%
      - Eco Score: ${telemetry.ecoScore}/100
      
      COMPONENT HEALTH:
      ${Object.entries(componentHealth).map(([k, v]) => `- ${k}: ${Math.round(v)}%`).join('\n')}
      
      Directly answer the user's question based on this data. Be concise, professional, and empathetic.
      If a component is failing (health < 30%), recommend checking it.
      If fatigue is high, suggest a break.
    `;

    // Using the user's preferred model or fallback to standard flash
    const modelId = "gemini-2.5-flash"; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: userPrompt,
      config: {
        systemInstruction: systemContext,
      }
    });

    return response.text || "I'm having trouble processing that right now.";
  } catch (error) {
    console.error("AURA Agent Error:", error);
    return "Connection to AURA Core failed. Please try again.";
  }
};

export const generateTtsAudio = async (text: string): Promise<string | null> => {
  if (!hasKey || !text) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore" // Female voice
            }
          }
        }
      }
    });

    const audioContent = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioContent || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
