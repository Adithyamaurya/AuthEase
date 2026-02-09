
import { GoogleGenAI, Type } from "@google/genai";
import { MediaType, AnalysisResult, DifficultyMode } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeMedia = async (type: MediaType, content: string | File): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  let parts: any[] = [];
  if (typeof content === 'string') {
    parts.push({ text: `Analyze this ${type} for authenticity: ${content}` });
  } else {
    const base64 = await fileToBase64(content);
    parts.push({
      inlineData: {
        data: base64,
        mimeType: content.type,
      },
    });
    parts.push({ text: `Perform a forensic analysis of this ${type} for AI generation artifacts, metadata anomalies, and compression inconsistencies.` });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sourceCredibility: { type: Type.NUMBER },
          manipulationRisk: { type: Type.NUMBER },
          aiSyntheticProb: { type: Type.NUMBER },
          trustIndex: { type: Type.NUMBER },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          metadata: { type: Type.OBJECT, properties: { forensicDetails: { type: Type.STRING } } }
        },
        required: ["sourceCredibility", "manipulationRisk", "aiSyntheticProb", "trustIndex", "findings", "explanation"]
      }
    },
  });

  return JSON.parse(response.text);
};

export const generateImageContent = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const generateGameChallenge = async (type: MediaType, difficulty: DifficultyMode): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const instructions = {
    beginner: "Obvious differences. AI has clear artifacts (e.g., garbled text, 6 fingers, repetitive phrases).",
    intermediate: "Mixed AI-edited content. Content that is mostly real but has subtle AI touches or filters.",
    advanced: "Adversarial examples. AI content designed to mimic professional human work with high coherence.",
    expert: "Human-written but structured like AI. Extremely challenging cases where human quirkiness is minimized."
  };

  const prompt = `Generate a forensic literacy challenge of type ${type} at ${difficulty} difficulty.
  Guidelines: ${instructions[difficulty]}
  
  For ${type}, provide two entries: one human-authored/real and one AI-generated.
  If type is 'image', the 'content' field should be a high-quality visual description (PROMPT) for an image generator.
  The AI prompt should include specific instructions to include subtle artifacts or markers mentioned in the explanation.
  The Human prompt should describe a natural, imperfect scene.
  
  Return valid JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          narrative: { type: Type.STRING },
          optionA: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              isAi: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING }
            },
            required: ["content", "isAi", "explanation"]
          },
          optionB: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              isAi: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING }
            },
            required: ["content", "isAi", "explanation"]
          }
        },
        required: ["id", "narrative", "optionA", "optionB"]
      }
    }
  });

  const challenge = JSON.parse(response.text);

  // If image mode, we need to generate the actual image bytes
  if (type === 'image') {
    const [imgA, imgB] = await Promise.all([
      generateImageContent(challenge.optionA.content),
      generateImageContent(challenge.optionB.content)
    ]);
    challenge.optionA.content = imgA;
    challenge.optionB.content = imgB;
  }

  return challenge;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
