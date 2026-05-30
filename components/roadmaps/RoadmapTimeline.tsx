import React from 'react';
import { ArrowRight, Map } from 'lucide-react';
import { RoadmapStep } from '../../types';
import RoadmapStepCard from './RoadmapStepCard';

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ steps }) => {
  return (
    <section className="py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Roadmap</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">F-1 OPT timeline</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800">
          <Map className="h-4 w-4" />
          You are here: Request OPT I-20
        </div>
      </div>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex min-w-[760px] items-center gap-3">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex min-h-[104px] flex-1 flex-col justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-xs font-bold text-sky-700">Step {index + 1}</span>
                <span className="mt-3 text-sm font-semibold leading-5 text-slate-950">{step.title}</span>
              </div>
              {index < steps.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 text-slate-300" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-sm font-semibold text-emerald-900">Next step: File Form I-765 after your DSO recommends OPT.</p>
      </div>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <RoadmapStepCard key={step.id} step={step} stepNumber={index + 1} />
        ))}
      </div>
    </section>
  );
};

export default RoadmapTimeline;
