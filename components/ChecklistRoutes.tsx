import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  ExternalLink,
  GraduationCap,
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
};

type OptChecklistSection = {
  title: string;
  items: OptChecklistItem[];
};

const CHECKLIST_PROGRESS_STORAGE_KEY = 'visatodo_opt_checklist_completed';

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
      },
      {
        id: 'upload-supporting-documents',
        title: 'Upload supporting documents',
        description: 'Attach the required documents in the correct sections.',
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
      },
      {
        id: 'report-employment',
        title: 'Report employment to your school or SEVP portal',
        description: "Follow your school's instructions for reporting OPT employment.",
      },
      {
        id: 'keep-employment-records',
        title: 'Keep records of employment',
        description: 'Save offer letters, pay records, job descriptions, and employer information.',
      },
    ],
  },
];

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

interface ChecklistRoutesProps {
  pathname: string;
  onNavigateHome: (event?: React.MouseEvent<HTMLElement>) => void;
}

const ChecklistRoutes: React.FC<ChecklistRoutesProps> = ({ pathname, onNavigateHome }) => {
  if (pathname === '/checklists' || pathname === '/checklists/') {
    return <ChecklistIndex onNavigateHome={onNavigateHome} />;
  }

  if (pathname === '/checklists/opt') {
    return <OptChecklistPage />;
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

const OptChecklistPage = () => {
  const allItemIds = useMemo(() => optChecklistSections.flatMap((section) => section.items.map((item) => item.id)), []);
  const totalTasks = allItemIds.length;
  const [addState, setAddState] = useState<'idle' | 'added' | 'already'>('idle');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_PROGRESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(CHECKLIST_PROGRESS_STORAGE_KEY, JSON.stringify(completedItems));
  }, [completedItems]);

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
      id: 'template-f1-opt',
      title: 'F-1 OPT Checklist',
      source: 'template',
      sourceKey: 'template:f1-opt',
      createdAt: new Date().toISOString(),
      items: optChecklistSections.flatMap((section) =>
        section.items.map((item) => ({
          id: `template-f1-opt:${item.id}`,
          title: item.title,
          description: item.description,
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
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">F-1 OPT Checklist</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Follow the main steps to prepare, submit, and track your OPT application.
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

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Save this template</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Add the full F-1 OPT template to My Checklist and track it alongside document-review tasks.
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
        {optChecklistSections.map((section) => (
          <OptChecklistSectionCard
            key={section.title}
            section={section}
            completedItems={completedItems}
            onToggleItem={toggleItem}
          />
        ))}
      </div>

      <OfficialResources />
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
  <button
    type="button"
    onClick={onToggle}
    className={`w-full rounded-xl border p-4 text-left transition ${
      isCompleted
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/50'
    }`}
  >
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
);

const OfficialResources = () => (
  <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-slate-950">Official resources</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {officialResources.map((resource) => (
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
