import {
  AnalysisResult,
  ChecklistItem,
  TranslatedAnalysis,
  TranslationLanguageCode,
  VisaSituation,
} from "../types";

class ApiRequestError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

const unique = (items: string[]) => Array.from(new Set(items));

const findMentionedDocuments = (text: string) => {
  const documentPatterns = [
    { pattern: /\bI-?20\b/i, name: "I-20", purpose: "School immigration record document for F-1 students." },
    { pattern: /\bI-?765\b/i, name: "Form I-765", purpose: "Application form commonly used for employment authorization." },
    { pattern: /\bI-?94\b/i, name: "I-94", purpose: "Arrival/departure record used to confirm admission information." },
    { pattern: /\bEAD\b|employment authorization document/i, name: "EAD", purpose: "Employment authorization document or work permit card." },
    { pattern: /\bSEVIS\b/i, name: "SEVIS record", purpose: "Government record system for certain student and exchange visitor statuses." },
    { pattern: /\bpassport\b/i, name: "Passport", purpose: "Identity and travel document." },
    { pattern: /\bUSCIS\b/i, name: "USCIS notice or instruction", purpose: "Official immigration agency communication or requirement." },
    { pattern: /\bO-?1A\b/i, name: "O-1A visa", purpose: "Visa category referenced in the pasted document." },
    { pattern: /\bO-?1B\b/i, name: "O-1B visa", purpose: "Visa category referenced in the pasted document." },
    { pattern: /\bO-?2\b/i, name: "O-2 visa", purpose: "Visa category referenced in the pasted document." },
  ];

  return documentPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ name, purpose }) => ({ name, purpose }));
};

const findImportantDates = (text: string) => {
  const matches = text.match(
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{1,2},?\s+\d{4}\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/gi
  );

  return unique(matches || []).slice(0, 5).map((date) => ({
    date,
    meaning: "Date mentioned in the pasted document. Confirm what this date controls before acting.",
    confidence: "medium" as const,
  }));
};

export const createPreviewAnalysisResult = (
  situation: VisaSituation,
  text: string
): AnalysisResult => {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const excerpt = normalizedText.length > 220 ? `${normalizedText.slice(0, 220)}...` : normalizedText;
  const documentsMentioned = findMentionedDocuments(normalizedText);
  const importantDates = findImportantDates(normalizedText);
  const topicLabel = situation === VisaSituation.OTHER ? "Document Review" : `${situation} Guidance`;

  return {
    topic: "basic_review",
    topicLabel,
    riskAssessment: {
      riskLevel: "Medium",
      urgencyLabel: "Verify with an official source",
      summary: "This review is a plain-language starting point based on the document text you provided. Verify important details with an official source before acting.",
    },
    summary: [
      `The pasted document starts with: "${excerpt}"`,
      documentsMentioned.length > 0
        ? `It appears to mention: ${documentsMentioned.map((doc) => doc.name).join(", ")}.`
        : "It appears to contain immigration or visa-related instructions, but no common form names were confidently detected.",
      importantDates.length > 0
        ? "The document includes date-like text that should be confirmed before you act."
        : "No clear date was detected, but you should still check the document for deadlines.",
    ],
    detailedExplanation:
      "We generated a basic plain-language review from the text you provided. Use it to identify likely next steps, documents, and questions to verify with a DSO, attorney, employer, school official, USCIS, or another official source.",
    simpleEnglishNotes:
      "In simple terms: use this as a starting point to spot terms, dates, and questions to confirm before taking action.",
    checklist: [
      {
        category: "Verification",
        actor: "Applicant",
        title: "Confirm this document applies to your exact immigration situation",
        description: `Check the document against your selected situation: ${situation}.`,
        dueCategory: "unspecified",
        dueLabel: "Before acting on the document",
        priority: "high",
        timeBucket: "unspecified",
      },
      {
        category: "Deadlines",
        actor: "Applicant",
        title: "Verify any deadline or filing window",
        description: "Confirm dates directly with the official source before submitting forms or making travel/employment decisions.",
        dueCategory: "unspecified",
        dueLabel: "Before submitting anything",
        priority: "high",
        timeBucket: "unspecified",
      },
      {
        category: "Questions",
        actor: "Applicant",
        title: "Ask what action is required next",
        description: "Send the document to the appropriate school official, attorney, employer contact, or USCIS resource and ask what action is required.",
        dueCategory: "unspecified",
        dueLabel: "As soon as practical",
        priority: "medium",
        timeBucket: "later",
      },
    ],
    importantDates,
    documentsMentioned,
    questionsToAsk: [
      "Does this document apply to my exact immigration or visa situation?",
      "What action, if any, do I need to take next?",
      "Which deadline controls my situation?",
      "Which documents or forms should I prepare?",
    ],
    warnings: [
      "General information only. Verify with an official source.",
    ],
    safetyTerms: documentsMentioned.map((doc) => ({
      term: doc.name,
      definition: doc.purpose,
    })),
    dsoEmailDraft: {
      subject: "Question about immigration document instructions",
      body: "Hello,\n\nI reviewed the attached/pasted instructions and would like to confirm what applies to my situation, what deadline I should follow, and what documents or next steps are required.\n\nThank you.",
    },
    dsoQuestions: [
      "Does this document apply to my situation?",
      "What deadline should I follow?",
      "What should I do next?",
    ],
  };
};

export const createMockAnalysisResult = (warning?: string): AnalysisResult => ({
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
    ...(warning ? [warning] : []),
    "General information only. Verify with an official source.",
    "Do not rely on unclear dates without checking the official source.",
  ],
  safetyTerms: [
    { term: "DSO", definition: "A school official who helps international students with F-1 records and school immigration processes." },
    { term: "EAD", definition: "An employment authorization document, sometimes called a work permit card." },
  ],
  dsoEmailDraft: {
    subject: "Question about OPT or STEM OPT instructions",
    body: "Hello,\n\nI reviewed the attached instructions and would like to confirm the deadlines, required documents, and next steps that apply to my situation.\n\nThank you.",
  },
  dsoQuestions: [
    "Which deadline applies to my situation?",
    "Does my I-20 need to be updated before I submit anything?",
    "Which documents are required by my school before filing?",
  ],
});

const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError("The AI server could not be reached. Please check the deployment or try again later.");
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => ({})) : {};

  if (!isJson) {
    throw new ApiRequestError("The AI server returned a non-JSON response. Please check the deployment configuration.", response.status);
  }

  if (!response.ok) {
    const fallbackMessage =
      response.status === 404
        ? "The AI server endpoint is not available in this deployment."
        : "The AI request failed. Please try again.";

    throw new ApiRequestError(payload.error || fallbackMessage, response.status);
  }

  return payload as T;
};

export const analyzeDocument = async (
  situation: VisaSituation,
  text: string
): Promise<AnalysisResult> => {
  try {
    return await postJson<AnalysisResult>("/api/analyze", { situation, text });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const statusCode = error instanceof ApiRequestError ? error.statusCode : undefined;
    const canUsePreview =
      statusCode === 404 ||
      (typeof statusCode === "number" && statusCode >= 500) ||
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("ai request failed") ||
      message.toLowerCase().includes("deployment configuration") ||
      message.toLowerCase().includes("model is not available") ||
      message.toLowerCase().includes("request options") ||
      message.toLowerCase().includes("schema was rejected") ||
      message.toLowerCase().includes("server could not be reached") ||
      message.toLowerCase().includes("server endpoint is not available") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("access was denied");

  if (canUsePreview) {
      return createPreviewAnalysisResult(situation, text);
    }

    throw error;
  }
};

export const translateAnalysis = async (
  analysis: AnalysisResult,
  checklistItems: ChecklistItem[],
  targetLang: TranslationLanguageCode
): Promise<TranslatedAnalysis> => {
  return postJson<TranslatedAnalysis>("/api/translate", {
    analysis,
    checklistItems,
    targetLang,
  });
};

export const askFollowUpQuestion = async (
  documentText: string | null,
  analysisResult: AnalysisResult | null,
  question: string,
  mode: "document" | "general"
): Promise<string> => {
  const payload = await postJson<{ answer: string }>("/api/ask", {
    documentText,
    analysisResult,
    question,
    mode,
  });

  return payload.answer;
};
