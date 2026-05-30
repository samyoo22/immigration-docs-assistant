import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  BookOpenCheck,
  CalendarDays,
  ExternalLink,
  FileText,
  HelpCircle,
  Landmark,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import RoadmapCard from './roadmaps/RoadmapCard';
import RoadmapTimeline from './roadmaps/RoadmapTimeline';
import OptDateCalculator from './roadmaps/OptDateCalculator';
import { f1OptDocumentGroups, f1OptOfficialSources } from '../lib/roadmaps/f1OptDocuments';
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

const roadmapPreviewSteps = [
  'Prepare Documents',
  'Request OPT I-20',
  'File Form I-765',
  'Track USCIS',
  'Receive EAD',
  'Maintain OPT Status',
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
    <section className="grid gap-6 py-4 lg:grid-cols-[minmax(0,0.86fr),minmax(360px,0.72fr)] lg:items-start lg:py-6">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5" />
          Visa roadmaps
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">Visa Roadmaps</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Plan your visa process with clear steps, required documents, and deadline reminders.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Start with F-1 OPT and see what to prepare, when to file, and what comes next.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="/roadmaps/f1-opt"
            onClick={(event) => onNavigateRoadmaps(event, '/roadmaps/f1-opt')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
          >
            Start My F-1 OPT Timeline
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/roadmaps/f1-opt"
            onClick={(event) => onNavigateRoadmaps(event, '/roadmaps/f1-opt')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-6 py-3.5 text-sm font-bold text-sky-700 transition hover:bg-sky-50 active:scale-[0.99] sm:w-auto"
          >
            Calculate OPT Dates
          </a>
        </div>
      </div>

      <FeaturedTimelineStarter onNavigateRoadmaps={onNavigateRoadmaps} />
    </section>

    <RoadmapPreview />

    <section className="border-t border-slate-200 py-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Roadmap library</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Choose a roadmap</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Start with F-1 OPT today. More visa paths are being structured as step-by-step guides.
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

    <DisclaimerCard compact />
  </div>
);

const FeaturedTimelineStarter: React.FC<{
  onNavigateRoadmaps: (event?: React.MouseEvent<HTMLElement>, route?: string) => void;
}> = ({ onNavigateRoadmaps }) => (
  <article className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xl shadow-sky-900/5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Available now</span>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">F-1 OPT Roadmap</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">For F-1 students preparing post-completion work authorization.</p>
      </div>
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
        6 steps · 10+ documents · 3 key timing risks
      </p>
    </div>

    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Enter your program end date</span>
        <div className="mt-2 flex min-h-12 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-400">
          MM / DD / YYYY
        </div>
      </label>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        We’ll help you understand your general OPT filing window, start date window, and required documents.
      </p>
    </div>

    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div>
          <p className="text-sm font-semibold text-amber-900">Timing risk</p>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            After your DSO recommends OPT, you generally need to file Form I-765 within 30 days.
          </p>
        </div>
      </div>
    </div>

    <a
      href="/roadmaps/f1-opt"
      onClick={(event) => onNavigateRoadmaps(event, '/roadmaps/f1-opt')}
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99]"
    >
      Start My F-1 OPT Timeline
      <ArrowRight className="h-4 w-4" />
    </a>
  </article>
);

const RoadmapPreview: React.FC = () => (
  <section className="py-8">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">F-1 OPT preview</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">What the roadmap includes</h2>
      </div>
      <div className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        Don’t miss filing-window rules
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-6">
        {roadmapPreviewSteps.map((step, index) => (
          <div key={step} className="relative rounded-2xl bg-slate-50 p-4 md:min-h-[132px]">
            {index < roadmapPreviewSteps.length - 1 && (
              <div className="absolute left-8 top-12 h-[calc(100%+0.75rem)] w-px bg-sky-100 md:left-auto md:right-[-0.4rem] md:top-8 md:h-px md:w-3" />
            )}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
              {index + 1}
            </div>
            <p className="mt-4 text-sm font-semibold leading-5 text-slate-950">{step}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
      Your OPT application may be rejected or denied if you file outside the allowed filing window.
    </div>
  </section>
);

const F1OptRoadmapPage: React.FC<{
  onNavigateHome: () => void;
  onNavigateRoadmaps: (event?: React.MouseEvent<HTMLElement>, route?: string) => void;
}> = ({ onNavigateHome, onNavigateRoadmaps }) => (
  <div className="animate-fade-in">
    <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
      <button type="button" onClick={(event) => onNavigateRoadmaps(event, '/roadmaps')} className="text-sky-700 hover:text-sky-900">
        Roadmaps
      </button>
      <span>/</span>
      <span className="text-slate-700">F-1 OPT</span>
      <button
        type="button"
        onClick={(event) => onNavigateRoadmaps(event, '/roadmaps')}
        className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all Roadmaps
      </button>
    </div>

    <section className="grid gap-6 py-4 lg:grid-cols-[minmax(0,0.9fr),minmax(360px,0.7fr)] lg:items-start">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
          <BookOpenCheck className="h-3.5 w-3.5" />
          F-1 OPT roadmap
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">F-1 OPT Roadmap</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Understand your OPT process from school recommendation to EAD and status maintenance.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {['6 steps', '10+ documents', '3 key deadlines'].map((item) => (
            <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="#opt-date-calculator"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
          >
            Start Date Calculator
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#opt-documents"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-6 py-3.5 text-sm font-bold text-sky-700 transition hover:bg-sky-50 active:scale-[0.99] sm:w-auto"
          >
            View Required Documents
          </a>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Planning helper, not legal advice. Always confirm exact dates and requirements with your DSO or official sources.
        </p>
      </div>

      <HeroSequenceCard />
    </section>

    <RoadmapOverview />

    <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
      <QuickFact icon={CalendarDays} label="Start here" value="Prepare documents 3-4 months before your program end date." />
      <QuickFact icon={UserRound} label="School step" value="Request your OPT I-20 from your DSO before filing with USCIS." />
      <QuickFact icon={Landmark} label="USCIS deadline" value="File Form I-765 generally within 30 days after DSO recommendation." />
      <QuickFact icon={ShieldCheck} label="Work start" value="Do not start working before your EAD start date." />
    </section>

    <OptDateCalculator />
    <RoadmapTimeline steps={f1OptRoadmap.steps} />
    <RequiredDocumentsChecklist />
    <GlossarySection />
    <OfficialSources />
    <DisclaimerCard compact />
  </div>
);

const HeroSequenceCard: React.FC = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-900/5">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Process sequence</p>
    <div className="mt-4 space-y-3">
      {[
        ['1', 'School request', 'Ask your DSO for the OPT recommendation I-20.'],
        ['2', 'USCIS filing', 'File Form I-765 after the OPT I-20 is issued.'],
        ['3', 'EAD and status', 'Wait for approval, then follow OPT reporting rules.'],
      ].map(([number, title, text]) => (
        <div key={number} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
            {number}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
      After your DSO recommends OPT, you generally need to file Form I-765 within 30 days.
    </div>
  </div>
);

const RoadmapOverview: React.FC = () => (
  <section className="border-t border-slate-200 py-8">
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Roadmap overview</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Your F-1 OPT process at a glance</h2>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-6">
        {f1OptRoadmap.steps.map((step, index) => (
          <div key={step.id} className="relative rounded-2xl bg-slate-50 p-4 md:min-h-[128px]">
            {index < f1OptRoadmap.steps.length - 1 && (
              <div className="absolute left-8 top-12 h-[calc(100%+0.75rem)] w-px bg-sky-100 md:left-auto md:right-[-0.4rem] md:top-8 md:h-px md:w-3" />
            )}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
              {index + 1}
            </div>
            <p className="mt-4 text-sm font-semibold leading-5 text-slate-950">
              {step.id === 'file-i765' ? 'File I-765' : step.id === 'wait-for-uscis' ? 'Track USCIS' : step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
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

const RequiredDocumentsChecklist: React.FC = () => (
  <section id="opt-documents" className="border-t border-slate-200 py-10 scroll-mt-24">
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Documents checklist</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Documents you may need</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Use this as a planning checklist before your school request and USCIS filing.
      </p>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      {f1OptDocumentGroups.map((group) => (
        <article key={group.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-950">{group.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {group.documents.map((document) => (
              <div key={document} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                <span>{document}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>

    <button
      type="button"
      disabled
      className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-500 sm:w-auto"
    >
      Save to My Checklist - Coming soon
    </button>
  </section>
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

const OfficialSources: React.FC = () => (
  <section className="border-t border-slate-200 py-10">
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Official sources</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Review before filing</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Review USCIS guidance and your school DSO instructions before filing.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {f1OptOfficialSources.map((source) => (
        <a
          key={source.title}
          href={source.url}
          target={source.url.startsWith('mailto:') ? undefined : '_blank'}
          rel={source.url.startsWith('mailto:') ? undefined : 'noreferrer'}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-950">{source.title}</h3>
            <ExternalLink className="h-4 w-4 shrink-0 text-sky-700" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{source.description}</p>
        </a>
      ))}
    </div>
  </section>
);

export default RoadmapsRoutes;
