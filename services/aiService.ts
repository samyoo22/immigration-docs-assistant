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
    "This is a mock analysis preview and not legal advice.",
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
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : {};

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
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("server could not be reached") ||
      message.toLowerCase().includes("server endpoint is not available") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("access was denied");

    if (canUsePreview) {
      return createMockAnalysisResult("The AI service is not available in this environment, so this is a mock preview result.");
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
