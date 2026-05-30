import React from 'react';
import { RoadmapStep } from '../../types';
import RoadmapStepCard from './RoadmapStepCard';

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
}

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ steps }) => {
  return (
    <section id="opt-steps" className="border-t border-slate-200 py-10 scroll-mt-24">
      <div className="mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Step-by-step roadmap</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Your F-1 OPT steps</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Follow the process from document preparation to maintaining OPT status.
          </p>
        </div>
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
