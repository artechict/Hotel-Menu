import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface TranslationResult {
  ar: string;
  tr: string;
  ku: string;
}

export async function translateText(text: string): Promise<TranslationResult> {
  if (!text) return { ar: '', tr: '', ku: '' };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following English text into Arabic, Turkish, and Kurdish Sorani. 
      Return the result as a JSON object with keys 'ar', 'tr', and 'ku'.
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ar: { type: Type.STRING },
            tr: { type: Type.STRING },
            ku: { type: Type.STRING },
          },
          required: ["ar", "tr", "ku"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      ar: result.ar || '',
      tr: result.tr || '',
      ku: result.ku || '',
    };
  } catch (error) {
    console.error("Translation error:", error);
    return { ar: text, tr: text, ku: text };
  }
}
