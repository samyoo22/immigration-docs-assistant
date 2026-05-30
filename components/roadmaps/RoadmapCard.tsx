import React from 'react';
import { ArrowRight, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { VisaRoadmap } from '../../types';

interface RoadmapCardProps {
  roadmap: VisaRoadmap;
  onOpenRoadmap?: (event: React.MouseEvent<HTMLAnchorElement>, roadmapId: string) => void;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, onOpenRoadmap }) => {
  const isAvailable = roadmap.status === 'available';

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
        roadmap.featured ? 'border-sky-200 shadow-sky-900/5' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          {isAvailable ? <CalendarDays className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isAvailable ? 'Available' : 'Coming soon'}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold text-slate-950">{roadmap.title}</h2>
          {roadmap.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{roadmap.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{roadmap.visaType}</p>
        {isAvailable ? (
          <a
            href={`/roadmaps/${roadmap.id}`}
            onClick={(event) => onOpenRoadmap?.(event, roadmap.id)}
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition hover:text-sky-900"
          >
            View roadmap
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <span className="text-sm font-semibold text-slate-400">Not open yet</span>
        )}
      </div>
    </article>
  );
};

export default RoadmapCard;
