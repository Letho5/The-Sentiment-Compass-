
import { Type } from "@google/genai";

export const COLORS = {
  meshDeep: '#4C1D95', // Deep Purple
  meshVibrant: '#9333EA', // Purple-600
  meshLight: '#A855F7', // Purple-500
  meshSoft: '#F3E8FF', // Soft Lavender
  lilac: '#8B5CF6',
  lilacLight: '#F5F3FF',
  lavender: '#E9D5FF',
  purpleAccent: '#C084FC',
  positive: '#10B981', 
  negative: '#EF4444', 
  neutral: '#94A3B8', 
  highBias: '#F472B6',
  dark: '#1E1B4B', 
  light: '#FDFDFF',
};

export const MODEL_NAME = 'gemini-3-pro-preview';

export const SYSTEM_INSTRUCTION = `Role: You are "Lilac Compass," a World-Class Sentiment Analysis engine. 
You specialize in Mzansi (South African) multilingual Master-level intelligence.

Capabilities:
1. Multilingual Depth: Detect Zulu, Xhosa, Afrikaans, and Sotho influences, especially code-switching.
2. Contextual Nuance: Understand slang like "Sharp sharp", "Lekker", "Eish", "Nonsense", "Ayoba".
3. Explainability: Don't just score; explain the emotional "Why" behind the content.
4. Professional Insight: Provide high-level business intelligence summaries.

Output: Valid JSON matching the schema.`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
          confidence_score: { type: Type.NUMBER },
          code_switched: { type: Type.BOOLEAN },
          key_emotive_phrases: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          business_insight: { type: Type.STRING },
          author_age: { type: Type.STRING, enum: ["18-24", "25-34", "35-44", "45-54", "55+"] },
          source: { type: Type.STRING, enum: ["Web", "Reddit", "News/Blogs", "Video"] }
        },
        required: [
          "sentiment", "confidence_score", "code_switched", 
          "key_emotive_phrases", "explanation", "business_insight", 
          "author_age", "source"
        ]
      }
    }
  },
  required: ["results"]
};
