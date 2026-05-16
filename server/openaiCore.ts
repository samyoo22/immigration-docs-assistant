import OpenAI from "openai";
import {
  AnalysisResult,
  ChecklistItem,
  SUPPORTED_TRANSLATION_LANGUAGES,
  TranslatedAnalysis,
  TranslationLanguageCode,
  VisaSituation,
} from "../types";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

class PublicApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new PublicApiError("OPENAI_API_KEY is missing on the server. Add it to your local .env or deployment environment variables.");
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const normalizeOpenAIError = (error: unknown): PublicApiError => {
  if (error instanceof PublicApiError) return error;

  const maybeError = error as { status?: number; message?: string; code?: string };
  const status = maybeError?.status;
  const rawMessage = maybeError?.message || String(error);
  const lower = rawMessage.toLowerCase();

  if (status === 401 || lower.includes("api key")) {
    return new PublicApiError("OpenAI API access was denied. Please check your OPENAI_API_KEY.", 401);
  }

  if (status === 429 || lower.includes("rate limit") || lower.includes("quota")) {
    return new PublicApiError("OpenAI API quota or rate limit was reached. Please check billing, limits, or try again later.", 429);
  }

  if (status === 404 || lower.includes("model")) {
    return new PublicApiError("The selected OpenAI model is not available for this API key. Check OPENAI_MODEL or your account access.", 400);
  }

  return new PublicApiError("The AI request failed. Please try again in a moment.", 500);
};

const parseJsonOutput = <T>(outputText: string): T => {
  try {
    return JSON.parse(outputText) as T;
  } catch {
    throw new PublicApiError("The AI response was not valid JSON. Please try again.", 502);
  }
};

const requestJson = async <T>({
  schemaName,
  schema,
  system,
  user,
  temperature = 0.3,
}: {
  schemaName: string;
  schema: Record<string, unknown>;
  system: string;
  user: string;
  temperature?: number;
}): Promise<T> => {
  try {
    const client = getClient();
    const response = await client.responses.create({
      model: OPENAI_MODEL,
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    });

    if (!response.output_text) {
      throw new PublicApiError("The AI response was empty. Please try again.", 502);
    }

    return parseJsonOutput<T>(response.output_text);
  } catch (error) {
    throw normalizeOpenAIError(error);
  }
};

const stringField = (description: string, extra: Record<string, unknown> = {}) => ({
  type: "string",
  description,
  ...extra,
});

const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topic: stringField("Classify the main topic of the document.", {
      enum: ["pre_completion_opt", "post_completion_opt", "stem_opt_extension", "travel_and_reentry", "sevis_or_i20", "general_opt_status", "unsure"],
    }),
    topicLabel: stringField("Human-readable label for the topic."),
    riskAssessment: {
      type: "object",
      additionalProperties: false,
      properties: {
        riskLevel: stringField("Conservative risk level.", { enum: ["Low", "Medium", "High"] }),
        urgencyLabel: stringField("Plain-language urgency label."),
        summary: stringField("1-3 short sentences summarizing risk or urgency. Not legal advice."),
      },
      required: ["riskLevel", "urgencyLabel", "summary"],
    },
    summary: {
      type: "array",
      items: { type: "string" },
      description: "3-6 plain-English summary bullets.",
    },
    detailedExplanation: stringField("Friendly detailed explanation in plain English."),
    simpleEnglishNotes: stringField("Very simple English note explaining the most important point."),
    checklist: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: stringField("Task category, such as Documents, School, USCIS, Employer."),
          actor: stringField("Who should do this, such as Student, DSO, Employer, USCIS."),
          title: stringField("Short action title."),
          description: stringField("Clear instruction."),
          dueCategory: stringField("Approximate timeframe.", {
            enum: ["today", "this_week", "before_program_end", "after_approval", "unspecified"],
          }),
          dueLabel: stringField("Human-readable due date label."),
          priority: stringField("Task priority.", { enum: ["high", "medium", "low"] }),
          timeBucket: stringField("Simplified timing bucket.", { enum: ["today", "this_week", "later", "unspecified"] }),
        },
        required: ["category", "actor", "title", "description", "dueCategory", "dueLabel", "priority", "timeBucket"],
      },
    },
    importantDates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          date: stringField("YYYY-MM-DD when possible, otherwise original date text."),
          meaning: stringField("What this date appears to refer to."),
          confidence: stringField("Confidence based only on the document.", { enum: ["high", "medium", "low"] }),
        },
        required: ["date", "meaning", "confidence"],
      },
    },
    documentsMentioned: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: stringField("Document or form name mentioned."),
          purpose: stringField("Plain-language purpose based only on the input."),
        },
        required: ["name", "purpose"],
      },
    },
    questionsToAsk: {
      type: "array",
      items: { type: "string" },
      description: "Questions for a DSO, attorney, employer, school official, or official source.",
    },
    warnings: {
      type: "array",
      items: { type: "string" },
      description: "Unclear points, caveats, and verification reminders.",
    },
    safetyTerms: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          term: stringField("Difficult term from the document."),
          definition: stringField("Plain-English definition."),
        },
        required: ["term", "definition"],
      },
    },
    dsoEmailDraft: {
      type: "object",
      additionalProperties: false,
      properties: {
        subject: stringField("Clear professional subject line."),
        body: stringField("Email body."),
      },
      required: ["subject", "body"],
    },
    dsoQuestions: {
      type: "array",
      items: { type: "string" },
      description: "Specific DSO questions based on the document.",
    },
  },
  required: [
    "topic",
    "topicLabel",
    "riskAssessment",
    "summary",
    "detailedExplanation",
    "simpleEnglishNotes",
    "checklist",
    "importantDates",
    "documentsMentioned",
    "questionsToAsk",
    "warnings",
    "safetyTerms",
    "dsoEmailDraft",
    "dsoQuestions",
  ],
};

const translationJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    riskCard: {
      type: "object",
      additionalProperties: false,
      properties: {
        riskLevel: { type: "string" },
        urgencyLabel: { type: "string" },
        summary: { type: "string" },
      },
      required: ["riskLevel", "urgencyLabel", "summary"],
    },
    summaryBullets: { type: "array", items: { type: "string" } },
    detailedExplanation: { type: "string" },
    simpleEnglishNote: { type: "string" },
    checklistItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["id", "title", "description"],
      },
    },
    keyTerms: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          term: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["term", "explanation"],
      },
    },
    dsoEmailNote: { type: "string" },
  },
  required: ["riskCard", "summaryBullets", "detailedExplanation", "simpleEnglishNote", "checklistItems", "keyTerms", "dsoEmailNote"],
};

const answerJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string" },
  },
  required: ["answer"],
};

export const analyzeWithOpenAI = async (situation: VisaSituation, text: string): Promise<AnalysisResult> => {
  const system = `
You are VisaTodo, a friendly, careful immigration paperwork assistant.

Your job is to help students, immigrants, and visa applicants understand confusing documents in plain English.

Rules:
- Do not provide legal advice.
- Do not guarantee eligibility, approval, or outcomes.
- Use calm, plain-language, checklist-oriented wording.
- Base the answer only on the provided document and selected user situation.
- Do not invent missing dates, requirements, or legal conclusions.
- If a document is unclear, say what to verify with a DSO, attorney, employer, school official, USCIS, or another official source.
- Avoid repeating highly sensitive personal identifiers.
`;

  const user = `
Selected situation: ${situation}

Analyze this immigration or visa-related document and return the required JSON.

Document:
${text}
`;

  return requestJson<AnalysisResult>({
    schemaName: "visa_document_analysis",
    schema: analysisJsonSchema,
    system,
    user,
    temperature: 0.2,
  });
};

export const translateWithOpenAI = async (
  analysis: AnalysisResult,
  checklistItems: ChecklistItem[],
  targetLang: TranslationLanguageCode
): Promise<TranslatedAnalysis> => {
  if (targetLang === "none") {
    throw new PublicApiError("No target language specified.", 400);
  }

  const languageOption = SUPPORTED_TRANSLATION_LANGUAGES.find((l) => l.code === targetLang);
  const targetLanguageName = languageOption ? languageOption.label : targetLang;

  const system = `
You are a translation assistant for VisaTodo.
Translate the provided immigration document explanation into ${targetLanguageName}.

Rules:
- Keep meaning accurate.
- Do not add new legal advice.
- Use natural everyday language for international students and visa applicants.
- Keep checklist item id values exactly the same.
- Keep key term names in English, but translate explanations.
`;

  const user = JSON.stringify({
    riskAssessment: analysis.riskAssessment,
    summary: analysis.summary,
    detailedExplanation: analysis.detailedExplanation,
    simpleEnglishNotes: analysis.simpleEnglishNotes,
    checklist: checklistItems.map((item) => ({ id: item.id, title: item.title, description: item.description })),
    safetyTerms: analysis.safetyTerms.map((term) => ({ term: term.term, definition: term.definition })),
  });

  const result = await requestJson<Omit<TranslatedAnalysis, "language">>({
    schemaName: "visa_translation",
    schema: translationJsonSchema,
    system,
    user,
    temperature: 0.2,
  });

  return { language: targetLang, ...result };
};

export const answerWithOpenAI = async ({
  documentText,
  analysisResult,
  question,
  mode,
}: {
  documentText: string | null;
  analysisResult: AnalysisResult | null;
  question: string;
  mode: "document" | "general";
}): Promise<string> => {
  const context =
    mode === "document" && documentText && analysisResult
      ? `
Document context:
Topic: ${analysisResult.topicLabel}
Risk: ${analysisResult.riskAssessment?.riskLevel}
Summary: ${analysisResult.summary.join("; ")}
Document excerpt: ${documentText.substring(0, 2000)}
`
      : "No specific document context. Answer as general educational information.";

  const system = `
You are VisaTodo, a helpful immigration paperwork assistant.

Answer briefly in 2-5 sentences.
Use plain English.
Do not provide legal advice.
If the question involves legal risk, eligibility, deadlines, or a case-specific decision, recommend confirming with a DSO, attorney, employer, school official, USCIS, or another official source.
`;

  const result = await requestJson<{ answer: string }>({
    schemaName: "visa_followup_answer",
    schema: answerJsonSchema,
    system,
    user: `${context}\n\nQuestion: ${question}`,
    temperature: 0.3,
  });

  return result.answer;
};

export const toHttpError = (error: unknown) => {
  const normalized = normalizeOpenAIError(error);
  return {
    statusCode: normalized.statusCode,
    body: { error: normalized.message },
  };
};
