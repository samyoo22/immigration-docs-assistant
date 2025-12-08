
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisaSituation, AnalysisResult, Locale } from "../types";

// Define the schema for the structured response we want from Gemini
// Note: We use generic field names like 'summary' instead of 'summaryKorean'
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-6 bullet points summarizing the key content in the target language.",
    },
    detailedExplanation: {
      type: Type.STRING,
      description: "A friendly, detailed paragraph in the target language explaining the situation as if to a friend.",
    },
    simpleEnglishNotes: {
      type: Type.STRING,
      description: "A short section in very simple English explaining the most critical sentence from the input.",
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "E.g., 'Documents', 'School', 'USCIS'" },
          title: { type: Type.STRING, description: "Short action title in the target language" },
          description: { type: Type.STRING, description: "Clear instruction on what to do in the target language" },
        },
        required: ["category", "title", "description"],
      },
      description: "A list of concrete action items extracted from the text.",
    },
    safetyTerms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "The difficult English term (e.g., 'Grace Period')" },
          definition: { type: Type.STRING, description: "A definition of the term in the target language." },
        },
        required: ["term", "definition"],
      },
      description: "A glossary of complex immigration terms found in the text.",
    },
  },
  required: ["summary", "detailedExplanation", "simpleEnglishNotes", "checklist", "safetyTerms"],
};

export const analyzeDocument = async (
  situation: VisaSituation,
  text: string,
  targetLocale: Locale
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Map locale code to full language name for the prompt
  const languageMap: Record<Locale, string> = {
    en: 'Plain English',
    ko: 'Korean (Polite/Honorific)',
    zh: 'Simplified Chinese',
    hi: 'Hindi',
    ja: 'Japanese'
  };

  const targetLanguage = languageMap[targetLocale] || 'Plain English';

  const systemInstruction = `
You are a helpful, empathetic, and precise assistant for international students (specifically F-1 visa holders) in the US.
Your goal is to help them understand complex English immigration documents by translating and explaining them in **${targetLanguage}**.

Guidelines:
1. **Target Language**: Output all summaries, explanations, and checklist items in **${targetLanguage}**.
2. **Tone**: Calm, reassuring, and conservative. Do not induce panic.
3. **Safety**: NEVER give legal advice. If a text is ambiguous, tell the user to check with their DSO (Designated School Official) or an attorney.
4. **Context**: The user is in the situation: "${situation}".
5. **Privacy**: Do not repeat personal data like specific names or ID numbers in the output unless necessary for context.

Input Text to analyze follows.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: [
        {
          role: "user",
          parts: [
            { text: `Here is the document text:\n\n${text}` }
          ],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response generated from AI.");
    }

    const data = JSON.parse(jsonText) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the document. Please try again or check your text.");
  }
};
