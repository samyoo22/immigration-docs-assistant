import React from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, FileText, Landmark, UserRound } from 'lucide-react';
import { RoadmapStep } from '../../types';

interface RoadmapStepCardProps {
  step: RoadmapStep;
  stepNumber: number;
}

const RoadmapStepCard: React.FC<RoadmapStepCardProps> = ({ step, stepNumber }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
            {stepNumber}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.plainEnglishSummary}</p>
          </div>
        </div>
        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          {step.timing}
        </span>
      </div>

      {step.deadlineRule && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Deadline rule</p>
              <p className="mt-1 text-sm leading-6 text-amber-900">{step.deadlineRule}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr),minmax(260px,0.9fr)]">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-700" />
            <p className="text-sm font-semibold text-slate-950">Required documents</p>
          </div>
          <div className="space-y-2">
            {step.requiredDocuments.map((document) => (
              <div key={document} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{document}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {step.submittedTo && (
            <StepDetail icon={Landmark} label="Submitted to" value={step.submittedTo} />
          )}
          <StepDetail icon={UserRound} label="Responsible party" value={step.responsibleParty} />
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Risk if missed</p>
            <p className="mt-2 text-sm leading-6 text-rose-900">{step.riskIfMissed}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <a
          href={step.officialSourceUrl || '#'}
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          Official source placeholder
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};

const StepDetail: React.FC<{
  icon: typeof Landmark;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-sky-700" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
    <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
  </div>
);

export default RoadmapStepCard;
