import { UserIntent, VisaSituation } from '../types';

export type SampleDocument = {
  title: string;
  description: string;
  situation: VisaSituation;
  helpGoal: UserIntent;
  text: string;
};

export const sampleDocuments: SampleDocument[] = [
  {
    title: 'USCIS Receipt Notice',
    description: 'A fictional receipt notice for tracking an I-765 case.',
    situation: VisaSituation.I765,
    helpGoal: UserIntent.GENERAL,
    text: 'This is a fictional sample USCIS receipt notice. USCIS has received your Form I-765, Application for Employment Authorization. Use the receipt number to track your case status online. Keep this notice for your records and watch for future USCIS updates.',
  },
  {
    title: 'OPT I-20 instruction',
    description: 'A fictional school instruction about an OPT recommendation I-20.',
    situation: VisaSituation.F1_OPT_APPLY,
    helpGoal: UserIntent.ASK_DSO,
    text: 'This is a fictional sample school instruction. Your OPT recommendation has been added to your SEVIS record. Please review your updated I-20 carefully, confirm your requested OPT start date, and use the updated I-20 when preparing Form I-765 for USCIS.',
  },
  {
    title: 'DSO email',
    description: 'A fictional DSO message about filing timing and school steps.',
    situation: VisaSituation.F1_OPT_APPLY,
    helpGoal: UserIntent.ASK_DSO,
    text: 'This is a fictional sample email from a school DSO. Your OPT recommendation has been added to your SEVIS record. Please review your updated I-20 and submit your Form I-765 to USCIS within the required filing window. Contact our office before travel or if your plans change.',
  },
  {
    title: 'RFE notice',
    description: 'A fictional request for evidence notice.',
    situation: VisaSituation.RFE,
    helpGoal: UserIntent.GENERAL,
    text: 'This is a fictional sample request for evidence notice. USCIS needs additional information before it can continue reviewing your application. Review the requested evidence, response instructions, and response deadline carefully before submitting anything.',
  },
  {
    title: 'EAD approval notice',
    description: 'A fictional approval notice related to an EAD card.',
    situation: VisaSituation.EAD_ISSUE,
    helpGoal: UserIntent.GENERAL,
    text: 'This is a fictional sample EAD approval notice. USCIS has approved your employment authorization application. Watch for your EAD card in the mail, confirm the start and end dates printed on the card, and keep copies for your records.',
  },
];
