
export enum AppStage {
  HORIZON = 'horizon',
  AUTH = 'auth',
  COMPASS = 'compass'
}

export enum InputMode {
  MANUAL = 'manual',
  SOCIAL = 'social'
}

export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export type AnalysisSource = 'Manual' | 'X' | 'Facebook' | 'Instagram' | 'TikTok' | 'Reddit' | 'Web' | 'News/Blogs' | 'Video';

export interface UnifiedAnalysis {
  id: string;
  timestamp: number;
  text: string;
  sentiment: SentimentType;
  confidence_score: number;
  code_switched: boolean;
  key_emotive_phrases: string[];
  explanation: string;
  business_insight: string;
  author_age: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  source: AnalysisSource;
}

export interface BatchStats {
  total: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  avgConfidence: number;
}

// Add missing enums for DEEPA InputPanel
export enum Platform {
  FACEBOOK = 'Facebook',
  TIKTOK = 'TikTok',
  INSTAGRAM = 'Instagram',
  AMAZON = 'Amazon',
  GOOGLE = 'Google'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  PLAYFUL = 'Playful',
  LUXURY = 'Luxury',
  URGENT = 'Urgent'
}

export enum VisualStyle {
  REALISTIC = 'Realistic',
  THREE_D = '3D Render',
  MINIMAL = 'Minimalist',
  VIBRANT = 'Vibrant'
}

// Add ProductData interface for InputPanel
export interface ProductData {
  productName: string;
  shortDescription: string;
  keyFeatures: string;
  targetAudience: string;
  platform: Platform;
  tone: Tone;
  visualStyle: VisualStyle;
}

// Add AnalysisResult interface for OutputPanel
export interface AnalysisResult {
  id: string;
  timestamp: number;
  adCopy?: {
    primaryText: string;
    headline: string;
    cta: string;
  };
  marketplaceListing?: {
    title: string;
    bulletPoints: string[];
    description: string;
  };
  tiktokScript?: {
    hook: string;
    body: string;
    cta: string;
    storyboard: { scene: string; action: string; visualPrompt: string }[];
  };
  imageUrls: string[];
  imagePrompts: string[];
}

// Add BatchSummary interface for MetricsPanel
export interface BatchSummary {
  total: number;
  durationAvg: number;
  platformCounts: Record<string, number>;
}
