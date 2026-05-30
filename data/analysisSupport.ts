import { DraftMessages, OfficialSource, VisaSituation } from '../types';

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
  const dso = {
    subject: 'Question about my F-1 OPT document',
    body: `Hi [DSO Name],

I reviewed this document and wanted to confirm the next step for my F-1 OPT situation.

Could you please help me confirm:
1. Does this document apply to my current situation?
2. Is there any deadline or filing window I should be aware of?
3. Do I need to prepare any additional documents or take any action?

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

  return 'Confirm whether this document applies to your exact immigration situation before taking action.';
};
