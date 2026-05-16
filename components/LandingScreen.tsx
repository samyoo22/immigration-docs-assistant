import React from 'react';
import { VisaSituation, Locale } from '../types';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  ListChecks,
  NotebookTabs,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface LandingScreenProps {
  situation: VisaSituation;
  setSituation: (s: VisaSituation) => void;
  onStartSample: () => void;
  onStartCustom: () => void;
  locale: Locale;
}

const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartSample,
  onStartCustom,
}) => {
  const steps = [
    {
      title: 'Upload or paste a document',
      desc: 'Add an I-20, USCIS notice, school email, or visa instruction.',
    },
    {
      title: 'Get a plain-English explanation',
      desc: 'See what the document means, what matters, and what dates to watch.',
    },
    {
      title: 'Save your next steps',
      desc: 'Turn important actions into a clear visa to-do list.',
    },
  ];

  const features = [
    {
      icon: FileText,
      title: 'Plain-language summaries',
      desc: 'Understand confusing immigration instructions without legal jargon.',
    },
    {
      icon: ListChecks,
      title: 'Smart visa tasks',
      desc: 'Convert document requirements into checklists, deadlines, and priorities.',
    },
    {
      icon: NotebookTabs,
      title: 'Your visa workspace',
      desc: 'Keep documents, tasks, and important dates organized in one place.',
    },
  ];

  const mockTasks = ['Review I-20', 'Prepare Form I-765', 'Ask DSO to confirm SEVIS update'];

  return (
    <div className="animate-fade-in">
      <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr),minmax(360px,0.9fr)] lg:items-center lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            VisaTodo
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn visa paperwork into clear next steps.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            VisaTodo helps you understand immigration documents, find key dates, and organize your next tasks in one simple workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onStartCustom}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300 active:scale-[0.99]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onStartSample}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Try Demo
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl shadow-sky-950/30 sm:p-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Document Review</p>
                <h2 className="mt-1 text-lg font-semibold text-white">OPT school notice</h2>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Ready
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-300" />
                  <h3 className="text-sm font-semibold text-slate-100">Document Summary</h3>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  Your school notice includes OPT-related instructions and important filing steps.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-amber-300" />
                  <h3 className="text-sm font-semibold text-slate-100">Key Dates</h3>
                </div>
                <p className="text-sm font-medium text-amber-100">May 30, 2026 — Recommended filing deadline</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-emerald-300" />
                  <h3 className="text-sm font-semibold text-slate-100">Next Tasks</h3>
                </div>
                <div className="space-y-2">
                  {mockTasks.map((task) => (
                    <div key={task} className="flex items-center gap-2 rounded-lg bg-slate-950/70 px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                      <span className="text-sm text-slate-200">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">How it works</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">From document to to-do list</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-400 text-sm font-bold text-slate-950">
                {index + 1}
              </span>
              <h3 className="mt-5 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5">
              <Icon className="h-5 w-5 text-sky-300" />
              <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-amber-400/25 bg-amber-400/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
          <p className="text-sm leading-6 text-amber-50/90">
            VisaTodo is not a law firm and does not provide legal advice. We help you understand documents, organize tasks, and prepare better questions for qualified professionals.
          </p>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Ready to organize your visa paperwork?
        </h2>
        <button
          onClick={onStartCustom}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300 active:scale-[0.99]"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
};

export default LandingScreen;
