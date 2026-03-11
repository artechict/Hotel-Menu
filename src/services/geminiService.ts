import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export interface TranslationResult {
  ar: string;
  tr: string;
  ku: string;
}

export async function translateText(text: string): Promise<TranslationResult> {
  if (!text) return { ar: '', tr: '', ku: '' };

  try {
    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash-latest",
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
