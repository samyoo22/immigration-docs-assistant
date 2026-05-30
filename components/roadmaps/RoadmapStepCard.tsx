import React from 'react';
import { AlertTriangle, FileText, Landmark, UserRound } from 'lucide-react';
import { RoadmapStep } from '../../types';

interface RoadmapStepCardProps {
  step: RoadmapStep;
  stepNumber: number;
  status?: 'completed' | 'current' | 'upcoming' | 'deadline-risk';
}

const statusStyles = {
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  current: 'border-sky-200 bg-sky-50 text-sky-700',
  upcoming: 'border-slate-200 bg-slate-50 text-slate-600',
  'deadline-risk': 'border-amber-200 bg-amber-50 text-amber-800',
};

const statusLabels = {
  completed: 'Completed',
  current: 'Current',
  upcoming: 'Upcoming',
  'deadline-risk': 'Deadline risk',
};

const RoadmapStepCard: React.FC<RoadmapStepCardProps> = ({ step, stepNumber, status = 'upcoming' }) => {
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${status === 'current' ? 'border-sky-300 ring-4 ring-sky-100' : 'border-slate-200'}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
            {stepNumber}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                {statusLabels[status]}
              </span>
              {status === 'current' && (
                <span className="rounded-full bg-sky-700 px-2.5 py-1 text-xs font-semibold text-white">You are here</span>
              )}
            </div>
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
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                <span>{document}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {step.submittedTo && (
            <StepDetail icon={Landmark} label="Submitted to" value={step.submittedTo} />
          )}
          <StepDetail icon={UserRound} label="Who handles this" value={step.responsibleParty} />
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Risk if missed</p>
            <p className="mt-2 text-sm leading-6 text-rose-900">{step.riskIfMissed}</p>
          </div>
        </div>
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
