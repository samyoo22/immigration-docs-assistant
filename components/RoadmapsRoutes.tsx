import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import RoadmapCard from './roadmaps/RoadmapCard';
import RoadmapTimeline from './roadmaps/RoadmapTimeline';
import OptDateCalculator from './roadmaps/OptDateCalculator';
import { f1OptRoadmap, ROADMAP_DISCLAIMER, visaRoadmaps } from '../lib/roadmaps/f1OptRoadmap';

interface RoadmapsRoutesProps {
  pathname: string;
  onNavigateHome: () => void;
  onNavigateRoadmaps: (event?: React.MouseEvent<HTMLElement>, route?: string) => void;
}

const glossaryTerms = [
  {
    term: 'DSO',
    meaning: 'A school official who supports F-1 student records and can recommend OPT in SEVIS.',
  },
  {
    term: 'SEVIS',
    meaning: 'The government system where your school maintains your F-1 student record.',
  },
  {
    term: 'Form I-765',
    meaning: 'The USCIS application used to request employment authorization.',
  },
  {
    term: 'EAD',
    meaning: 'The work authorization card that shows when you may begin OPT employment.',
  },
];

const RoadmapsRoutes: React.FC<RoadmapsRoutesProps> = ({ pathname, onNavigateHome, onNavigateRoadmaps }) => {
  if (pathname === '/roadmaps/f1-opt' || pathname === '/roadmaps/f1-opt/') {
    return <F1OptRoadmapPage onNavigateHome={onNavigateHome} onNavigateRoadmaps={onNavigateRoadmaps} />;
  }

  return <RoadmapsLandingPage onNavigateRoadmaps={onNavigateRoadmaps} />;
};

const RoadmapsLandingPage: React.FC<{
  onNavigateRoadmaps: (event?: React.MouseEvent<HTMLElement>, route?: string) => void;
}> = ({ onNavigateRoadmaps }) => (
  <div className="animate-fade-in">
    <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr),minmax(360px,0.8fr)] lg:items-center lg:py-10">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5" />
          Visa roadmaps
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] text-slate-950 sm:text-5xl lg:text-[3.8rem]">
          Know what you need, when you need it, and what comes next.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          VisaTodo turns immigration processes into simple roadmaps with document lists, timing notes, deadline reminders, and plain-English explanations.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href="/roadmaps/f1-opt"
            onClick={(event) => onNavigateRoadmaps(event, '/roadmaps/f1-opt')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
          >
            Open F-1 OPT Roadmap
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-900/5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Featured roadmap</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">F-1 OPT</h2>
        <div className="mt-5 space-y-3">
          {['Prepare documents', 'Request OPT I-20', 'File Form I-765', 'Track USCIS', 'Maintain OPT status'].map(
            (item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </div>
            )
          )}
        </div>
        <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Deadlines are highlighted so timing risks are easier to spot.
        </div>
      </div>
    </section>

    <section className="border-t border-slate-200 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Browse</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Visa roadmap library</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Start with the F-1 OPT roadmap now. More visa types are structured as placeholders so the library can grow cleanly.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visaRoadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            onOpenRoadmap={(event, roadmapId) => onNavigateRoadmaps(event, `/roadmaps/${roadmapId}`)}
          />
        ))}
      </div>
    </section>
  </div>
);

const F1OptRoadmapPage: React.FC<{
  onNavigateHome: () => void;
  onNavigateRoadmaps: (event?: React.MouseEvent<HTMLElement>, route?: string) => void;
}> = ({ onNavigateHome, onNavigateRoadmaps }) => (
  <div className="animate-fade-in">
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={(event) => onNavigateRoadmaps(event, '/roadmaps')}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Roadmaps
      </button>
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
      >
        Home
      </button>
    </div>

    <section className="grid gap-8 py-6 lg:grid-cols-[minmax(0,0.98fr),minmax(360px,0.78fr)] lg:items-start">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
          <BookOpenCheck className="h-3.5 w-3.5" />
          F-1 OPT roadmap
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.03] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
          F-1 OPT, broken into clear steps.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{f1OptRoadmap.description}</p>
      </div>

      <DisclaimerCard />
    </section>

    <section className="grid gap-4 py-6 sm:grid-cols-3">
      <QuickFact icon={CalendarDays} label="Best first move" value="Start preparing 3-4 months before program end." />
      <QuickFact icon={ShieldCheck} label="Deadline to watch" value="File after DSO recommendation and generally within 30 days." />
      <QuickFact icon={HelpCircle} label="Plain English" value="Terms are explained as you go." />
    </section>

    <GlossarySection />
    <OptDateCalculator />
    <RoadmapTimeline steps={f1OptRoadmap.steps} />
    <DisclaimerCard compact />
  </div>
);

const DisclaimerCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className={`rounded-2xl border border-sky-100 bg-sky-50 p-5 ${compact ? 'mt-4' : ''}`}>
    <div className="flex gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
      <div>
        <p className="text-sm font-semibold text-sky-950">Important disclaimer</p>
        <p className="mt-2 text-sm leading-6 text-sky-900">{ROADMAP_DISCLAIMER}</p>
      </div>
    </div>
  </div>
);

const QuickFact: React.FC<{
  icon: typeof CalendarDays;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{value}</p>
  </div>
);

const GlossarySection: React.FC = () => (
  <section className="border-t border-slate-200 py-10">
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">What does this mean?</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Helpful terms before you start</h2>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {glossaryTerms.map((item) => (
        <div key={item.term} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-base font-semibold text-slate-950">{item.term}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.meaning}</p>
        </div>
      ))}
    </div>
  </section>
);

export default RoadmapsRoutes;
