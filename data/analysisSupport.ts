import { DraftMessages, OfficialSource, UserIntent, VerificationItem, VisaSituation } from '../types';

export const RESULT_DISCLAIMER =
  'VIsatodo is not a law firm and does not provide legal advice. Use this review as a planning tool and verify important details with USCIS, your DSO, employer, or a qualified immigration attorney.';

const optSources: OfficialSource[] = [
  {
    title: 'USCIS Form I-765',
    description: 'Official USCIS page for employment authorization applications.',
    url: 'https://www.uscis.gov/i-765',
  },
  {
    title: 'USCIS Case Status',
    description: 'Use your receipt number to check USCIS case status.',
    url: 'https://egov.uscis.gov/casestatus/landing.do',
  },
  {
    title: 'Study in the States: OPT',
    description: 'Official DHS guidance for F-1 Optional Practical Training.',
    url: 'https://studyinthestates.dhs.gov/students/work/optional-practical-training',
  },
  {
    title: 'SEVP Portal',
    description: 'Official SEVP Portal help for student reporting tasks.',
    url: 'https://studyinthestates.dhs.gov/sevp-portal-help',
  },
];

const stemOptSources: OfficialSource[] = [
  {
    title: 'USCIS Form I-765',
    description: 'Official USCIS page for employment authorization applications.',
    url: 'https://www.uscis.gov/i-765',
  },
  {
    title: 'Study in the States: STEM OPT Hub',
    description: 'Official DHS STEM OPT hub for students and employers.',
    url: 'https://studyinthestates.dhs.gov/stem-opt-hub',
  },
  {
    title: 'Form I-983 information',
    description: 'Official DHS page for the STEM OPT training plan.',
    url: 'https://studyinthestates.dhs.gov/form-i-983-overview',
  },
  {
    title: 'SEVP Portal',
    description: 'Official SEVP Portal help for student reporting tasks.',
    url: 'https://studyinthestates.dhs.gov/sevp-portal-help',
  },
];

const genericSources: OfficialSource[] = [
  {
    title: 'USCIS',
    description: 'Official U.S. Citizenship and Immigration Services website.',
    url: 'https://www.uscis.gov/',
  },
  {
    title: 'USCIS Case Status',
    description: 'Check a pending USCIS case using a receipt number.',
    url: 'https://egov.uscis.gov/casestatus/landing.do',
  },
  {
    title: 'Study in the States',
    description: 'Official DHS information for F and M students.',
    url: 'https://studyinthestates.dhs.gov/',
  },
];

export const getOfficialSourcesForSituation = (situation: VisaSituation | string): OfficialSource[] => {
  if (situation === VisaSituation.F1_OPT_APPLY || situation === VisaSituation.I765 || situation === VisaSituation.EAD_ISSUE) {
    return optSources;
  }

  if (situation === VisaSituation.F1_OPT_ACTIVE) {
    return stemOptSources;
  }

  if (situation === VisaSituation.H1B) {
    return [
      {
        title: 'USCIS H-1B Specialty Occupations',
        description: 'Official USCIS information for H-1B specialty occupation workers.',
        url: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations',
      },
      {
        title: 'USCIS Case Status',
        description: 'Check a pending USCIS case using a receipt number.',
        url: 'https://egov.uscis.gov/casestatus/landing.do',
      },
    ];
  }

  if (situation === VisaSituation.I539 || situation === VisaSituation.CHANGE_OF_STATUS) {
    return [
      {
        title: 'USCIS Form I-539',
        description: 'Official USCIS page for extension or change of nonimmigrant status.',
        url: 'https://www.uscis.gov/i-539',
      },
      {
        title: 'USCIS Case Status',
        description: 'Check a pending USCIS case using a receipt number.',
        url: 'https://egov.uscis.gov/casestatus/landing.do',
      },
      {
        title: 'USCIS',
        description: 'Official U.S. Citizenship and Immigration Services website.',
        url: 'https://www.uscis.gov/',
      },
    ];
  }

  return genericSources;
};

export const getDraftMessagesForSituation = (situation: VisaSituation | string): DraftMessages => {
  const dso =
    situation === VisaSituation.F1_OPT_ACTIVE
      ? {
          subject: 'Question about my STEM OPT eligibility',
          body: `Hi [DSO Name],

I’m preparing for my STEM OPT extension and wanted to confirm the next step.

Could you please help me confirm:
1. Is my degree and CIP code eligible for the STEM OPT extension?
2. Is my employer information and E-Verify status sufficient for my school process?
3. What school-specific deadline or Form I-983 step should I follow?

Thank you,
[Your Name]`,
        }
      : {
          subject: 'Question about my OPT I-20',
          body: `Hi [DSO Name],

I’m preparing my OPT application and wanted to confirm the next step.

Could you please help me confirm:
1. Has my OPT recommendation been added to SEVIS?
2. Is my updated I-20 ready to use for Form I-765?
3. Is there a school-specific deadline or instruction I should follow?

Thank you,
[Your Name]`,
        };

  const employer = {
    subject: 'Question about my work authorization document',
    body: `Hi [Name],

I wanted to confirm how this document may affect my work authorization or employment start date.

Could you please help me confirm:
1. Do you need any additional document from me?
2. Should I wait for any specific authorization date before starting or continuing work?
3. Is there anything I should update with HR?

Thank you,
[Your Name]`,
  };

  const attorney = {
    subject: 'Immigration document review question',
    body: `Hi [Attorney Name],

I received or reviewed this immigration-related document and would like help understanding the next step.

Could you please help me confirm:
1. What action, if any, is required?
2. Are there any deadlines or risks I should be aware of?
3. Are there any documents I should prepare before responding or taking action?

Thank you,
[Your Name]`,
  };

  if (
    situation === VisaSituation.F1_OPT_APPLY ||
    situation === VisaSituation.F1_OPT_ACTIVE ||
    situation === VisaSituation.SCHOOL_TRANSFER ||
    situation === VisaSituation.I765 ||
    situation === VisaSituation.EAD_ISSUE
  ) {
    return { dso, employer, attorney };
  }

  if (situation === VisaSituation.H1B) {
    return { employer, attorney };
  }

  return { attorney };
};

export const getRecommendedNextStepForSituation = (situation: VisaSituation | string) => {
  if (situation === VisaSituation.F1_OPT_APPLY) {
    return 'Check this document with your DSO before submitting anything or making travel, school transfer, or employment decisions.';
  }

  if (situation === VisaSituation.F1_OPT_ACTIVE) {
    return 'Confirm your STEM OPT timing, employer eligibility, and Form I-983 steps with your DSO before filing Form I-765.';
  }

  return 'Confirm whether this document applies to your exact immigration situation before taking action.';
};

export const getVerificationItemsForSituation = (
  situation: VisaSituation | string,
  helpGoal?: UserIntent | string,
): VerificationItem[] => {
  const common: VerificationItem[] = [
    {
      title: 'Whether this document applies to your current status',
      description: 'Confirm that the document matches your current immigration status and next step before acting.',
      importance: 'high',
    },
    {
      title: 'Any deadline or filing window',
      description: 'Use the document and official source together before relying on a date or filing window.',
      importance: 'high',
    },
    {
      title: 'Whether an official source confirms the requirement',
      description: 'Check USCIS, Study in the States, your school, or another official source before submitting anything.',
      importance: 'medium',
    },
  ];

  if (situation === VisaSituation.F1_OPT_APPLY || situation === VisaSituation.I765) {
    return [
      {
        title: 'Your OPT I-20 and DSO recommendation',
        description: 'Confirm your school has recommended OPT in SEVIS and that your updated I-20 is ready for Form I-765.',
        importance: 'high',
      },
      {
        title: 'Your Form I-765 filing timing',
        description: 'Ask your DSO which filing window and school-specific instructions apply before submitting to USCIS.',
        importance: 'high',
      },
      {
        title: 'Your EAD start date before working',
        description: 'Do not start work until you have confirmed the authorization date that applies to your case.',
        importance: 'high',
      },
      ...common.slice(2),
    ];
  }

  if (situation === VisaSituation.F1_OPT_ACTIVE) {
    return [
      {
        title: 'Your STEM degree and CIP code eligibility',
        description: 'Confirm your degree, CIP code, and school records support STEM OPT eligibility.',
        importance: 'high',
      },
      {
        title: 'Your employer E-Verify and training plan details',
        description: 'Confirm employer eligibility and Form I-983 details with your DSO and employer before filing.',
        importance: 'high',
      },
      {
        title: 'Your STEM OPT filing window and pending-work rules',
        description: 'Ask your DSO what timing applies and whether you may continue working while the extension is pending.',
        importance: 'high',
      },
      {
        title: 'Your reporting requirements',
        description: 'Verify validation reports, evaluations, and material-change reporting instructions with your school.',
        importance: 'medium',
      },
    ];
  }

  if (helpGoal === UserIntent.ASK_EMPLOYER || situation === VisaSituation.H1B) {
    return [
      {
        title: 'Whether your employer needs updated documentation',
        description: 'Confirm whether HR needs a receipt notice, approval notice, EAD card, or other work authorization document.',
        importance: 'high',
      },
      ...common,
    ];
  }

  return common;
};

export const getConfidenceForSituation = (
  situation: VisaSituation | string,
  verificationItems: VerificationItem[],
) => {
  const hasHighVerification = verificationItems.some((item) => item.importance === 'high');

  if (situation === VisaSituation.OTHER || hasHighVerification) {
    return {
      confidenceLevel: 'medium' as const,
      confidenceNote: 'Some details need verification before you act, especially deadlines, eligibility, and school or USCIS requirements.',
    };
  }

  return {
    confidenceLevel: 'high' as const,
    confidenceNote: 'This review looks straightforward, but you should still confirm important details with an official source.',
  };
};
