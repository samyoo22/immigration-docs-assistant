export type MessageTemplateCategory = {
  id: 'dso-school' | 'employer-hr' | 'attorney';
  title: string;
  description: string;
  templates: MessageTemplate[];
};

export type MessageTemplate = {
  id: string;
  title: string;
  bestFor: string;
  subject: string;
  body: string;
};

export const messageTemplateCategories: MessageTemplateCategory[] = [
  {
    id: 'dso-school',
    title: 'DSO / School',
    description: 'Ask your school to confirm OPT, STEM OPT, SEVP reporting, or student record details.',
    templates: [
      {
        id: 'dso-opt-i20',
        title: 'Ask DSO about OPT I-20',
        bestFor: 'When you are preparing your OPT application and need to confirm your updated I-20.',
        subject: 'Question about my OPT I-20',
        body: `Hi [DSO Name],

I'm preparing my OPT application and wanted to confirm the next step.

Could you please help me confirm:
1. Has my OPT recommendation been added to SEVIS?
2. Is my updated I-20 ready to use for Form I-765?
3. Is there a school-specific deadline or instruction I should follow?

Thank you,
[Your Name]`,
      },
      {
        id: 'dso-stem-eligibility',
        title: 'Ask DSO about STEM OPT eligibility',
        bestFor: 'When you want to confirm whether your degree, employer, and timing fit STEM OPT requirements.',
        subject: 'Question about STEM OPT eligibility',
        body: `Hi [DSO Name],

I'm reviewing my STEM OPT eligibility and would like to confirm the school process before I prepare my application.

Could you please help me confirm:
1. Is my degree eligible for STEM OPT based on my school record?
2. What documents should I prepare before requesting the STEM OPT I-20?
3. Is there a school-specific timing rule or deadline I should follow?

Thank you,
[Your Name]`,
      },
      {
        id: 'dso-ead-start-date',
        title: 'Ask DSO about EAD start date',
        bestFor: 'When you need to confirm when you may start or continue employment.',
        subject: 'Question about my EAD start date',
        body: `Hi [DSO Name],

I wanted to confirm my work authorization timing before I start or continue employment.

Could you please help me confirm:
1. Which EAD start date should I follow?
2. Are there any school reporting steps I need to complete before working?
3. Should I wait for any additional confirmation before starting work?

Thank you,
[Your Name]`,
      },
      {
        id: 'dso-sevp-reporting',
        title: 'Ask DSO about SEVP reporting',
        bestFor: 'When you need help reporting employment, address, or other OPT information.',
        subject: 'Question about SEVP reporting',
        body: `Hi [DSO Name],

I would like to make sure my OPT reporting is current.

Could you please help me confirm:
1. What information should I report right now?
2. Should I use the SEVP Portal or report through the school system?
3. Is there anything else I should update in my student record?

Thank you,
[Your Name]`,
      },
      {
        id: 'dso-address-transfer',
        title: 'Ask DSO about address or school transfer issue',
        bestFor: 'When you moved, changed contact information, or have a school transfer question.',
        subject: 'Question about my SEVIS record update',
        body: `Hi [DSO Name],

I need help confirming an update to my student record.

Could you please help me confirm:
1. What information should I update for my address, contact details, or school transfer?
2. Is there a deadline for reporting this change?
3. Do I need a new or updated I-20?

Thank you,
[Your Name]`,
      },
    ],
  },
  {
    id: 'employer-hr',
    title: 'Employer / HR',
    description: 'Ask HR about work authorization documents, start dates, and employment records.',
    templates: [
      {
        id: 'hr-work-authorization-document',
        title: 'Ask HR about work authorization document',
        bestFor: 'When you want to confirm whether HR needs a current or updated EAD or other work authorization document.',
        subject: 'Question about my work authorization document',
        body: `Hi [Name],

I wanted to confirm whether you need any updated work authorization document from me.

Could you please help me confirm:
1. Do you need a copy of my current or updated EAD card?
2. Should I wait for a specific authorization date before starting or continuing work?
3. Is there anything I should update in the HR system?

Thank you,
[Your Name]`,
      },
      {
        id: 'hr-ead-start-date',
        title: 'Ask HR about EAD start date',
        bestFor: 'When your start date depends on the date printed on your EAD card.',
        subject: 'Question about my EAD start date',
        body: `Hi [Name],

I want to make sure my work start date follows my employment authorization document.

Could you please help me confirm:
1. Which start date should HR use for my records?
2. Do you need a copy of my EAD card before I start?
3. Is there anything else I should complete before my first work day?

Thank you,
[Your Name]`,
      },
      {
        id: 'hr-documents-needed',
        title: 'Ask HR what documents they need',
        bestFor: 'When you are starting, continuing, or updating work authorization with an employer.',
        subject: 'Question about documents needed for HR',
        body: `Hi [Name],

I'm checking what documents HR needs from me for work authorization or onboarding.

Could you please help me confirm:
1. Which documents should I provide?
2. Is there a preferred upload location or format?
3. Is there a deadline for submitting these documents?

Thank you,
[Your Name]`,
      },
    ],
  },
  {
    id: 'attorney',
    title: 'Attorney',
    description: 'Ask an immigration attorney about notices, deadlines, risks, and document preparation.',
    templates: [
      {
        id: 'attorney-uscis-notice',
        title: 'Ask attorney about USCIS notice',
        bestFor: 'When you received or reviewed a USCIS notice and need help understanding the next step.',
        subject: 'Question about USCIS notice',
        body: `Hi [Attorney Name],

I received or reviewed a USCIS notice and would like help understanding the next step.

Could you please help me confirm:
1. What action, if any, is required?
2. Are there any deadlines or risks I should be aware of?
3. What documents should I prepare before responding or taking action?

Thank you,
[Your Name]`,
      },
      {
        id: 'attorney-deadline-risk',
        title: 'Ask attorney about deadline or filing risk',
        bestFor: 'When a filing window, response deadline, or status issue could affect your immigration plans.',
        subject: 'Question about immigration deadline or filing risk',
        body: `Hi [Attorney Name],

I would like help reviewing a possible deadline or filing risk in my immigration situation.

Could you please help me confirm:
1. What deadline should I be watching?
2. What happens if the timing is missed or delayed?
3. What documents or facts should I send you for review?

Thank you,
[Your Name]`,
      },
      {
        id: 'attorney-documents-prepare',
        title: 'Ask attorney what documents to prepare',
        bestFor: 'When you want to organize documents before an attorney review or filing step.',
        subject: 'Question about documents to prepare',
        body: `Hi [Attorney Name],

I would like to prepare the right documents before the next immigration step.

Could you please help me confirm:
1. Which documents should I gather first?
2. Are there any documents that need signatures, translations, or updated versions?
3. How should I organize the files for your review?

Thank you,
[Your Name]`,
      },
    ],
  },
];
