
import { GoogleGenAI } from "@google/genai";
import { UnifiedAnalysis, AnalysisSource } from "./types";
import { MODEL_NAME, SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeText = async (texts: string[], source: AnalysisSource = 'Manual'): Promise<UnifiedAnalysis[]> => {
  const prompt = `Perform a sentiment analysis for these texts originating from ${source}:\n${texts.map((t, i) => `${i+1}. "${t}"`).join('\n')}`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const raw = JSON.parse(response.text || '{"results": []}');
  
  return raw.results.map((r: any, idx: number) => ({
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    text: texts[idx],
    ...r,
    source: r.source || source // Use detected source or fallback to provided
  }));
};

export const fetchSocialPulse = async (keyword: string, platforms: string[]): Promise<UnifiedAnalysis[]> => {
  const fetchPrompt = `Act as a social media aggregator. Generate 5 realistic, diverse social media posts/reviews about "${keyword}" as if they were just posted on ${platforms.join(', ')}. Then, analyze them using the Sentiment Compass rules. Ensure each result has a 'source' field matching one of: ${platforms.join(', ')}.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: fetchPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const raw = JSON.parse(response.text || '{"results": []}');
  
  return raw.results.map((r: any) => ({
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    text: r.text || `Recent pulse on ${keyword}...`,
    ...r
  }));
};
