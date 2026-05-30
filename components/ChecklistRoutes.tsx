import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Info,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { SavedChecklist } from '../types';
import { saveChecklist } from '../utils/savedChecklists';

type ChecklistCardData = {
  title: string;
  path: string;
  description: string;
};

type OptChecklistItem = {
  id: string;
  title: string;
  description: string;
  whyItMatters?: string;
};

type OptChecklistSection = {
  title: string;
  items: OptChecklistItem[];
};

type ChecklistTemplateData = {
  id: string;
  title: string;
  sourceKey: string;
  progressStorageKey: string;
  intro: string;
  saveDescription: string;
  timelineTitle: string;
  timelineSubtitle: string;
  timelineNote: string;
  timelineSteps: string[];
  sections: OptChecklistSection[];
};

const checklistCards: ChecklistCardData[] = [
  {
    title: 'F-1 OPT',
    path: '/checklists/opt',
    description: 'Prepare your OPT application, request your OPT I-20, submit Form I-765, and track your USCIS case.',
  },
  {
    title: 'STEM OPT',
    path: '/checklists/stem-opt',
    description: 'Prepare your STEM OPT extension, confirm employer eligibility, complete Form I-983, and file Form I-765.',
  },
  {
    title: 'H-1B',
    path: '/checklists/h1b',
    description: 'Understand the H-1B process, employer sponsorship steps, registration, petition filing, and status tracking.',
  },
  {
    title: 'I-765',
    path: '/checklists/i-765',
    description: 'Prepare an employment authorization application and organize the documents commonly needed for Form I-765.',
  },
  {
    title: 'I-539',
    path: '/checklists/i-539',
    description: 'Prepare for an extension or change of nonimmigrant status using Form I-539.',
  },
  {
    title: 'Change of Status',
    path: '/checklists/change-of-status',
    description: 'Understand common steps when changing from one U.S. immigration status to another.',
  },
];

const optChecklistSections: OptChecklistSection[] = [
  {
    title: 'Before you apply',
    items: [
      {
        id: 'confirm-opt-eligibility',
        title: 'Confirm OPT eligibility with your DSO',
        description: "Check that you meet your school's OPT eligibility requirements before starting the application.",
      },
      {
        id: 'choose-opt-start-date',
        title: 'Choose your requested OPT start date',
        description: 'Pick a start date that fits USCIS timing rules and your post-graduation plans.',
      },
      {
        id: 'request-opt-i20',
        title: 'Request OPT recommendation I-20',
        description: 'Ask your school to recommend OPT in SEVIS and issue your updated I-20 before filing Form I-765.',
        whyItMatters: 'Your I-765 application usually needs the OPT-recommended I-20. Filing with the wrong or outdated document can create issues.',
      },
    ],
  },
  {
    title: 'Prepare documents',
    items: [
      {
        id: 'passport-copy',
        title: 'Passport copy',
        description: 'Prepare a clear copy of your passport biographical page.',
      },
      {
        id: 'f1-visa-copy',
        title: 'F-1 visa copy',
        description: 'Prepare a copy of your F-1 visa page if available.',
      },
      {
        id: 'i94-record',
        title: 'I-94 record',
        description: 'Download your most recent I-94 record and check that your information is correct.',
      },
      {
        id: 'most-recent-i20',
        title: 'Most recent I-20',
        description: 'Use the I-20 that includes your OPT recommendation.',
        whyItMatters: 'This document connects your USCIS filing to your DSO recommendation in SEVIS.',
      },
      {
        id: 'previous-i20s',
        title: 'Previous I-20s, if needed',
        description: 'Keep previous I-20s available in case your school or application process requires them.',
      },
      {
        id: 'passport-photo',
        title: 'Passport-style photo',
        description: 'Prepare a recent 2x2 passport-style photo that meets USCIS photo requirements.',
      },
    ],
  },
  {
    title: 'Submit Form I-765',
    items: [
      {
        id: 'uscis-account',
        title: 'Create or log in to your USCIS account',
        description: 'Use your USCIS online account to start the Form I-765 application.',
      },
      {
        id: 'complete-i765',
        title: 'Complete Form I-765',
        description: 'Enter your information carefully and verify the eligibility category before submitting.',
        whyItMatters: 'Errors on Form I-765 can slow processing or create follow-up questions from USCIS.',
      },
      {
        id: 'upload-supporting-documents',
        title: 'Upload supporting documents',
        description: 'Attach the required documents in the correct sections.',
        whyItMatters: 'Missing or mismatched uploads can make it harder for USCIS to confirm eligibility.',
      },
      {
        id: 'pay-filing-fee',
        title: 'Pay the filing fee',
        description: 'Submit payment through the USCIS online system.',
      },
      {
        id: 'save-receipt-notice',
        title: 'Save your receipt notice',
        description: 'Download or save your receipt notice and receipt number after submission.',
      },
    ],
  },
  {
    title: 'After submission',
    items: [
      {
        id: 'track-case',
        title: 'Track your USCIS case',
        description: 'Use your receipt number to monitor your case status.',
      },
      {
        id: 'watch-for-updates',
        title: 'Watch for USCIS mail or account updates',
        description: 'Check for notices, requests, or updates from USCIS.',
      },
      {
        id: 'update-address',
        title: 'Update your address if you move',
        description: 'Make sure USCIS and your school have your correct address.',
      },
      {
        id: 'save-approval-ead',
        title: 'Save approval notice and EAD card',
        description: 'Keep copies of your approval notice and EAD card for your records.',
      },
    ],
  },
  {
    title: 'Before working',
    items: [
      {
        id: 'confirm-ead-start-date',
        title: 'Confirm your EAD start date',
        description: 'Do not begin work before the start date printed on your EAD card.',
        whyItMatters: 'Working before the authorized date can create status and employment authorization problems.',
      },
      {
        id: 'report-employment',
        title: 'Report employment to your school or SEVP portal',
        description: "Follow your school's instructions for reporting OPT employment.",
        whyItMatters: 'OPT reporting keeps your SEVIS record current and helps document that your employment is related to your status.',
      },
      {
        id: 'keep-employment-records',
        title: 'Keep records of employment',
        description: 'Save offer letters, pay records, job descriptions, and employer information.',
      },
    ],
  },
];

const stemOptChecklistSections: OptChecklistSection[] = [
  {
    title: 'Confirm eligibility',
    items: [
      {
        id: 'confirm-stem-degree',
        title: 'Confirm STEM degree eligibility',
        description: 'Check that your degree and CIP code are eligible for the STEM OPT extension.',
        whyItMatters: 'STEM OPT eligibility depends on the qualifying degree shown in your school record.',
      },
      {
        id: 'confirm-everified-employer',
        title: 'Confirm employer is E-Verified',
        description: 'Ask your employer to confirm E-Verify participation before you prepare the STEM OPT request.',
        whyItMatters: 'A STEM OPT extension generally requires employment with an E-Verify employer.',
      },
      {
        id: 'review-current-opt-timing',
        title: 'Review current OPT timing',
        description: 'Check your current EAD end date and school filing window before starting the extension.',
      },
      {
        id: 'confirm-current-opt-status',
        title: 'Confirm your current OPT status',
        description: 'Make sure your post-completion OPT is active and review any employment or unemployment history.',
      },
    ],
  },
  {
    title: 'Prepare training plan',
    items: [
      {
        id: 'complete-i983',
        title: 'Complete Form I-983 with employer',
        description: 'Work with your employer to complete the training plan before requesting the STEM OPT I-20.',
        whyItMatters: 'Form I-983 documents the training plan, supervision, and connection between your degree and work.',
      },
      {
        id: 'collect-employer-details',
        title: 'Collect employer details',
        description: 'Gather employer name, address, EIN, E-Verify information, supervisor contact, and job details.',
      },
      {
        id: 'request-stem-i20',
        title: 'Request STEM OPT recommendation I-20',
        description: 'Send your school the required STEM OPT materials and request the updated I-20.',
        whyItMatters: 'Your STEM OPT I-20 should show the DSO recommendation before you file Form I-765.',
      },
      {
        id: 'prepare-current-ead',
        title: 'Prepare current EAD card copy',
        description: 'Make a clear copy of the front and back of your current OPT EAD card.',
      },
      {
        id: 'prepare-passport-i94',
        title: 'Prepare passport, visa, and I-94 records',
        description: 'Gather your passport biographical page, F-1 visa page if available, and most recent I-94.',
      },
      {
        id: 'prepare-degree-evidence',
        title: 'Prepare degree evidence, if needed',
        description: 'Keep your diploma, transcript, or other degree evidence available if requested by your school or USCIS.',
      },
      {
        id: 'prepare-stem-photo',
        title: 'Prepare passport-style photo',
        description: 'Use a recent passport-style photo that meets USCIS photo requirements.',
      },
    ],
  },
  {
    title: 'File with USCIS',
    items: [
      {
        id: 'prepare-stem-i765',
        title: 'Prepare Form I-765 documents',
        description: 'Prepare your STEM OPT I-20, current EAD, passport, I-94, photos, and other required documents.',
        whyItMatters: 'A complete document set helps USCIS verify your identity, status, and STEM OPT eligibility.',
      },
      {
        id: 'submit-stem-application',
        title: 'Submit STEM OPT application to USCIS',
        description: 'File Form I-765 using the correct STEM OPT category and upload the supporting documents.',
        whyItMatters: 'Timing and filing category matter because STEM OPT is an extension of existing OPT work authorization.',
      },
      {
        id: 'save-stem-receipt',
        title: 'Save receipt notice and track case',
        description: 'Save the USCIS receipt notice and use the receipt number to check case status.',
      },
      {
        id: 'create-uscis-account',
        title: 'Create or log in to your USCIS account',
        description: 'Use your USCIS online account to prepare and submit Form I-765.',
      },
      {
        id: 'pay-stem-filing-fee',
        title: 'Pay the filing fee',
        description: 'Submit payment through the USCIS online system and save the confirmation.',
      },
    ],
  },
  {
    title: 'While pending',
    items: [
      {
        id: 'confirm-pending-extension',
        title: 'Confirm pending-extension work rules with your DSO',
        description: 'Ask your DSO how pending STEM OPT extension work authorization applies to your situation.',
        whyItMatters: 'Pending-extension work rules are timing-sensitive and should be confirmed before your current EAD expires.',
      },
      {
        id: 'watch-uscis-updates',
        title: 'Watch for USCIS mail or account updates',
        description: 'Check for approval, requests, or other updates while your case is pending.',
      },
      {
        id: 'save-new-ead',
        title: 'Save approval notice and new EAD card',
        description: 'Keep copies of your approval notice and new EAD card for your records and employer updates.',
      },
      {
        id: 'update-address-while-pending',
        title: 'Update address if you move',
        description: 'Keep USCIS, your school, and your employer informed if your address changes while the case is pending.',
      },
    ],
  },
  {
    title: 'Maintain STEM OPT',
    items: [
      {
        id: 'complete-validation-reports',
        title: 'Complete required validation reports and evaluations',
        description: 'Follow your school schedule for STEM OPT validation reports and Form I-983 evaluations.',
        whyItMatters: 'STEM OPT has ongoing reporting requirements, not just a one-time filing step.',
      },
      {
        id: 'report-employer-training-changes',
        title: 'Report employer or training plan changes',
        description: 'Tell your DSO about employer, address, supervisor, or training plan changes.',
        whyItMatters: 'Changes can affect your SEVIS record and may require an updated Form I-983 or school action.',
      },
      {
        id: 'keep-stem-records',
        title: 'Keep STEM OPT employment records',
        description: 'Save EAD cards, I-20s, I-983 copies, evaluations, pay records, and employment letters.',
      },
      {
        id: 'submit-i983-evaluations',
        title: 'Submit Form I-983 evaluations',
        description: 'Complete required self-evaluations with your employer and send them to your DSO by the due dates.',
      },
      {
        id: 'track-stem-employment-history',
        title: 'Track employment and unemployment days',
        description: 'Keep a timeline of employers, work dates, and any gaps so you can answer school or USCIS questions.',
      },
    ],
  },
];

const checklistTemplates: Record<'opt' | 'stemOpt', ChecklistTemplateData> = {
  opt: {
    id: 'template-f1-opt',
    title: 'F-1 OPT Checklist',
    sourceKey: 'template:f1-opt',
    progressStorageKey: 'visatodo_opt_checklist_completed',
    intro: 'Follow the main steps to prepare, submit, and track your OPT application.',
    saveDescription: 'Add the full F-1 OPT template to My Checklist and track it alongside document-review tasks.',
    timelineTitle: 'F-1 OPT Timeline',
    timelineSubtitle: 'See the main steps from preparing your OPT application to starting work.',
    timelineNote: 'Timeline order can vary by school process and USCIS processing. Always confirm details with your DSO and official sources.',
    timelineSteps: [
      'Confirm OPT eligibility with your DSO',
      'Request OPT recommendation I-20',
      'Prepare Form I-765 documents',
      'Submit Form I-765 to USCIS',
      'Receive and save receipt notice',
      'Track USCIS case status',
      'Receive approval notice and EAD card',
      'Start work only on or after your EAD start date',
      'Report employment to your school or SEVP portal',
      'Keep employment records',
    ],
    sections: optChecklistSections,
  },
  stemOpt: {
    id: 'template-stem-opt',
    title: 'STEM OPT Checklist',
    sourceKey: 'template:stem-opt',
    progressStorageKey: 'visatodo_stem_opt_checklist_completed',
    intro: 'Prepare your STEM OPT extension, confirm employer eligibility, file Form I-765, and maintain reporting.',
    saveDescription: 'Add the full STEM OPT template to My Checklist and track reporting tasks over time.',
    timelineTitle: 'STEM OPT Timeline',
    timelineSubtitle: 'See the main steps from confirming eligibility to maintaining STEM OPT reporting.',
    timelineNote: 'STEM OPT timing and reporting rules should be confirmed with your DSO, employer, and official sources.',
    timelineSteps: [
      'Confirm STEM degree eligibility',
      'Confirm employer is E-Verified',
      'Complete Form I-983 with employer',
      'Request STEM OPT recommendation I-20',
      'Prepare Form I-765 documents',
      'Submit STEM OPT application to USCIS',
      'Save receipt notice and track case',
      'Confirm pending-extension work rules with your DSO',
      'Receive approval notice and new EAD card',
      'Complete required validation reports and evaluations',
      'Report employer or training plan changes',
    ],
    sections: stemOptChecklistSections,
  },
};

const officialResources = [
  {
    title: 'USCIS Form I-765',
    href: 'https://www.uscis.gov/i-765',
    description: 'Official USCIS page for the employment authorization application.',
  },
  {
    title: 'USCIS Case Status',
    href: 'https://egov.uscis.gov/casestatus/landing.do',
    description: 'Check your USCIS case status with your receipt number.',
  },
  {
    title: 'Study in the States',
    href: 'https://studyinthestates.dhs.gov/students/work/optional-practical-training',
    description: 'DHS guidance for F-1 students learning about OPT.',
  },
  {
    title: 'SEVP Portal',
    href: 'https://studyinthestates.dhs.gov/sevp-portal-help',
    description: 'Official SEVP Portal help for reporting and account tasks.',
  },
];

const stemOfficialResources = [
  {
    title: 'Study in the States: STEM OPT Hub',
    href: 'https://studyinthestates.dhs.gov/stem-opt-hub',
    description: 'Official DHS hub for STEM OPT students and employers.',
  },
  {
    title: 'USCIS Form I-765',
    href: 'https://www.uscis.gov/i-765',
    description: 'Official USCIS page for the employment authorization application.',
  },
  {
    title: 'USCIS Case Status',
    href: 'https://egov.uscis.gov/casestatus/landing.do',
    description: 'Check your USCIS case status with your receipt number.',
  },
  {
    title: 'SEVP Portal',
    href: 'https://studyinthestates.dhs.gov/sevp-portal-help',
    description: 'Official SEVP Portal help for reporting and account tasks.',
  },
  {
    title: 'Form I-983 information',
    href: 'https://studyinthestates.dhs.gov/form-i-983-overview',
    description: 'Official DHS information for the STEM OPT training plan.',
  },
];

const getOfficialResourcesForTemplate = (template: ChecklistTemplateData) =>
  template.sourceKey === 'template:stem-opt' ? stemOfficialResources : officialResources;

interface ChecklistRoutesProps {
  pathname: string;
  onNavigateHome: (event?: React.MouseEvent<HTMLElement>) => void;
}

const ChecklistRoutes: React.FC<ChecklistRoutesProps> = ({ pathname, onNavigateHome }) => {
  if (pathname === '/checklists' || pathname === '/checklists/') {
    return <ChecklistIndex onNavigateHome={onNavigateHome} />;
  }

  if (pathname === '/checklists/opt') {
    return <ChecklistTemplatePage template={checklistTemplates.opt} />;
  }

  if (pathname === '/checklists/stem-opt') {
    return <ChecklistTemplatePage template={checklistTemplates.stemOpt} />;
  }

  const placeholder = checklistCards.find((card) => card.path === pathname);
  return <ChecklistPlaceholder checklist={placeholder} />;
};

const ChecklistIndex = ({ onNavigateHome }: { onNavigateHome: (event?: React.MouseEvent<HTMLElement>) => void }) => (
  <div className="animate-fade-in py-8">
    <a
      href="/"
      onClick={onNavigateHome}
      className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to home
    </a>

    <div className="mb-8 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Checklist library</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Visa Todo Checklists</h1>
      <p className="mt-3 text-base leading-7 text-slate-600">
        Choose your visa workflow and follow clear step-by-step tasks.
      </p>
      <a
        href="/templates"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
      >
        <MessageSquareText className="h-4 w-4" />
        Browse message templates
      </a>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {checklistCards.map((checklist) => (
        <ChecklistCard key={checklist.path} checklist={checklist} />
      ))}
    </div>
  </div>
);

const ChecklistCard = ({ checklist }: { checklist: ChecklistCardData }) => (
  <article className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
      <GraduationCap className="h-5 w-5" />
    </div>
    <h2 className="mt-5 text-lg font-semibold text-slate-950">{checklist.title}</h2>
    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{checklist.description}</p>
    <a
      href={checklist.path}
      className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
    >
      View checklist
      <ArrowRight className="h-4 w-4" />
    </a>
  </article>
);

const ChecklistTemplatePage = ({ template }: { template: ChecklistTemplateData }) => {
  const allItemIds = useMemo(() => template.sections.flatMap((section) => section.items.map((item) => item.id)), [template.sections]);
  const totalTasks = allItemIds.length;
  const [addState, setAddState] = useState<'idle' | 'added' | 'already'>('idle');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(template.progressStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(template.progressStorageKey, JSON.stringify(completedItems));
  }, [completedItems, template.progressStorageKey]);

  const completedCount = allItemIds.filter((id) => completedItems[id]).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const toggleItem = (id: string) => {
    setCompletedItems((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const handleAddToMyChecklist = () => {
    const savedChecklist: SavedChecklist = {
      id: template.id,
      title: template.title,
      source: 'template',
      sourceKey: template.sourceKey,
      createdAt: new Date().toISOString(),
      items: template.sections.flatMap((section) =>
        section.items.map((item) => ({
          id: `${template.id}:${item.id}`,
          title: item.title,
          description: item.description,
          whyItMatters: item.whyItMatters,
          completed: Boolean(completedItems[item.id]),
        })),
      ),
    };

    const result = saveChecklist(savedChecklist);
    setAddState(result.status === 'created' ? 'added' : 'already');
  };

  return (
    <div className="animate-fade-in py-8">
      <a
        href="/checklists"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to checklists
      </a>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),320px] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Visa todo checklist</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{template.title}</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {template.intro}
          </p>
          <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
              <p className="text-sm leading-6 text-slate-700">
                This checklist is a general planning guide. Always confirm your school's process and official USCIS requirements before taking action.
              </p>
            </div>
          </div>
        </div>

        <ProgressSummary completedCount={completedCount} totalTasks={totalTasks} progressPercent={progressPercent} />
      </div>

      <ChecklistTimeline template={template} />

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Save this template</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {template.saveDescription}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleAddToMyChecklist}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              addState === 'idle'
                ? 'bg-sky-700 text-white hover:bg-sky-800'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {addState === 'idle' ? <ClipboardList className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {addState === 'idle' && 'Add to My Checklist'}
            {addState === 'added' && 'Added to My Checklist'}
            {addState === 'already' && 'This checklist is already saved'}
          </button>
          {addState !== 'idle' && (
            <a
              href="/my-checklist"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              View My Checklist
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {template.sections.map((section) => (
          <OptChecklistSectionCard
            key={section.title}
            section={section}
            completedItems={completedItems}
            onToggleItem={toggleItem}
          />
        ))}
      </div>

      <OfficialResources resources={getOfficialResourcesForTemplate(template)} />
      <ChecklistDisclaimer />
    </div>
  );
};

const ProgressSummary = ({
  completedCount,
  totalTasks,
  progressPercent,
}: {
  completedCount: number;
  totalTasks: number;
  progressPercent: number;
}) => (
  <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2">
      <ClipboardList className="h-4 w-4 text-sky-700" />
      <h2 className="text-sm font-semibold text-slate-950">Progress</h2>
    </div>
    <p className="mt-4 text-2xl font-semibold text-slate-950">
      {completedCount} of {totalTasks} tasks completed
    </p>
    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-sky-700 transition-all" style={{ width: `${progressPercent}%` }} />
    </div>
    <p className="mt-2 text-xs font-medium text-slate-500">{progressPercent}% complete</p>
  </aside>
);

const ChecklistTimeline = ({ template }: { template: ChecklistTemplateData }) => (
  <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
        <CalendarDays className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{template.timelineTitle}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{template.timelineSubtitle}</p>
      </div>
    </div>

    <ol className="grid gap-3 md:grid-cols-2">
      {template.timelineSteps.map((step, index) => (
        <li key={step} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-700 text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="pt-0.5 text-sm font-medium leading-6 text-slate-700">{step}</span>
        </li>
      ))}
    </ol>

    <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
        <p className="text-sm leading-6 text-slate-700">{template.timelineNote}</p>
      </div>
    </div>
  </section>
);

const OptChecklistSectionCard = ({
  section,
  completedItems,
  onToggleItem,
}: {
  section: OptChecklistSection;
  completedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
    <div className="mt-4 grid gap-3">
      {section.items.map((item) => (
        <ChecklistItemRow
          key={item.id}
          item={item}
          isCompleted={Boolean(completedItems[item.id])}
          onToggle={() => onToggleItem(item.id)}
        />
      ))}
    </div>
  </section>
);

const ChecklistItemRow = ({
  item,
  isCompleted,
  onToggle,
}: {
  item: OptChecklistItem;
  isCompleted: boolean;
  onToggle: () => void;
}) => (
  <article
    className={`w-full rounded-xl border p-4 text-left transition ${
      isCompleted
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/50'
    }`}
  >
    <button type="button" onClick={onToggle} className="w-full text-left">
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <Circle className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className={`text-sm font-semibold ${isCompleted ? 'text-emerald-900 line-through' : 'text-slate-950'}`}>
            {item.title}
          </h3>
          <p className={`mt-1 text-sm leading-6 ${isCompleted ? 'text-emerald-800/80' : 'text-slate-600'}`}>
            {item.description}
          </p>
        </div>
      </div>
    </button>

    {item.whyItMatters && (
      <details className="ml-8 mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <summary className="cursor-pointer text-xs font-semibold text-sky-700">Why this matters</summary>
        <p className="mt-2 text-sm leading-6 text-slate-600">{item.whyItMatters}</p>
      </details>
    )}
  </article>
);

const OfficialResources = ({ resources }: { resources: typeof officialResources }) => (
  <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-slate-950">Official resources</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {resources.map((resource) => (
        <a
          key={resource.href}
          href={resource.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/60"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-950">{resource.title}</h3>
            <ExternalLink className="h-4 w-4 shrink-0 text-sky-700" />
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
        </a>
      ))}
    </div>
  </section>
);

const ChecklistDisclaimer = () => (
  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-start gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
      <p className="text-sm leading-6 text-slate-600">
        VIsatodo is not a law firm and does not provide legal advice. This checklist is general information to help you organize tasks.
        Always confirm requirements with USCIS, your DSO, employer, or a qualified immigration attorney.
      </p>
    </div>
  </div>
);

const ChecklistPlaceholder = ({ checklist }: { checklist?: ChecklistCardData }) => {
  const title = checklist?.title || 'Checklist';
  const description = checklist?.description || 'Choose a checklist from the library to get started.';

  return (
    <div className="animate-fade-in py-8">
      <a
        href="/checklists"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to checklists
      </a>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Visa todo checklist</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-semibold text-slate-950">Detailed checklist coming soon</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            For now, use the F-1 OPT checklist or upload a document to create a document-specific action list.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ChecklistRoutes;
