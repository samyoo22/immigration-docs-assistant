import React from 'react';
import { AnalysisResult as AnalysisResultType, ChecklistItem } from '../types';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultType;
  checklistItems: ChecklistItem[];
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

const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
      {icon}
    </div>
    <h2 className="text-base font-semibold text-slate-950">{title}</h2>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, checklistItems, onCopy }) => {
  const questions = result.questionsToAsk?.length ? result.questionsToAsk : result.dsoQuestions || [];
  const copyText = [
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
  ].join('\n');

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Analysis ready</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{result.topicLabel || 'Visa document analysis'}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review this as a plain-language starting point. Verify deadlines and requirements with the appropriate official source.
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

      {(result.warnings?.length || result.riskAssessment) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-sm font-semibold text-amber-950">Important caveats</h3>
              {result.riskAssessment && (
                <p className="mt-1 text-sm leading-6 text-amber-900">
                  {result.riskAssessment.summary}
                </p>
              )}
              {result.warnings?.length ? (
                <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-900">
                  {result.warnings.map((warning) => (
                    <li key={warning}>- {warning}</li>
                  ))}
                </ul>
              ) : null}
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
        <SectionHeader icon={<ClipboardList className="h-4 w-4" />} title="Action Items" />
        <div className="grid gap-3">
          {checklistItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
            </article>
          ))}
        </div>
      </section>

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
        <div className="grid gap-3 sm:grid-cols-2">
          {questions.map((question) => (
            <div key={question} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {question}
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
          <p className="text-sm leading-6 text-slate-600">
            VisaTodo provides general information and plain-language explanations based on the document you provide. It is not legal advice and does not replace guidance from an immigration attorney, DSO, employer, or official government source. Always verify important deadlines and requirements with the appropriate official source.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
