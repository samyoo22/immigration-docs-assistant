
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
      heroTitle: "Understand your US visa emails",
      heroTitleSuffix: "in plain English.",
      heroSubtitle: "Immigration Docs Assistant · For F-1 students & immigrants",
      heroSubtitleSupport: "Paste an F-1 or visa-related email and get a plain-English explanation, action checklist, and optional Korean summary.",
      badge: "English first · Multilingual prototype (KO · ZH · HI · JA) · Not legal advice",
      step1: "Step 1 of 2 · Tell us about your situation",
      situationLabel: "1. Choose your situation",
      situationHelper: "We’ll use this to tailor your explanation and checklist.",
      btnSample: "Start with sample text",
      btnCustom: "Or paste my own email",
      agreement: "By using this tool, you acknowledge that it does not provide legal advice. Always consult official sources.",
      previewLabel: "Preview of your results",
      howItWorks: "How it works: 1) Choose your situation · 2) Paste your email · 3) Get a clear explanation and checklist.",
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
          title: "Korean summary (optional)",
          desc: "View a Korean summary alongside English if you need it."
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
      termPlaceholder: "분석 후 용어가 여기에 표시됩니다.",
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
  },
  // Placeholders for future languages
  ko: {
    common: {
      appName: "Immigration Docs Assistant",
      appSuffix: "",
      tagline: "F-1 유학생 및 이민자를 위해",
      poweredBy: "Gemini 3 Pro 기반",
      legalDisclaimer: "이 도구는 교육 및 정보 제공용이며 법적 조언이 아닙니다. 이민 규정은 자주 변경됩니다. 중요한 마감일과 요구 사항은 항상 학교 공식 고문(DSO)이나 자격 있는 이민 변호사와 확인하십시오.",
      legalTitle: "법적 조언 아님",
      privacyNote: "개인정보 보호: 주민번호, 여권번호, SEVIS ID 등을 전체 입력하지 마세요.",
      copyright: "© 2024 Immigration Docs Assistant Prototype",
      readMore: "전체 면책 조항 읽기",
      readLess: "접기",
      errorTitle: "문제가 발생했습니다",
      retry: "잠시 후 다시 시도해주세요. 문제가 지속되면 문서를 짧게 줄이거나 페이지를 새로고침하세요.",
    },
    landing: {
      heroTitle: "Understand your US visa emails",
      heroTitleSuffix: "in plain English.",
      heroSubtitle: "Immigration Docs Assistant · For F-1 유학생 & Immigrants",
      heroSubtitleSupport: "이메일을 붙여넣으면 쉬운 영어 설명, 체크리스트, 그리고 한국어 요약을 드립니다.",
      badge: "영어 우선 · 영어+한국어 프로토타입 · 법적 조언 아님",
      step1: "1단계 · 현재 상황을 알려주세요",
      situationLabel: "1. 나의 상황 / 신분 선택",
      situationHelper: "상황에 맞춰 설명과 체크리스트를 제공해 드립니다.",
      btnSample: "샘플 텍스트로 시작하기",
      btnCustom: "내 이메일 붙여넣기",
      agreement: "이 도구를 사용함으로써 법적 조언이 아님을 인지합니다. 항상 공식 출처를 확인하세요.",
      previewLabel: "결과 미리보기",
      howItWorks: "사용 방법: 1) 상황 선택 · 2) 이메일 붙여넣기 · 3) 명확한 설명과 체크리스트 받기",
      features: {
        plainEnglish: {
          title: "쉬운 영어 설명",
          desc: "복잡한 비자 이메일을 쉬운 일상 언어로 이해하세요."
        },
        checklist: {
          title: "체크리스트 & 타임라인",
          desc: "긴급도에 따라 정리된 구체적인 다음 단계를 확인하세요."
        },
        korean: {
          title: "한국어 요약 (선택 사항)",
          desc: "필요한 경우 영어와 함께 한국어 요약을 볼 수 있습니다."
        }
      },
      previewCaption: "이런 식의 명확한 설명과 체크리스트를 받게 됩니다."
    },
    workspace: {
      backButton: "처음으로",
      step2Header: "2단계(총 2단계)",
      step2Subtitle: "문서 검토 및 설명 생성",
      situationTitle: "현재 상황",
      contextLabel: "상황 / 문맥",
      inputLabel: "문서 텍스트",
      expand: "확대",
      clearText: "지우기",
      charCount: "{{count}}자",
      modalTitle: "문서 텍스트 편집",
      saveAndClose: "저장 후 닫기",
      cancel: "취소",
      inputHelper: "여권 번호나 주민번호 등 민감한 정보는 제외해 주세요.",
      editable: "수정 가능",
      placeholder: "영어 이메일이나 지침을 여기에 붙여넣으세요. 분석 전에 내용을 수정할 수 있습니다.",
      btnAnalyze: "설명 및 체크리스트 생성",
      btnAnalyzing: "분석 중...",
      btnHelper: "문서를 분석하여 쉬운 설명과 체크리스트를 오른쪽에 표시합니다.",
      analyzing: "분석 중...",
      analyzingDesc: "문서를 분석하고 있습니다... 몇 초 정도 걸릴 수 있습니다.",
      tabExplain: "설명",
      tabChecklist: "체크리스트",
      tabSafety: "안전 및 리소스",
      emptyStateTitle: "분석 준비 완료",
      emptyStateDesc: "왼쪽 문서를 확인한 후 '설명 및 체크리스트 생성' 버튼을 클릭하세요.",
      emptyChecklist: "분석 후 체크리스트가 여기에 표시됩니다.",
      emptySafety: "분석 후 주요 용어와 리소스가 여기에 표시됩니다.",
      toast: {
        successGeneric: "클립보드에 복사되었습니다.",
        successEmail: "이메일 초안이 복사되었습니다.",
        error: "복사 실패. 수동으로 복사해주세요."
      }
    },
    results: {
      detectedTopic: "감지된 주제:",
      detectedTopicTooltip: "문서를 기반으로 한 AI 추측입니다. 항상 학교 DSO나 공식 USCIS 안내를 따르세요.",
      sessionSummaryTitle: "세션 요약",
      sessionSummaryCopy: "전체 요약 복사",
      sessionSummaryDisclaimer: "빠른 개요로만 사용하세요. 법적 조언이 아닙니다.",
      riskTitle: "위험 및 긴급도",
      riskDisclaimer: "AI가 생성한 평가이며 법적 조언이 아닙니다.",
      firstSteps: "첫 단계:",
      firstStepsLow: "아래 체크리스트를 검토하고 불확실한 점이 있으면 DSO와 상담하세요.",
      firstStepsMedium: "체크리스트를 주의 깊게 따르고 DSO에게 문의하여 이해한 내용을 확인하세요.",
      firstStepsHigh: "위험한 행동(예: 근무)을 즉시 중단하고 가능한 한 빨리 DSO에게 연락하세요.",
      summaryTitle: "빠른 요약",
      koreanSummaryTitle: "한국어 요약",
      detailedTitle: "상세 설명",
      showFull: "전체 설명 보기",
      hideFull: "설명 접기",
      copyBtn: "설명 복사",
      copyChecklist: "체크리스트 복사",
      copyNotes: "노트 복사",
      copied: "복사됨!",
      simpleEnglishTitle: "쉬운 영어 노트",
      checklistTitle: "할 일 체크리스트",
      timelineTitle: "타임라인 보기",
      timelineSubtitle: "수행 시기에 따라 정리된 동일한 작업 목록입니다.",
      who: "담당:",
      noItems: "발견된 할 일이 없습니다.",
      keyTermsTitle: "주요 용어 설명",
      dsoQuestionsTitle: "DSO에게 물어볼 질문",
      dsoQuestionsNote: "이 질문들은 제안 사항일 뿐입니다. DSO가 추가 정보를 요청할 수 있습니다.",
      officialResourcesTitle: "공식 리소스",
      officialResourcesNote: "* 가장 정확한 정보는 항상 .gov 웹사이트나 학교(.edu) 공식 포털을 참고하세요.",
      termPlaceholder: "분석 후 용어가 여기에 표시됩니다.",
      timeline: {
        today: "오늘 / 가능한 한 빨리",
        this_week: "7일 이내",
        before_program_end: "프로그램 종료 전",
        after_approval: "승인 후 / 나중에",
        unspecified: "시기 미지정"
      },
      langToggle: {
        enOnly: "영어만",
        enKo: "영어 + 한국어"
      },
      dsoEmail: {
        title: "DSO에게 이메일 보내기",
        desc: "학교 담당자(DSO)에게 도움을 요청할 때 사용할 수 있는 AI 초안입니다. 보내기 전에 반드시 검토하고 수정하세요.",
        btnGenerate: "DSO 이메일 초안 보기",
        btnCopy: "이메일 복사",
        disclaimer: "이 초안은 AI가 생성한 것으로 편의를 위해 제공됩니다. 법적 조언이 아니므로 보내기 전에 반드시 내용을 확인하세요."
      }
    }
  },
  // Shallow copies for others initially
  zh: null, 
  hi: null,
  ja: null,
} as const;

// Fallback logic
export const t = (locale: Locale, path: string, params?: Record<string, string | number>): string => {
  const parts = path.split('.');
  let current: any = translations[locale] || translations['en'];
  
  // If locale exists but specific key is missing, fall back to English
  if (!current) current = translations['en'];

  for (const part of parts) {
    if (current[part] === undefined) {
      // Fallback to English if key missing in target locale
      let enCurrent: any = translations['en'];
      for (const enPart of parts) {
         enCurrent = enCurrent?.[enPart];
      }
      current = enCurrent || path;
      break;
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
