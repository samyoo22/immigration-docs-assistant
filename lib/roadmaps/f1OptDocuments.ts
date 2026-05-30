export type DocumentGroup = {
  id: string;
  title: string;
  description: string;
  documents: string[];
};

export const f1OptDocumentGroups: DocumentGroup[] = [
  {
    id: 'school-request',
    title: 'Before school request',
    description: 'Documents and details to gather before asking your school for an OPT recommendation.',
    documents: ['Passport', 'Current I-20', 'I-94', 'F-1 visa', 'School OPT request form', 'Desired OPT start date'],
  },
  {
    id: 'uscis-filing',
    title: 'Before USCIS filing',
    description: 'Items commonly needed when preparing Form I-765 after receiving your OPT I-20.',
    documents: [
      'OPT I-20',
      'Form I-765',
      'Passport',
      'F-1 visa',
      'I-94',
      'Passport-style photo',
      'Filing fee',
      'Previous CPT/OPT records if applicable',
    ],
  },
  {
    id: 'after-approval',
    title: 'After approval / during OPT',
    description: 'Records to keep after approval and while maintaining OPT status.',
    documents: ['EAD card', 'Employer name', 'Employer address', 'Job title', 'Start date', 'SEVP Portal information'],
  },
];

export const f1OptOfficialSources = [
  {
    title: 'Check USCIS OPT Guidance',
    description: 'Review USCIS guidance for Optional Practical Training for F-1 students.',
    url: 'https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students',
  },
  {
    title: 'Study in the States OPT Guidance',
    description: 'Review SEVP guidance for F-1 Optional Practical Training and DSO actions.',
    url: 'https://studyinthestates.dhs.gov/sevis-help-hub/student-records/fm-student-employment/f-1-optional-practical-training-opt',
  },
  {
    title: 'Ask your school DSO',
    description: 'Your school may have its own OPT forms, deadlines, and submission instructions.',
    url: 'mailto:?subject=Question%20about%20my%20F-1%20OPT%20timeline',
  },
];
