
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VisaSituation, AnalysisResult, TranslationLanguageCode, ChecklistItem, TranslatedAnalysis, SUPPORTED_TRANSLATION_LANGUAGES } from "../types";

const getGeminiErrorMessage = (error: unknown): string => {
  const rawMessage = error instanceof Error ? error.message : String(error);

  if (rawMessage.includes('"code":429') || rawMessage.toLowerCase().includes('quota') || rawMessage.includes('rate-limits')) {
    return "Gemini API quota was exceeded. Please check your Gemini API billing, quota, or try again later.";
  }

  if (rawMessage.includes('"code":403') || rawMessage.toLowerCase().includes('permission') || rawMessage.toLowerCase().includes('api key')) {
    return "Gemini API access was denied. Please check that your API key is valid and allowed to use this model.";
  }

  if (rawMessage.includes('"code":404') || rawMessage.toLowerCase().includes('model')) {
    return "The selected Gemini model is not available for this API key. Please check the model name or API access.";
  }

  return "Failed to analyze the document. Please try again or check your text.";
};

// Define the schema for the structured response we want from Gemini
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: {
      type: Type.STRING,
      enum: ["pre_completion_opt", "post_completion_opt", "stem_opt_extension", "travel_and_reentry", "sevis_or_i20", "general_opt_status", "unsure"],
      description: "Classify the main topic of the document."
    },
    topicLabel: {
      type: Type.STRING,
      description: "Human-readable label for the topic, e.g. 'STEM OPT Extension' or 'Travel & Re-entry'."
    },
    riskAssessment: {
      type: Type.OBJECT,
      properties: {
        riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Conservative risk level assessment." },
        urgencyLabel: { type: Type.STRING, description: "e.g., 'Within 7 days', 'Before program end', 'As soon as possible'" },
        summary: { type: Type.STRING, description: "1-3 short sentences summarizing the risk/urgency. Not legal advice." },
      },
      required: ["riskLevel", "urgencyLabel", "summary"],
      description: "An assessment of the urgency and risk associated with the document.",
    },
    summary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-6 bullet points summarizing the key content in English.",
    },
    detailedExplanation: {
      type: Type.STRING,
      description: "A friendly, detailed paragraph in English explaining the situation as if to a friend.",
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
          actor: { type: Type.STRING, description: "Who needs to do this? e.g. 'Student', 'School (DSO)', 'Employer'" },
          title: { type: Type.STRING, description: "Short action title in English" },
          description: { type: Type.STRING, description: "Clear instruction on what to do in English" },
          dueCategory: { 
            type: Type.STRING, 
            enum: ["today", "this_week", "before_program_end", "after_approval", "unspecified"],
            description: "Approximate timeframe for the task."
          },
          dueLabel: { type: Type.STRING, description: "Human-readable due date label, e.g. 'Within 30 days'." },
          priority: { 
            type: Type.STRING, 
            enum: ["high", "medium", "low"],
            description: "Importance/Risk level. 'high' if legal status is at risk or deadline is immediate."
          },
          timeBucket: {
            type: Type.STRING,
            enum: ["today", "this_week", "later", "unspecified"],
            description: "Simplified timing bucket for filtering."
          }
        },
        required: ["category", "title", "description", "dueCategory", "dueLabel", "priority", "timeBucket"],
      },
      description: "A list of concrete action items extracted from the text.",
    },
    importantDates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "YYYY-MM-DD when possible, otherwise the original date text." },
          meaning: { type: Type.STRING, description: "What this date appears to refer to based only on the document." },
          confidence: { type: Type.STRING, enum: ["high", "medium", "low"], description: "Confidence that the date and meaning are clear from the document." },
        },
        required: ["date", "meaning", "confidence"],
      },
      description: "Important dates or deadlines explicitly mentioned in the document. Do not invent dates.",
    },
    documentsMentioned: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Document name mentioned in the input." },
          purpose: { type: Type.STRING, description: "Why the document may be needed, based only on the input." },
        },
        required: ["name", "purpose"],
      },
      description: "Documents, forms, IDs, or evidence mentioned in the document.",
    },
    questionsToAsk: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Questions to ask a DSO, employer, attorney, or official source.",
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Unclear points, important caveats, or reminders to verify with official sources.",
    },
    safetyTerms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "The difficult English term (e.g., 'Grace Period')" },
          definition: { type: Type.STRING, description: "A simple definition of the term in English." },
        },
        required: ["term", "definition"],
      },
      description: "A glossary of complex immigration terms found in the text.",
    },
    dsoEmailDraft: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING, description: "A clear, professional subject line for the email." },
        body: { type: Type.STRING, description: "The email body text." },
      },
      required: ["subject", "body"],
      description: "A draft email the student can send to their DSO to ask for help regarding this document.",
    },
    dsoQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-7 specific questions the student should ask their DSO based on the risks and instructions in the text.",
    },
  },
  required: ["topic", "topicLabel", "riskAssessment", "summary", "detailedExplanation", "simpleEnglishNotes", "checklist", "importantDates", "documentsMentioned", "questionsToAsk", "warnings", "safetyTerms", "dsoEmailDraft", "dsoQuestions"],
};

export const createMockAnalysisResult = (): AnalysisResult => ({
  topic: "post_completion_opt",
  topicLabel: "OPT or STEM OPT Instructions",
  riskAssessment: {
    riskLevel: "Medium",
    urgencyLabel: "Verify dates before filing",
    summary: "This document appears to explain steps for preparing an OPT or STEM OPT application. Some dates and requirements should be confirmed with your DSO or official source before you act.",
  },
  summary: [
    "This document appears to explain steps for preparing an OPT or STEM OPT application.",
    "It mentions reviewing school records, preparing forms, and submitting materials before a deadline.",
    "The exact requirements may depend on your school, employer, and immigration situation.",
  ],
  detailedExplanation:
    "This document appears to be giving instructions for an OPT or STEM OPT process. It may be asking you to review your I-20 information, prepare immigration forms and supporting documents, and confirm filing timing with your school official. VisaTodo cannot determine eligibility or replace official guidance, so use this as a checklist starter and verify important details with your DSO, employer, attorney, or official government source.",
  simpleEnglishNotes:
    "In simple terms: gather the documents listed, check the dates carefully, and ask your DSO to confirm what applies to you before submitting anything.",
  checklist: [
    {
      category: "School",
      actor: "Student",
      title: "Review your I-20 information",
      description: "Check that your name, program dates, and OPT or STEM OPT details look correct before using the document for an application.",
      dueCategory: "unspecified",
      dueLabel: "Before submitting materials",
      priority: "high",
      timeBucket: "unspecified",
    },
    {
      category: "Documents",
      actor: "Student",
      title: "Prepare required forms and supporting documents",
      description: "Collect the documents mentioned in the instructions, such as Form I-765, passport, I-94, and any applicable EAD card.",
      dueCategory: "unspecified",
      dueLabel: "Verify deadline with DSO",
      priority: "medium",
      timeBucket: "later",
    },
    {
      category: "Verification",
      actor: "Student",
      title: "Confirm deadlines with your DSO",
      description: "Ask your DSO which deadline controls your situation and whether any school-specific steps are required first.",
      dueCategory: "unspecified",
      dueLabel: "Before filing",
      priority: "high",
      timeBucket: "unspecified",
    },
    {
      category: "USCIS",
      actor: "Student",
      title: "Submit materials before the listed deadline",
      description: "Only submit after you have verified the instructions, dates, and required documents with the appropriate official source.",
      dueCategory: "unspecified",
      dueLabel: "Verify with official source",
      priority: "medium",
      timeBucket: "later",
    },
  ],
  importantDates: [
    {
      date: "Verify with official source",
      meaning: "The pasted text may contain a deadline, but the exact date should be confirmed before filing.",
      confidence: "low",
    },
  ],
  documentsMentioned: [
    { name: "I-20", purpose: "Used to confirm school and OPT or STEM OPT recommendation information." },
    { name: "Form I-765", purpose: "Commonly used for employment authorization applications when instructed." },
    { name: "Passport", purpose: "May be needed as identity or immigration-status support." },
    { name: "I-94", purpose: "May be needed to show admission record information." },
    { name: "EAD card if applicable", purpose: "May be needed for STEM OPT or prior employment authorization context." },
  ],
  questionsToAsk: [
    "Which deadline applies to my situation?",
    "Does my I-20 need to be updated before I submit anything?",
    "Which documents are required by my school before filing?",
    "Is there anything in this document that does not apply to my case?",
  ],
  warnings: [
    "This is a mock analysis preview and not legal advice.",
    "Do not rely on unclear dates without checking the official source.",
  ],
  safetyTerms: [
    { term: "DSO", definition: "A school official who helps international students with F-1 records and school immigration processes." },
    { term: "EAD", definition: "An employment authorization document, sometimes called a work permit card." },
  ],
  dsoQuestions: [
    "Which deadline applies to my situation?",
    "Does my I-20 need to be updated before I submit anything?",
    "Which documents are required by my school before filing?",
  ],
});

export const analyzeDocument = async (
  situation: VisaSituation,
  text: string
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    return createMockAnalysisResult();
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
You are a helpful, empathetic, and precise assistant for international students (specifically F-1 visa holders) in the US.
Your goal is to help them understand complex English immigration documents by explaining them in **Plain English**.

**User Context & Situation**
The user is in the situation: "${situation}".

Use this situation to interpret the document. If the document is about a different context, explain both:
(a) what the document actually says, and
(b) how it applies (or doesn't apply) to the user's selected situation.

**Situation-Specific Analysis Guidelines:**
- If the situation is "F-1 – OPT application phase": Highlight actions and deadlines relevant *before* OPT is approved (e.g. filing I-765, mailing deadlines, not working yet).
- If the situation is "F-1 – During OPT" or "F-1 – On post-completion OPT": Focus on work authorization, EAD validity, unemployment limits, and SEVP portal reporting requirements.
- If the situation is "F-1 – STEM OPT extension": Emphasize 24-month extension rules, Form I-983, E-Verify requirements, and reporting validation reports (6-month).
- If the situation is "Other / not sure": Provide a general explanation and clearly state which parts may not apply. Encourage the user to confirm details with their DSO.

**General Guidelines:**
1. **Language**: Output ALL content in **English** (Plain English).
2. **Tone**: Calm, reassuring, and conservative. Do not induce panic.
3. **Safety**: NEVER give legal advice. If a text is ambiguous, tell the user to check with their DSO (Designated School Official) or an attorney.
4. **Privacy**: Do not repeat personal data like specific names or ID numbers in the output unless necessary for context.
5. **Tailoring**: Always adjust the risk level, deadlines (timeline), and action items based on the user's situation. If the situation and the document conflict, clearly explain that.
6. **Scope**: Summarize only based on the provided text. Do not invent missing deadlines, requirements, or eligibility conclusions.
7. **Careful Language**: Use phrases like "This document appears to..." and "You may need to verify..." when the document is unclear.

Requirements:
- **Topic Classification**: Classify the main topic of this document.
- **Risk Assessment**: Provide a conservative risk level (Low/Medium/High) and an urgency label based on the user's situation. Never guarantee outcomes.
- **Checklist**:
  - Assign an approximate **dueCategory**.
  - Assign a **priority**. Use 'high' for immediate deadlines or risks to legal status.
  - Identify who is responsible (Actor).
- **DSO Email Draft**: Draft a polite, professional email ('dsoEmailDraft') the student can send to their DSO.
- **DSO Questions**: Generate a separate list of 3-7 specific questions ('dsoQuestions') that the student should ask their DSO.
- **Important Dates**: Extract only dates that appear in the text. If the meaning is unclear, mark confidence low and say to verify.
- **Documents Mentioned**: List documents/forms explicitly mentioned or clearly implied by the text, with plain-language purposes.
- **Warnings**: Include caveats about unclear instructions, dates, or requirements.
- **Disclaimer**: Always remind the user to verify with official USCIS sources, their DSO, or a qualified immigration attorney.

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
    throw new Error(getGeminiErrorMessage(error));
  }
};

export const translateAnalysis = async (
  analysis: AnalysisResult,
  checklistItems: ChecklistItem[],
  targetLang: TranslationLanguageCode
): Promise<TranslatedAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  if (targetLang === 'none') {
    throw new Error("No target language specified.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Get readable label for the language
  const languageOption = SUPPORTED_TRANSLATION_LANGUAGES.find(l => l.code === targetLang);
  const targetLanguageName = languageOption ? languageOption.label : targetLang;

  const translationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      riskCard: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, description: `Translate '${analysis.riskAssessment?.riskLevel}' to ${targetLanguageName}` },
          urgencyLabel: { type: Type.STRING, description: `Translate '${analysis.riskAssessment?.urgencyLabel}' to ${targetLanguageName}` },
          summary: { type: Type.STRING, description: "Translate the risk summary" },
        },
        required: ["riskLevel", "urgencyLabel", "summary"]
      },
      summaryBullets: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: `Translate the main summary bullets to ${targetLanguageName}`
      },
      detailedExplanation: {
        type: Type.STRING,
        description: `Translate the detailed explanation to ${targetLanguageName}. Keep paragraph structure.`
      },
      simpleEnglishNote: {
        type: Type.STRING,
        description: `Translate the simple English note to ${targetLanguageName}`
      },
      checklistItems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Keep this EXACTLY as provided in the input." },
            title: { type: Type.STRING, description: `Translate the checklist item title to ${targetLanguageName}` },
            description: { type: Type.STRING, description: `Translate the checklist item description to ${targetLanguageName}` },
          },
          required: ["id", "title", "description"]
        }
      },
      keyTerms: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING, description: "The original English term (do not translate)." },
            explanation: { type: Type.STRING, description: `Translate the definition/explanation to ${targetLanguageName}` },
          },
          required: ["term", "explanation"]
        }
      },
      dsoEmailNote: {
        type: Type.STRING,
        description: `Write a short note in ${targetLanguageName} explaining that the email draft above is in English because it must be sent to the school official in English.`
      }
    },
    required: ["riskCard", "summaryBullets", "detailedExplanation", "checklistItems", "keyTerms", "dsoEmailNote"]
  };

  const checklistInput = checklistItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description
  }));

  const termsInput = analysis.safetyTerms.map(t => ({
    term: t.term,
    definition: t.definition
  }));

  const inputData = {
    riskAssessment: analysis.riskAssessment,
    summary: analysis.summary,
    detailedExplanation: analysis.detailedExplanation,
    simpleEnglishNotes: analysis.simpleEnglishNotes,
    checklist: checklistInput,
    safetyTerms: termsInput
  };

  const systemInstruction = `
    You are a translation assistant for an immigration document explanation app.
    Your task is to translate the provided content into **${targetLanguageName}**.
    
    Guidelines:
    1. Use natural, everyday language suitable for international students.
    2. Do NOT add new legal advice. Translate the meaning accurately.
    3. Keep the "id" fields in checklist items EXACTLY the same as the input.
    4. For key terms, keep the "term" in English, but translate the "explanation/definition".
    5. Be concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: JSON.stringify(inputData) }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: translationSchema,
        temperature: 0.3
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No translation generated");
    
    const result = JSON.parse(jsonText);
    return {
      language: targetLang,
      ...result
    };
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error(getGeminiErrorMessage(error));
  }
};

export const askFollowUpQuestion = async (
  documentText: string | null,
  analysisResult: AnalysisResult | null,
  question: string,
  mode: 'document' | 'general'
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let systemInstruction = '';

  if (mode === 'document') {
    if (!documentText || !analysisResult) {
      // Fallback if missing context, though UI should prevent this
      return "I can't answer questions about the document because the document context is missing.";
    }

    const contextSummary = `
      Topic: ${analysisResult.topicLabel}
      Risk: ${analysisResult.riskAssessment?.riskLevel}
      Key Summary Points: ${analysisResult.summary.join('; ')}
    `;

    systemInstruction = `
      You are a helpful immigration assistant answering a follow-up question about a specific document.
      
      Context:
      - User Situation: F-1 Student.
      - Document Content: "${documentText.substring(0, 2000)}..." (truncated if too long)
      - Analysis Context: ${contextSummary}
      
      Constraints:
      1. Answer briefly (2-5 sentences).
      2. Use plain English.
      3. Do NOT provide legal advice.
      4. If the answer involves a specific decision or legal risk, explicitly encourage contacting the DSO or an attorney.
      5. Directly answer the user's question based on the provided document text and analysis.
    `;
  } else {
    // General mode
    systemInstruction = `
      You are a helpful educational assistant for US immigration topics (specifically F-1 student visas and OPT/STEM OPT).
      
      User Question: "${question}"

      Constraints:
      1. Answer based on general public knowledge of US F-1 visa rules.
      2. Do NOT provide legal advice.
      3. Be concise (2-5 sentences).
      4. If the question is about specific case details you don't know, suggest contacting their Designated School Official (DSO).
      5. Do NOT make up facts. If you are unsure, say so.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: "user", parts: [{ text: question }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      },
    });

    return response.text || "I'm sorry, I couldn't generate an answer.";
  } catch (error) {
    console.error("Follow-up Q&A Error:", error);
    throw new Error(getGeminiErrorMessage(error));
  }
};
