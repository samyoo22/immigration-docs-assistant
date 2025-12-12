
import { Locale } from '../types';

export const translations = {
  en: {
    common: {
      appName: "Immigration Docs Assistant",
      appSuffix: "", 
      tagline: "For F-1 students & immigrants",
      poweredBy: "Powered by Gemini 3 Pro",
      legalDisclaimer: "This tool is for educational purposes only. Immigration rules change frequently. Always confirm important deadlines and requirements with your school's official advisor (DSO) or a qualified immigration attorney.",
      legalTitle: "Not Legal Advice",
      privacyNote: "Privacy Note: Do not paste full SSNs, Passport Numbers, or SEVIS IDs.",
      copyright: "© 2024 Immigration Docs Assistant Prototype",
      readMore: "Read full disclaimer",
      readLess: "Show less",
      errorTitle: "Something went wrong",
      retry: "Please try again in a few seconds. If the problem persists, shorten the document or refresh the page.",
    },
    landing: {
      heroTitle: "Make US immigration documents",
      heroTitleSuffix: "easy to understand.",
      heroSubtitle: "Immigration Docs Assistant · For F-1 students & immigrants",
      heroSubtitleSupport: "Paste any F-1 or US immigration document text (emails, notices, instructions) and get a plain-language explanation, action checklist, and optional translations.",
      badge: "English first · Translations: KO, ZH, HI, JA (beta) · Not legal advice",
      step1: "Step 1 of 2 · Tell us about your situation",
      situationLabel: "1. Choose your situation",
      situationHelper: "We’ll use this to tailor your explanation and checklist.",
      btnSample: "Start with sample text",
      btnCustom: "Or paste my own email",
      agreement: "By using this tool, you acknowledge that it does not provide legal advice. Always consult official sources.",
      previewLabel: "Preview of your results",
      howItWorks: "How it works: Choose your situation → Paste your document text → Get a clear explanation and checklist.",
      features: {
        plainEnglish: {
          title: "Plain-English explanation",
          desc: "See what your visa email means in everyday language."
        },
        checklist: {
          title: "Checklist & timeline",
          desc: "Get concrete next steps organized by urgency."
        },
        korean: {
          title: "Multilingual summaries",
          desc: "Translate results into Korean, Chinese, Hindi, or Japanese."
        }
      },
      previewCaption: "You’ll get a clear explanation and checklist like this."
    },
    workspace: {
      backButton: "Back to Start",
      step2Header: "Step 2 of 2",
      step2Subtitle: "Review your document and generate your explanation",
      situationTitle: "Your situation",
      contextLabel: "Situation context",
      inputLabel: "Document Text",
      expand: "Expand",
      clearText: "Clear text",
      charCount: "{{count}} chars",
      modalTitle: "Edit document text",
      saveAndClose: "Save & Close",
      cancel: "Cancel",
      inputHelper: "Avoid entering passport numbers, SSNs, or other highly sensitive IDs.",
      editable: "Editable",
      placeholder: "Paste the full email or instructions here. You can edit the text before running the analysis.",
      btnAnalyze: "Explain & Generate Checklist",
      btnAnalyzing: "Analyzing...",
      btnHelper: "We’ll analyze your document and show a plain-language explanation and checklist on the right.",
      analyzing: "Analyzing...",
      analyzingDesc: "Analyzing your document... This may take a few seconds.",
      tabExplain: "Explanation",
      tabChecklist: "Checklist",
      tabSafety: "Safety & resources",
      emptyStateTitle: "Ready to Analyze",
      emptyStateDesc: "Review your document on the left, then click 'Explain & Generate Checklist' to see the results here.",
      emptyChecklist: "Checklist items will appear here after analysis.",
      emptySafety: "Key terms and resources will appear here after analysis.",
      toast: {
        successGeneric: "Copied to clipboard.",
        successEmail: "Email draft copied to clipboard.",
        error: "Copy failed. Please copy manually."
      }
    },
    results: {
      detectedTopic: "Detected topic:",
      detectedTopicTooltip: "This is an AI-generated guess based on your document. Always rely on your school's DSO or official USCIS guidance.",
      sessionSummaryTitle: "Session summary",
      sessionSummaryCopy: "Copy full summary",
      sessionSummaryDisclaimer: "Use this as a quick overview. It is not legal advice.",
      riskTitle: "Risk & Urgency",
      riskDisclaimer: "This is an AI-generated assessment and is not legal advice.",
      firstSteps: "First steps:",
      firstStepsLow: "Review the checklist below and talk to your DSO if anything is unclear.",
      firstStepsMedium: "Follow the checklist carefully and contact your DSO to confirm your understanding.",
      firstStepsHigh: "Stop any risky actions (like working) immediately and contact your DSO as soon as possible.",
      summaryTitle: "Quick Summary",
      koreanSummaryTitle: "Korean Summary",
      detailedTitle: "Detailed Explanation",
      showFull: "Show full explanation",
      hideFull: "Hide full explanation",
      copyBtn: "Copy explanation",
      copyChecklist: "Copy checklist",
      copyNotes: "Copy notes",
      copied: "Copied!",
      simpleEnglishTitle: "Simple English Note",
      checklistTitle: "Your Action Checklist",
      timelineTitle: "Timeline view",
      timelineSubtitle: "Same tasks, organized by when to do them.",
      who: "Who:",
      noItems: "No action items detected yet.",
      keyTermsTitle: "Key Terms",
      dsoQuestionsTitle: "Questions to ask your DSO",
      dsoQuestionsNote: "These questions are suggestions only. Your DSO may ask you for more information.",
      officialResourcesTitle: "Official Resources",
      officialResourcesNote: "* Always rely on .gov websites or your school's (.edu) official portal for the most accurate information.",
      termPlaceholder: "Terms will appear here after analysis.",
      timeline: {
        today: "Today / As soon as possible",
        this_week: "Within the next 7 days",
        before_program_end: "Before your program end date",
        after_approval: "After approval / later",
        unspecified: "Timing not specified"
      },
      langToggle: {
        enOnly: "EN only",
        enKo: "EN + KR"
      },
      dsoEmail: {
        title: "Email your DSO",
        desc: "Use this AI-generated draft email to ask your school's international advisor (DSO) for help. Please review and edit it before sending.",
        btnGenerate: "Generate email to my DSO",
        btnCopy: "Copy email draft",
        disclaimer: "This is an AI-generated draft for your convenience. It is not legal advice. Always review and edit before sending."
      }
    }
  }
} as const;

// Fallback logic for basic replacement since we are now EN-only
export const t = (locale: Locale, path: string, params?: Record<string, string | number>): string => {
  const parts = path.split('.');
  let current: any = translations['en']; // Always fallback to EN
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return path;
    }
    current = current[part];
  }

  // Handle parameter substitution (e.g., {{count}})
  if (typeof current === 'string' && params) {
    let result = current;
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return result;
  }

  return current;
};
