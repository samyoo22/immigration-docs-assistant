import React, { useMemo, useState } from 'react';
import { AnalysisResult as AnalysisResultType, ChecklistItem, DraftMessage, SavedChecklist, VisaSituation } from '../types';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  ExternalLink,
  FileText,
  ListChecks,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { saveChecklist } from '../utils/savedChecklists';
import { getRecommendedNextStepForSituation, RESULT_DISCLAIMER } from '../data/analysisSupport';

interface AnalysisResultProps {
  result: AnalysisResultType;
  checklistItems: ChecklistItem[];
  situation: VisaSituation;
  onCopy: (text: string) => void;
}

const priorityStyles = {
  high: 'border-rose-200 bg-rose-50 text-rose-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const confidenceStyles = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

const reviewConfidenceStyles = {
  high: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  needs_verification: 'border-sky-200 bg-sky-50 text-sky-700',
};

const reviewConfidenceLabels = {
  high: 'This review looks straightforward',
  medium: 'Some details need verification',
  needs_verification: 'This document may need official review',
};

const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const getDocumentChecklistTitle = (situation: VisaSituation) => {
  if (situation === VisaSituation.F1_OPT_APPLY) return 'F-1 OPT Document Review Checklist';
  if (situation === VisaSituation.USCIS_NOTICE) return 'USCIS Notice Review Checklist';
  if (situation === VisaSituation.EAD_ISSUE) return 'EAD Issue Review Checklist';
  return `${situation} Document Review Checklist`;
};

const relatedChecklistBySituation: Partial<Record<VisaSituation, { title: string; description: string; href: string; cta: string }>> = {
  [VisaSituation.F1_OPT_APPLY]: {
    title: 'F-1 OPT Checklist',
    description: 'Prepare your OPT application, verify your documents, and track your USCIS case.',
    href: '/checklists/opt',
    cta: 'Open F-1 OPT checklist',
  },
  [VisaSituation.F1_OPT_ACTIVE]: {
    title: 'STEM OPT Checklist',
    description: 'Track STEM OPT reporting, employer details, I-983 steps, and extension timing.',
    href: '/checklists/stem-opt',
    cta: 'Open STEM OPT checklist',
  },
  [VisaSituation.H1B]: {
    title: 'H-1B Checklist',
    description: 'Organize filing steps, employer documents, receipt notices, and status updates.',
    href: '/checklists/h1b',
    cta: 'Open H-1B checklist',
  },
  [VisaSituation.I765]: {
    title: 'I-765 Checklist',
    description: 'Review application details, supporting documents, fees, and USCIS case tracking.',
    href: '/checklists/i-765',
    cta: 'Open I-765 checklist',
  },
  [VisaSituation.I539]: {
    title: 'I-539 Checklist',
    description: 'Prepare status-change documents, evidence, filing details, and follow-up tasks.',
    href: '/checklists/i-539',
    cta: 'Open I-539 checklist',
  },
};

const SectionHeader = ({
  icon,
  title,
  className = 'mb-4',
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
      {icon}
    </div>
    <h2 className="text-base font-semibold text-slate-950">{title}</h2>
  </div>
);

const RecommendedNextStepCard = ({ recommendation }: { recommendation: string }) => (
  <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-950">Recommended next step</h3>
        <p className="mt-1 text-sm leading-6 text-slate-700">{recommendation}</p>
      </div>
    </div>
  </section>
);

const ResultHelperActions = () => (
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className="flex items-start gap-3">
      <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
      <p className="text-sm leading-6 text-slate-600">
        You can copy this review, save the action items as a checklist, or open the related visa checklist.
      </p>
    </div>
  </div>
);

const RelatedChecklistCard = ({ situation }: { situation: VisaSituation }) => {
  const checklist = relatedChecklistBySituation[situation] || {
    title: 'Browse visa checklists',
    description: 'Find a checklist that matches your immigration situation and use it to organize your next steps.',
    href: '/checklists',
    cta: 'Browse visa checklists',
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader icon={<ListChecks className="h-4 w-4" />} title="Related checklist" />
      <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
        <h3 className="text-sm font-semibold text-slate-950">{checklist.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{checklist.description}</p>
        <a
          href={checklist.href}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          {checklist.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

const SecondaryDetails = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
      <span>
        <span className="block text-base font-semibold text-slate-950">{title}</span>
        {subtitle && <span className="mt-1 block text-sm leading-6 text-slate-600">{subtitle}</span>}
      </span>
      <span className="mt-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition group-open:bg-slate-100">
        <span className="group-open:hidden">Show</span>
        <span className="hidden group-open:inline">Hide</span>
      </span>
    </summary>
    <div className="mt-5">{children}</div>
  </details>
);

const OfficialSourcesSection = ({ result }: { result: AnalysisResultType }) => {
  const sources = (result.officialSources || []).slice(0, 5);
  if (sources.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-950">Official sources to verify</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Before taking action, confirm important details with official sources.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/60"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-950">{source.title}</h3>
              <ExternalLink className="h-4 w-4 shrink-0 text-sky-700" />
            </div>
            {source.description && (
              <p className="mt-2 text-sm leading-6 text-slate-600">{source.description}</p>
            )}
            <span className="mt-3 inline-flex text-xs font-semibold text-sky-700">Open source</span>
          </a>
        ))}
      </div>
    </section>
  );
};

const SavedChecklistSuccess = ({ state }: { state: 'saved' | 'updated' }) => (
  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        <div>
          <p className="text-sm font-semibold text-emerald-950">
            {state === 'saved' ? 'Saved to My Checklist' : 'My Checklist was updated'}
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            You can now check these tasks off, continue from the next incomplete item, or remove the checklist later.
          </p>
        </div>
      </div>
      <a
        href="/my-checklist"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
      >
        Open My Checklist
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  </div>
);

const BetaFeedbackCta = () => (
  <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Beta feedback</h2>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          Was anything unclear, missing, or too confident? A short note helps improve the next beta build.
        </p>
      </div>
      <a
        href="mailto:hello@visatodo.com?subject=VisaTodo%20beta%20feedback"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100"
      >
        <Mail className="h-4 w-4" />
        Send feedback
      </a>
    </div>
  </section>
);

const WhatToVerifySection = ({ result }: { result: AnalysisResultType }) => {
  const verificationItems = result.verificationItems || [];
  if (verificationItems.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-950">What to verify</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Before taking action, confirm these details with an official source.
          </p>
        </div>
      </div>
      <div className="grid gap-3">
        {verificationItems.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
              <span className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[item.importance]}`}>
                {item.importance} importance
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

const DraftMessageSection = ({
  result,
  onCopy,
}: {
  result: AnalysisResultType;
  onCopy: (text: string) => void;
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const messages: { key: string; label: string; message: DraftMessage }[] = [
    { key: 'dso', label: 'DSO', message: result.draftMessages?.dso as DraftMessage },
    { key: 'employer', label: 'Employer / HR', message: result.draftMessages?.employer as DraftMessage },
    { key: 'attorney', label: 'Attorney', message: result.draftMessages?.attorney as DraftMessage },
  ].filter(({ message }) => Boolean(message?.subject?.trim() && message?.body?.trim()));

  if (messages.length === 0) return null;

  const handleCopyMessage = (key: string, message: DraftMessage) => {
    onCopy(`Subject: ${message.subject}\n\n${message.body}`);
    setCopiedKey(key);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Mail className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-slate-950">Draft a message</h2>
            <a href="/templates" className="text-xs font-semibold text-sky-700 transition hover:text-sky-900">
              Browse all templates
            </a>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use these templates to ask the right person before taking action.
          </p>
        </div>
      </div>
      <div className="grid gap-3">
        {messages.map(({ key, label, message }) => (
          <article key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{label}</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-950">{message.subject}</h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopyMessage(key, message)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  copiedKey === key
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50'
                }`}
              >
                {copiedKey === key ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === key ? 'Copied' : 'Copy message'}
              </button>
            </div>
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
              {message.body}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, checklistItems, situation, onCopy }) => {
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'updated'>('idle');
  const questions = result.questionsToAsk?.length ? result.questionsToAsk : result.dsoQuestions || [];
  const isBasicReview = result.topic === 'basic_review';
  const safeWarnings = (result.warnings || []).filter((warning) => {
    const normalized = warning.toLowerCase();
    return !(
      normalized.includes('ai service') ||
      normalized.includes('live ai') ||
      normalized.includes('live analysis') ||
      normalized.includes('limited preview') ||
      normalized.includes('request failed') ||
      normalized.includes('not available') ||
      normalized.includes('mock analysis') ||
      normalized.includes('general information only')
    );
  });
  const copyText = useMemo(() => [
    'Simple Summary',
    result.summary.join('\n'),
    '',
    'Action Items',
    checklistItems.map((item) => `- ${item.title}: ${item.description}`).join('\n'),
    '',
    'Important Dates',
    (result.importantDates || []).map((date) => `- ${date.date}: ${date.meaning}`).join('\n') || 'No clear dates found.',
    '',
    'Documents Mentioned',
    (result.documentsMentioned || []).map((doc) => `- ${doc.name}: ${doc.purpose}`).join('\n') || 'No documents found.',
    '',
    'Questions to Ask',
    questions.map((question) => `- ${question}`).join('\n'),
  ].join('\n'), [checklistItems, questions, result]);

  const checklistCopyText = useMemo(
    () => checklistItems.map((item) => `- ${item.title}: ${item.description}`).join('\n'),
    [checklistItems],
  );

  const handleSaveChecklist = () => {
    const sourceKey = `document-review:${situation}:${simpleHash(
      checklistItems.map((item) => `${item.title}:${item.description}`).join('|'),
    )}`;
    const savedChecklist: SavedChecklist = {
      id: sourceKey,
      title: getDocumentChecklistTitle(situation),
      source: 'document-review',
      sourceKey,
      createdAt: new Date().toISOString(),
      items: checklistItems.map((item) => ({
        id: `${sourceKey}:${item.id}`,
        title: item.title,
        description: item.description,
        completed: item.status === 'done',
        priority: item.priority,
        dueDate: item.dueLabel,
      })),
    };

    const result = saveChecklist(savedChecklist);
    setSaveState(result.status === 'created' ? 'saved' : 'updated');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Document Review</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            {isBasicReview ? 'We generated a basic review' : result.topicLabel || 'Visa document guidance'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {isBasicReview
              ? 'We could not create a full detailed review this time, so we generated a basic plain-language review from your provided text. You can try again or paste a clearer document excerpt.'
              : 'We found information related to your selected situation. Review the summary, action items, dates, and documents below.'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${reviewConfidenceStyles[result.confidenceLevel || 'medium']}`}>
              {reviewConfidenceLabels[result.confidenceLevel || 'medium']}
            </span>
            {result.confidenceNote && (
              <span className="max-w-xl text-xs leading-5 text-slate-500">{result.confidenceNote}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onCopy(copyText)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
        >
          <Copy className="h-4 w-4" />
          Copy result
        </button>
      </div>

      <RecommendedNextStepCard recommendation={result.recommendedNextStep || getRecommendedNextStepForSituation(situation)} />

      {safeWarnings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-sm font-semibold text-amber-950">Review note</h3>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-900">
                {safeWarnings.map((warning) => (
                  <li key={warning}>- {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader icon={<FileText className="h-4 w-4" />} title="Simple Summary" />
        <ul className="space-y-3">
          {result.summary.map((item, index) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <WhatToVerifySection result={result} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader icon={<ClipboardList className="h-4 w-4" />} title="Action Items" className="mb-0" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCopy(checklistCopyText)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy checklist
            </button>
            <button
              type="button"
              onClick={handleSaveChecklist}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                saveState !== 'idle'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-sky-700 text-white hover:bg-sky-800'
              }`}
            >
              {saveState !== 'idle' ? <Check className="h-3.5 w-3.5" /> : <ListChecks className="h-3.5 w-3.5" />}
              {saveState === 'idle' && 'Save as checklist'}
              {saveState === 'saved' && 'Saved to My Checklist'}
              {saveState === 'updated' && 'Updated in My Checklist'}
            </button>
          </div>
        </div>
        <div className="grid gap-3">
          {checklistItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/40">
              <div className="flex gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-sky-300 bg-white">
                  <span className="sr-only">Todo</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[item.priority || 'low']}`}>
                      {item.priority || 'low'} priority
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                      {item.dueLabel || 'No clear deadline'}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        {saveState !== 'idle' && <SavedChecklistSuccess state={saveState} />}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader icon={<CalendarDays className="h-4 w-4" />} title="Important Dates" />
        {result.importantDates?.length ? (
          <div className="space-y-3">
            {result.importantDates.map((item) => (
              <div key={`${item.date}-${item.meaning}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-950">{item.date}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${confidenceStyles[item.confidence]}`}>
                    {item.confidence} confidence
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.meaning}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-600">No clear dates found. Verify any timing with the official source.</p>
        )}
      </section>

      <SecondaryDetails
        title="Documents mentioned"
        subtitle="Supporting detail from the document review."
      >
        {result.documentsMentioned?.length ? (
          <div className="space-y-3">
            {result.documentsMentioned.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.purpose}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-600">No specific documents were clearly detected.</p>
        )}
      </SecondaryDetails>

      <SecondaryDetails
        title="Questions to ask"
        subtitle="Use these when checking with a DSO, employer, attorney, or official source."
      >
        {questions.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {questions.map((question) => (
              <div key={question} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {question}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-600">No specific questions were detected. Ask an official source to confirm the next step before acting.</p>
        )}
      </SecondaryDetails>

      <SecondaryDetails
        title="Official sources"
        subtitle="Open these when you are ready to verify details."
      >
        <OfficialSourcesSection result={result} />
      </SecondaryDetails>

      <SecondaryDetails
        title="Draft messages"
        subtitle="Copy a message only after you review and personalize it."
      >
        <DraftMessageSection result={result} onCopy={onCopy} />
      </SecondaryDetails>

      <SecondaryDetails
        title="Related checklist"
        subtitle="Open a reusable checklist for this visa workflow."
      >
        <RelatedChecklistCard situation={situation} />
      </SecondaryDetails>

      <BetaFeedbackCta />

      <SecondaryDetails
        title="General information note"
        subtitle="Review the product boundary before relying on any result."
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
            <p className="text-sm leading-6 text-slate-600">
              {result.disclaimer || RESULT_DISCLAIMER}
            </p>
          </div>
        </div>
      </SecondaryDetails>
    </div>
  );
};

export default AnalysisResult;
