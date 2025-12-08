
import { Locale } from '../types';

export const translations = {
  en: {
    common: {
      appName: "Immigration Docs",
      appSuffix: "Assistant",
      tagline: "For F-1 Students",
      poweredBy: "Powered by Gemini 3 Pro",
      legalDisclaimer: "This tool is for educational purposes only. Immigration rules change frequently. Always confirm important deadlines and requirements with your school's official advisor (DSO) or a qualified immigration attorney.",
      legalTitle: "Not Legal Advice",
      privacyNote: "Privacy Note: Do not paste full SSNs, Passport Numbers, or SEVIS IDs.",
      copyright: "© 2024 Immigration Docs Assistant Prototype",
    },
    landing: {
      heroTitle: "Immigration Docs",
      heroTitleSuffix: "Assistant",
      heroSubtitle: "Paste your visa or school email, get a simple explanation and a to-do checklist.",
      heroSubtitleSupport: "Easy-to-understand explanations and checklists for F-1 students and immigrants.",
      badge: "Multilingual Support · Not legal advice",
      step1: "Step 1 of 3 · What do you need help with?",
      intentEmail: "Understand an email about my visa",
      intentOpt: "Check what I need to do for OPT",
      intentGeneral: "Understand general visa instructions",
      situationLabel: "My Status / Situation",
      btnSample: "Start with sample text",
      btnCustom: "Or paste my own text",
      agreement: "By using this tool, you acknowledge that it does not provide legal advice. Always consult official sources.",
    },
    workspace: {
      backButton: "Back to Start",
      goalLabel: "Goal:",
      contextLabel: "Situation Context",
      inputLabel: "Document Text",
      editable: "Editable",
      placeholder: "Paste your English email or instructions here...",
      btnAnalyze: "Explain & Generate Checklist",
      analyzing: "Analyzing...",
      tabExplain: "Explanation",
      tabChecklist: "Checklist",
      emptyStateTitle: "Ready to Analyze",
      emptyStateDesc: "Review your input on the left and click Explain & Generate Checklist to see the results here.",
    },
    results: {
      summaryTitle: "Quick Summary",
      detailedTitle: "Detailed Explanation",
      simpleEnglishTitle: "Simple English Note",
      checklistTitle: "Your Action Checklist",
      noItems: "No action items detected yet.",
      keyTermsTitle: "Key Terms",
      officialResourcesTitle: "Official Resources",
      officialResourcesNote: "* Always rely on .gov websites or your school's (.edu) official portal for the most accurate information.",
      termPlaceholder: "Terms will appear here after analysis."
    }
  },
  // Placeholders for future languages
  ko: {
    common: {
      appName: "Immigration Docs",
      appSuffix: "Assistant",
      tagline: "F-1 학생을 위한 도우미",
      poweredBy: "Gemini 3 Pro 기반",
      legalDisclaimer: "이 도구는 교육 및 정보 제공용이며 법적 조언이 아닙니다. 이민 규정은 자주 변경됩니다. 중요한 마감일과 요구 사항은 항상 학교 공식 고문(DSO)이나 자격 있는 이민 변호사와 확인하십시오.",
      legalTitle: "법적 조언 아님",
      privacyNote: "개인정보 보호: 주민번호, 여권번호, SEVIS ID 등을 전체 입력하지 마세요.",
      copyright: "© 2024 Immigration Docs Assistant Prototype",
    },
    landing: {
      heroTitle: "Immigration Docs",
      heroTitleSuffix: "Assistant",
      heroSubtitle: "비자나 학교 이메일을 붙여넣으면, 쉬운 설명과 할 일 체크리스트를 드립니다.",
      heroSubtitleSupport: "F-1 유학생과 이민자를 위한 쉬운 설명 및 체크리스트.",
      badge: "다국어 지원 · 법적 조언 아님",
      step1: "1단계 · 어떤 도움이 필요하신가요?",
      intentEmail: "비자 관련 이메일 이해하기",
      intentOpt: "OPT 관련 할 일 확인하기",
      intentGeneral: "일반 비자 지침 이해하기",
      situationLabel: "나의 상황 / 신분",
      btnSample: "샘플 텍스트로 시작하기",
      btnCustom: "내 텍스트 붙여넣기",
      agreement: "이 도구를 사용함으로써 법적 조언이 아님을 인지합니다. 항상 공식 출처를 확인하세요.",
    },
    workspace: {
      backButton: "처음으로",
      goalLabel: "목표:",
      contextLabel: "상황 / 문맥",
      inputLabel: "문서 텍스트",
      editable: "수정 가능",
      placeholder: "영어 이메일이나 지침을 여기에 붙여넣으세요...",
      btnAnalyze: "설명 및 체크리스트 생성",
      analyzing: "분석 중...",
      tabExplain: "설명",
      tabChecklist: "체크리스트",
      emptyStateTitle: "분석 준비 완료",
      emptyStateDesc: "왼쪽 내용을 확인하고 버튼을 눌러 결과를 확인하세요.",
    },
    results: {
      summaryTitle: "빠른 요약",
      detailedTitle: "상세 설명",
      simpleEnglishTitle: "쉬운 영어 노트",
      checklistTitle: "할 일 체크리스트",
      noItems: "발견된 할 일이 없습니다.",
      keyTermsTitle: "주요 용어 설명",
      officialResourcesTitle: "공식 리소스",
      officialResourcesNote: "* 가장 정확한 정보는 항상 .gov 웹사이트나 학교(.edu) 공식 포털을 참고하세요.",
      termPlaceholder: "분석 후 용어가 여기에 표시됩니다."
    }
  },
  // Shallow copies for others initially
  zh: null, 
  hi: null,
  ja: null,
} as const;

// Fallback logic
export const t = (locale: Locale, path: string): string => {
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
      return enCurrent || path;
    }
    current = current[part];
  }
  return current;
};
