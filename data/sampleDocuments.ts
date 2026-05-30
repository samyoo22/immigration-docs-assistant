import { UserIntent, VisaSituation } from '../types';

export type SampleDocument = {
  id: string;
  title: string;
  description: string;
  bestFor: string;
  situation: VisaSituation;
  helpGoal: UserIntent;
  text: string;
  expectedHighlights: string[];
};

export const sampleDocuments: SampleDocument[] = [
  {
    id: 'uscis-i765-receipt',
    title: 'USCIS Receipt Notice',
    description: 'A fictional receipt notice for tracking an I-765 case.',
    bestFor: 'Checking receipt numbers, case tracking, and next-step clarity.',
    situation: VisaSituation.I765,
    helpGoal: UserIntent.GENERAL,
    text: 'This is a fictional sample USCIS receipt notice. USCIS has received your Form I-765, Application for Employment Authorization. Use the receipt number to track your case status online. Keep this notice for your records and watch for future USCIS updates.',
    expectedHighlights: ['Form I-765', 'receipt notice', 'track case status', 'save the notice'],
  },
  {
    id: 'f1-opt-i20-instructions',
    title: 'OPT I-20 instruction',
    description: 'A fictional school instruction about an OPT recommendation I-20.',
    bestFor: 'F-1 OPT users who need to verify school steps before filing.',
    situation: VisaSituation.F1_OPT_APPLY,
    helpGoal: UserIntent.ASK_DSO,
    text: 'This is a fictional sample school instruction. Your OPT recommendation has been added to your SEVIS record. Please review your updated I-20 carefully, confirm your requested OPT start date, and use the updated I-20 when preparing Form I-765 for USCIS.',
    expectedHighlights: ['OPT recommendation', 'updated I-20', 'requested OPT start date', 'Form I-765'],
  },
  {
    id: 'f1-opt-dso-email',
    title: 'DSO email',
    description: 'A fictional DSO message about filing timing and school steps.',
    bestFor: 'Testing DSO questions and draft message recommendations.',
    situation: VisaSituation.F1_OPT_APPLY,
    helpGoal: UserIntent.ASK_DSO,
    text: 'This is a fictional sample email from a school DSO. Your OPT recommendation has been added to your SEVIS record. Please review your updated I-20 and submit your Form I-765 to USCIS within the required filing window. Contact our office before travel or if your plans change.',
    expectedHighlights: ['DSO', 'SEVIS record', 'filing window', 'travel or plans change'],
  },
  {
    id: 'stem-opt-i983-reminder',
    title: 'STEM OPT I-983 reminder',
    description: 'A fictional school reminder about STEM OPT documents and employer details.',
    bestFor: 'STEM OPT users checking employer, I-983, and reporting steps.',
    situation: VisaSituation.F1_OPT_ACTIVE,
    helpGoal: UserIntent.ASK_DSO,
    text: 'This is a fictional sample STEM OPT reminder from a school office. Before requesting your STEM OPT I-20, confirm your employer participates in E-Verify, complete Form I-983 with your supervisor, and review your current OPT EAD end date. Submit the training plan and employer details to your DSO for review.',
    expectedHighlights: ['STEM OPT I-20', 'E-Verify', 'Form I-983', 'current OPT EAD end date'],
  },
  {
    id: 'uscis-rfe-notice',
    title: 'RFE notice',
    description: 'A fictional request for evidence notice.',
    bestFor: 'Testing caution language and official-source verification.',
    situation: VisaSituation.RFE,
    helpGoal: UserIntent.GENERAL,
    text: 'This is a fictional sample request for evidence notice. USCIS needs additional information before it can continue reviewing your application. Review the requested evidence, response instructions, and response deadline carefully before submitting anything.',
    expectedHighlights: ['request for evidence', 'response instructions', 'response deadline', 'requested evidence'],
  },
  {
    id: 'ead-approval-notice',
    title: 'EAD approval notice',
    description: 'A fictional approval notice related to an EAD card.',
    bestFor: 'Checking EAD date verification and recordkeeping tasks.',
    situation: VisaSituation.EAD_ISSUE,
    helpGoal: UserIntent.GENERAL,
    text: 'This is a fictional sample EAD approval notice. USCIS has approved your employment authorization application. Watch for your EAD card in the mail, confirm the start and end dates printed on the card, and keep copies for your records.',
    expectedHighlights: ['EAD card', 'start and end dates', 'approval notice', 'keep copies'],
  },
];

export const sampleDocumentQaCases = sampleDocuments.map((sample) => ({
  id: sample.id,
  title: sample.title,
  situation: sample.situation,
  helpGoal: sample.helpGoal,
  minimumExpectedChecklistItems: 3,
  expectedHighlights: sample.expectedHighlights,
}));
