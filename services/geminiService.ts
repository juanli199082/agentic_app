
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ViralAnalysis, BilingualViralAnalysis, GeneratedContent, Language, GeneratorParams, ModelSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Schemas ---

const structuralStepSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    purpose: { type: Type.STRING },
  },
  required: ["name", "description", "purpose"],
};

const logicAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    judgment: { type: Type.STRING, description: "The core judgment" },
    reason: { type: Type.STRING, description: "Why this judgment is made" },
    evidence: { type: Type.STRING, description: "Direct quote or description" },
    effect: { type: Type.STRING, description: "The psychological effect" }
  },
  required: ["judgment", "reason", "evidence", "effect"]
};

const keyInfoSchema = {
  type: Type.OBJECT,
  properties: {
    coreViewpoint: { type: Type.STRING },
    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    triggerWords: { type: Type.ARRAY, items: { type: Type.STRING } },
    cta: { type: Type.STRING }
  },
  required: ["coreViewpoint", "painPoints", "triggerWords", "cta"]
};

const singleLanguageAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    viralType: { type: Type.STRING },
    coreFunction: { type: Type.STRING },
    suitableScenarios: { type: Type.STRING },
    hookLogic: logicAnalysisSchema,
    emotionLogic: logicAnalysisSchema,
    keyInfo: keyInfoSchema,
    hookEngine: {
      type: Type.OBJECT,
      properties: { type: { type: Type.STRING }, score: { type: Type.INTEGER } },
      required: ["type", "score"]
    },
    structureEngine: {
      type: Type.OBJECT,
      properties: { type: { type: Type.STRING }, completeness: { type: Type.INTEGER }, steps: { type: Type.ARRAY, items: structuralStepSchema } },
      required: ["type", "completeness", "steps"]
    },
    emotionEngine: {
      type: Type.OBJECT,
      properties: { primary: { type: Type.STRING }, curve: { type: Type.STRING } },
      required: ["primary", "curve"]
    },
    rewardEngine: {
      type: Type.OBJECT,
      properties: { type: { type: Type.STRING }, clarityScore: { type: Type.INTEGER }, description: { type: Type.STRING } },
      required: ["type", "clarityScore", "description"]
    },
    platformEngine: {
      type: Type.OBJECT,
      properties: { fitScore: { type: Type.INTEGER }, interactionHooks: { type: Type.ARRAY, items: { type: Type.STRING } } },
      required: ["fitScore", "interactionHooks"]
    },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["title", "viralType", "coreFunction", "suitableScenarios", "hookLogic", "emotionLogic", "keyInfo", "hookEngine", "structureEngine", "emotionEngine", "rewardEngine", "platformEngine", "tags"],
};

const rootResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    zh: singleLanguageAnalysisSchema,
    en: singleLanguageAnalysisSchema
  },
  required: ["zh", "en"]
};

const generatedContentSchema = {
  type: Type.OBJECT,
  properties: {
    script: { type: Type.STRING },
    explanation: { type: Type.STRING }
  },
  required: ["script", "explanation"]
};

const mediaPromptSchema = {
  type: Type.OBJECT,
  properties: {
    posterPrompt: { type: Type.STRING, description: "Prompt for AI image generator (Midjourney/Stable Diffusion)" },
    videoPrompt: { type: Type.STRING, description: "Prompt for AI video generator (Runway/Sora)" },
    visualStyle: { type: Type.STRING, description: "Keywords for style" }
  },
  required: ["posterPrompt", "videoPrompt", "visualStyle"]
};

// --- Helpers ---

const isUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch {
    return text.match(/^(http|https):\/\//) || text.match(/^(www\.)/) || text.includes('.com') || text.includes('.cn');
  }
};

const extractContentFromUrl = async (url: string, language: Language, modelSettings?: ModelSettings): Promise<string> => {
  try {
    const modelName = modelSettings?.modelName || "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `User provided URL: ${url}
      Task: Extract the transcript or article text. If it is a video, describe the visual flow and audio track. 
      Important: Extract the content in its ORIGINAL language. Do not translate yet.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "";
  } catch (error) {
    return `(System: Failed to extract. Analysis based on URL context only.) ${url}`;
  }
};

// --- Services ---

export const analyzeViralContent = async (input: string, language: Language, modelSettings?: ModelSettings): Promise<BilingualViralAnalysis> => {
  try {
    let contentToAnalyze = input;
    if (isUrl(input.trim())) {
      contentToAnalyze = await extractContentFromUrl(input.trim(), language, modelSettings);
    }
    
    const frameworkPrompt = `
      You are the "ViralAlchemy Engine". Deconstruct the **Author's Intent** and **Logic** of the provided content.
      
      Output the analysis in TWO languages: 
      1. 'zh' (Simplified Chinese)
      2. 'en' (English)
      
      Perform analysis in 4 Modules for EACH language:
      Module 1: Quick Conclusion
      Module 2: Logic & Reasoning (The "Why")
      Module 3: Key Info
      Module 4: Standardized Engines
      
      Ensure the translation between ZH and EN is high-quality and culturally adapted.
    `;

    const modelName = modelSettings?.modelName || "gemini-2.5-flash";
    const temperature = modelSettings?.temperature ?? 1;
    const topK = modelSettings?.topK ?? 64;
    const topP = modelSettings?.topP ?? 0.95;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `
      ${frameworkPrompt}
      
      Content to Analyze: "${contentToAnalyze}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: rootResponseSchema,
        temperature,
        topK,
        topP
      },
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as BilingualViralAnalysis;
  } catch (error) {
    console.error("Deconstruction failed:", error);
    throw new Error("Failed to analyze content.");
  }
};

export const generateNewContent = async (
  params: GeneratorParams,
  language: Language,
  modelSettings?: ModelSettings
): Promise<GeneratedContent> => {
  try {
    const langInstruction = language === 'zh' ? 'Write the script purely in Simplified Chinese.' : 'Write the script in English.';
    
    const modelName = modelSettings?.modelName || "gemini-2.5-flash";
    const temperature = modelSettings?.temperature ?? 1;
    const topK = modelSettings?.topK ?? 64;
    const topP = modelSettings?.topP ?? 0.95;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate viral content based on the "ViralAlchemy Formula":
      Formula = Hook (${params.hookType}) x Structure (${params.structureType}) x Emotion (${params.emotionType}).
      
      Parameters:
      - Topic: ${params.topic}
      - Target Audience: ${params.audience}
      - Hook Strategy: ${params.hookType}
      - Structure Template: ${params.structureType}
      - Primary Emotion to Drive: ${params.emotionType}
      
      Target Language: ${langInstruction}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: generatedContentSchema,
        systemInstruction: `You are a viral content generator. You strictly follow the requested structure and hook type. ${langInstruction}`,
        temperature,
        topK,
        topP
      },
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as GeneratedContent;
  } catch (error) {
    console.error("Generation failed:", error);
    throw new Error("Failed to generate content.");
  }
};

export const generateMediaPrompts = async (
  script: string,
  platform: string,
  language: Language,
  modelSettings?: ModelSettings
): Promise<{ posterPrompt: string; videoPrompt: string; visualStyle: string }> => {
  try {
    const modelName = modelSettings?.modelName || "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `
      Task: Create high-quality AI generation prompts based on the viral script provided.
      Platform context: ${platform}
      Script: "${script.substring(0, 1000)}..."
      
      1. posterPrompt: A detailed English prompt for Midjourney/Stable Diffusion to create a viral cover image/poster. Include lighting, composition, style keywords.
      2. videoPrompt: A detailed prompt for AI Video Generators (Sora/Runway/Luma) to generate the opening hook scene.
      3. visualStyle: 3-5 keywords describing the visual vibe (e.g. "Cyberpunk, High Contrast").
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: mediaPromptSchema,
      },
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Media prompt generation failed:", error);
    return {
      posterPrompt: "High quality viral cover image, 4k, trending on artstation",
      videoPrompt: "Cinematic shot of the subject, high quality, 4k",
      visualStyle: "Modern, Clean"
    };
  }
}
