
export type Language = 'en' | 'zh';

export enum AppMode {
  DECONSTRUCT = 'DECONSTRUCT',
  GENERATE = 'GENERATE',
  ASSETS = 'ASSETS', // Renamed from HISTORY
  SETTINGS = 'SETTINGS',
  PAYMENT = 'PAYMENT'
}

export type ViewState = 'LANDING' | 'AUTH' | 'APP';

export interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface ModelSettings {
  modelName: string;
  temperature: number;
  topK: number;
  topP: number;
}

// Module 1: Hook Types
export type HookType = 
  | 'Pain Point' // 痛点直击型
  | 'Counter-Intuitive' // 反常识型
  | 'Result First' // 结果前置型
  | 'Identity Resonance' // 身份共鸣型
  | 'Risk Warning' // 风险预警型
  | 'Strong Opinion' // 强情绪观点型
  | 'Other';

// Module 2: Structure Types
export type StructureType = 
  | 'Problem-Amplify-Solve' // 问题 → 放大 → 解决
  | 'Phenomenon-Reverse-Reason-Method' // 现象 → 反转 → 原因 → 方法
  | 'Story-Conflict-Twist-Conclusion' // 故事 → 冲突 → 转折 → 结论
  | 'Contrast-Slap-Solution' // 对比 → 打脸 → 正解
  | 'Other';

// Module 3: Emotion Types
export type EmotionType = 
  | 'Anxiety' // 焦虑
  | 'Hope' // 希望
  | 'Anger' // 愤怒
  | 'Curiosity' // 好奇
  | 'Achievement' // 成就感
  | 'Other';

// Module 4: Reward Types
export type RewardType = 
  | 'Actionable Method' // 可直接用的方法
  | 'Cognitive Upgrade' // 认知升级
  | 'Emotional Compensation' // 情绪代偿
  | 'Identity Confirmation' // 身份确认
  | 'Other';

export interface StructuralStep {
  name: string;
  description: string;
  purpose: string;
}

// New: Deep Logic Analysis Structure
export interface LogicAnalysis {
  judgment: string; // 判断: "This is a Counter-Intuitive Hook"
  reason: string;   // 原因: "It overturns common belief"
  evidence: string; // 证据: "Quote from text..."
  effect: string;   // 作用: "Forces user to stay"
}

// New: Key Information Extraction
export interface KeyInformation {
  coreViewpoint: string; // What the author really wants to say
  painPoints: string[];  // User pain points targeted
  triggerWords: string[]; // Emotional words used
  cta: string;           // Call to action
}

// Single Language Analysis
export interface ViralAnalysis {
  title: string;
  
  // Module 1: Quick Conclusion (The Result)
  viralType: string;         // e.g. "Counter-Intuitive + Anxiety"
  coreFunction: string;      // e.g. "Traffic Acquisition"
  suitableScenarios: string; // e.g. "Personal Brand Building"

  // Module 2: Deep Logic (The "Why")
  hookLogic: LogicAnalysis;
  emotionLogic: LogicAnalysis;

  // Module 3: Key Info Extraction (The "What")
  keyInfo: KeyInformation;

  // Module 4: Standardized Engines (The "System")
  hookEngine: {
    type: HookType;
    score: number; // 1-5
  };
  
  structureEngine: {
    type: StructureType;
    completeness: number; // 0-100
    steps: StructuralStep[];
  };
  
  emotionEngine: {
    primary: EmotionType;
    curve: string; // e.g., "Low -> High -> Release"
  };
  
  rewardEngine: {
    type: RewardType;
    clarityScore: number; // 0-100
    description: string;
  };
  
  platformEngine: {
    fitScore: number; // 0-100
    interactionHooks: string[];
  };

  tags: string[];
}

// Bilingual Container
export interface BilingualViralAnalysis {
  zh: ViralAnalysis;
  en: ViralAnalysis;
}

export interface GeneratedContent {
  script: string;
  explanation: string;
}

// For Generator
export interface GeneratorParams {
  topic: string;
  audience: string;
  hookType: HookType;
  structureType: StructureType;
  emotionType: EmotionType;
}

// New Persona Types
export interface PersonaProfile {
  platform: string;
  stage: string;
  identity: string;
  painPoints: string[];
  desiredResult: string;
  emotionalState: string;
  contentPreference: string;
}

// --- New Asset Types for "Viral Assets Library" ---

export type AssetSourceType = 'ANALYSIS' | 'GENERATION';

export interface MediaMetadata {
  type: 'poster' | 'video';
  status: 'generated' | 'pending';
  prompt: string; // The AI prompt used to generate this
  url: string; // Data URL or Remote URL
  resolution: string;
  aspectRatio: string;
  generatedAt: number;
}

export interface ViralAsset {
  id: string;
  createdAt: number;
  updatedAt: number;
  sourceType: AssetSourceType;
  
  // Standardized Report Fields
  title: string;
  platform: string; // e.g., TikTok, Generic
  
  // The "Viral DNA"
  viralDNA: {
    hook: string; // e.g. "Counter-Intuitive"
    emotion: string; // e.g. "Anxiety"
    structure: string; // e.g. "PAS"
  };

  // Content
  content: string; // The full script text or analysis summary
  
  // Media Generation
  media?: MediaMetadata;

  // Metadata
  tags: string[];
  notes?: string; // User editable notes
}
