import React, { useMemo, useState } from 'react';
import { AnalysisResult as AnalysisResultType, ChecklistItem, SavedChecklist, VisaSituation } from '../types';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  HelpCircle,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import { saveChecklist } from '../utils/savedChecklists';

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

const RecommendedNextStepCard = ({ situation }: { situation: VisaSituation }) => {
  const recommendation =
    situation === VisaSituation.F1_OPT_APPLY
      ? 'Check this document with your DSO before submitting anything or making travel, school transfer, or employment decisions.'
      : 'Confirm whether this document applies to your exact immigration situation before taking action.';

  return (
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
};

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
        </div>
        <button
          onClick={() => onCopy(copyText)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
        >
          <Copy className="h-4 w-4" />
          Copy result
        </button>
      </div>

      <RecommendedNextStepCard situation={situation} />

      <ResultHelperActions />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-950">Before you act</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              This review is a plain-language starting point based on the document text you provided. Always verify important deadlines, eligibility, and required documents with USCIS, your DSO, employer, attorney, or another official source.
            </p>
          </div>
        </div>
      </div>

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
            {saveState !== 'idle' && (
              <a
                href="/my-checklist"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                View My Checklist
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
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
      </section>

      <RelatedChecklistCard situation={situation} />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader icon={<CheckCircle2 className="h-4 w-4" />} title="Documents Mentioned" />
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
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader icon={<HelpCircle className="h-4 w-4" />} title="Questions to Ask" />
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
      </section>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
          <p className="text-sm leading-6 text-slate-600">
            General information only. Verify with an official source.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
