import OpenAI from "openai";
import {
  AnalysisResult,
  ChecklistItem,
  SUPPORTED_TRANSLATION_LANGUAGES,
  TranslatedAnalysis,
  TranslationLanguageCode,
  VisaSituation,
} from "../types";
import {
  getDraftMessagesForSituation,
  getOfficialSourcesForSituation,
  getRecommendedNextStepForSituation,
  RESULT_DISCLAIMER,
} from "../data/analysisSupport";

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

  if (status === 400 && (lower.includes("temperature") || lower.includes("unsupported parameter"))) {
    return new PublicApiError("The selected OpenAI model rejected one of the request options. The server retried with compatible options but the request still failed.", 400);
  }

  if (status === 400 && (lower.includes("schema") || lower.includes("json_schema"))) {
    return new PublicApiError("The AI response schema was rejected by the selected model. Please check OPENAI_MODEL compatibility.", 400);
  }

  if (
    status === 404 ||
    lower.includes("does not exist") ||
    lower.includes("do not have access") ||
    lower.includes("not available for this api key")
  ) {
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
  const createResponse = async (includeTemperature: boolean) => {
    const request = {
      model: OPENAI_MODEL,
      input: [
        { role: "system" as const, content: system },
        { role: "user" as const, content: user },
      ],
      text: {
        format: {
          type: "json_schema" as const,
          name: schemaName,
          strict: true,
          schema,
        },
      },
      ...(includeTemperature ? { temperature } : {}),
    };

    return getClient().responses.create(request);
  };

  try {
    let response: Awaited<ReturnType<typeof createResponse>>;

    try {
      response = await createResponse(true);
    } catch (error) {
      const maybeError = error as { status?: number; message?: string };
      const lower = (maybeError?.message || "").toLowerCase();
      const shouldRetryWithoutTemperature =
        maybeError?.status === 400 &&
        (lower.includes("temperature") || lower.includes("unsupported parameter"));

      if (!shouldRetryWithoutTemperature) {
        throw error;
      }

      response = await createResponse(false);
    }

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
    documentType: stringField("Likely document type, such as DSO email, USCIS receipt notice, OPT I-20 instructions, RFE, or general immigration document."),
    situation: stringField("Selected or inferred user situation."),
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
    recommendedNextStep: stringField("One calm, action-oriented next step. Avoid legal advice."),
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
    officialSources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: stringField("Official source title."),
          description: stringField("Short explanation of why this source helps."),
          url: stringField("Official government or school-related URL."),
        },
        required: ["title", "description", "url"],
      },
    },
    draftMessages: {
      type: "object",
      additionalProperties: false,
      properties: {
        dso: {
          type: "object",
          additionalProperties: false,
          properties: {
            subject: stringField("DSO message subject, or empty string if irrelevant."),
            body: stringField("DSO message body, or empty string if irrelevant."),
          },
          required: ["subject", "body"],
        },
        employer: {
          type: "object",
          additionalProperties: false,
          properties: {
            subject: stringField("Employer or HR message subject, or empty string if irrelevant."),
            body: stringField("Employer or HR message body, or empty string if irrelevant."),
          },
          required: ["subject", "body"],
        },
        attorney: {
          type: "object",
          additionalProperties: false,
          properties: {
            subject: stringField("Attorney message subject, or empty string if irrelevant."),
            body: stringField("Attorney message body, or empty string if irrelevant."),
          },
          required: ["subject", "body"],
        },
      },
      required: ["dso", "employer", "attorney"],
    },
    disclaimer: stringField("Short disclaimer that this is general information and not legal advice."),
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
    "documentType",
    "situation",
    "topic",
    "topicLabel",
    "riskAssessment",
    "summary",
    "recommendedNextStep",
    "detailedExplanation",
    "simpleEnglishNotes",
    "checklist",
    "importantDates",
    "documentsMentioned",
    "questionsToAsk",
    "officialSources",
    "draftMessages",
    "disclaimer",
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

const normalizeAnalysisResult = (result: AnalysisResult, situation: VisaSituation): AnalysisResult => ({
  ...result,
  documentType: result.documentType || result.topicLabel || "Immigration document",
  situation: result.situation || situation,
  recommendedNextStep: result.recommendedNextStep || getRecommendedNextStepForSituation(situation),
  officialSources: getOfficialSourcesForSituation(situation),
  draftMessages: getDraftMessagesForSituation(situation),
  disclaimer: result.disclaimer || RESULT_DISCLAIMER,
});

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
- Always return the required structured JSON object.
- Always identify a likely document type, even if cautious.
- Extract important dates only when the date text is explicitly present.
- Always provide a recommended next step, action items, questions to ask, official sources, draft message templates, and a disclaimer.
- For F-1 OPT and I-765 documents, prioritize DSO confirmation, OPT I-20, Form I-765, USCIS receipt notice, EAD timing, SEVP/school reporting, employment start date restrictions, address updates, and case status tracking.
- Do not present uncertain information as fact. Use "appears to", "may", and "verify with an official source" where appropriate.
- Official source links must be official government or school-related sources. If unsure, use USCIS, USCIS Case Status, and Study in the States.
`;

  const user = `
Selected situation: ${situation}

Analyze this immigration or visa-related document and return the required JSON.

Document:
${text}
`;

  const result = await requestJson<AnalysisResult>({
    schemaName: "visa_document_analysis",
    schema: analysisJsonSchema,
    system,
    user,
    temperature: 0.2,
  });

  return normalizeAnalysisResult(result, situation);
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
    body: { error: "We couldn't create a full review this time. Please try again or paste a clearer document excerpt." },
  };
};
