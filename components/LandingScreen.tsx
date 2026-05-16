import React from 'react';
import { VisaSituation, Locale } from '../types';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileSearch,
  FileText,
  GraduationCap,
  Link2,
  ListChecks,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { t } from '../utils/i18n';

interface LandingScreenProps {
  situation: VisaSituation;
  setSituation: (s: VisaSituation) => void;
  onStartSample: () => void;
  onStartCustom: () => void;
  locale: Locale;
}

const LandingScreen: React.FC<LandingScreenProps> = ({
  situation,
  setSituation,
  onStartSample,
  onStartCustom,
  locale,
}) => {
  const situationOptions = [
    { value: VisaSituation.F1_PRE_ARRIVAL, label: "I'm a new student" },
    { value: VisaSituation.F1_STUDY, label: "I'm a current F-1 student" },
    { value: VisaSituation.F1_OPT_APPLY, label: "I'm applying for OPT" },
    { value: VisaSituation.F1_OPT_ACTIVE, label: "I'm on OPT / STEM OPT" },
    { value: VisaSituation.OTHER, label: "Other / not sure yet" },
  ];

  const workflow = [
    'Upload or paste a document',
    'Understand the key points',
    'Turn instructions into tasks',
    'Track progress and deadlines',
  ];

  const features = [
    {
      icon: FileSearch,
      title: 'Document Explainer',
      desc: 'Upload or paste visa-related instructions and get a plain-language summary.',
    },
    {
      icon: ListChecks,
      title: 'Smart To-Do List',
      desc: 'Turn confusing requirements into clear tasks, deadlines, and reminders.',
    },
    {
      icon: CalendarDays,
      title: 'Visa Path Tracker',
      desc: 'Track OPT, STEM OPT, H-1B, F-1, I-20, DS-160, and other important milestones.',
    },
    {
      icon: Link2,
      title: 'Trusted Resource Hub',
      desc: 'Find official links, common forms, and step-by-step guides in one place.',
    },
  ];

  const sampleTasks = [
    { title: 'Confirm OPT recommendation on I-20', due: 'This week', status: 'In progress' },
    { title: 'Prepare I-765 documents', due: 'Before filing', status: 'To do' },
    { title: 'Ask DSO about program end date', due: 'As soon as possible', status: 'To do' },
  ];

  return (
    <div className="animate-fade-in">
      <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1.02fr),minmax(360px,0.98fr)] lg:items-center lg:py-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-100">
            <GraduationCap className="h-3.5 w-3.5 text-sky-300" />
            Friendly workspace for students, immigrants, and visa applicants
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn visa paperwork into clear next steps.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Upload a document, get a plain-language explanation, and create a personalized checklist for what to do next.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
              <p>Not legal advice. Just clearer documents, better checklists, and less confusion.</p>
            </div>
          </div>

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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Try Demo
            </button>
          </div>

          <div className="mt-8 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Start with your situation
            </label>
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value as VisaSituation)}
              className="mt-3 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-100 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            >
              {situationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl shadow-sky-950/30 sm:p-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">My Visa Path</p>
                <h2 className="mt-1 text-lg font-semibold text-white">OPT application workspace</h2>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Planning
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <p className="text-[11px] text-slate-500">Upcoming Tasks</p>
                <p className="mt-2 text-2xl font-semibold text-white">3</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <p className="text-[11px] text-slate-500">Important Deadlines</p>
                <p className="mt-2 text-2xl font-semibold text-white">2</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-300" />
                <h3 className="text-sm font-semibold text-slate-100">Recent document summary</h3>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                Your school email appears to explain OPT filing steps, timing, and documents to prepare before submitting.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {sampleTasks.map((task) => (
                <div key={task.title} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.due} · {task.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Why it helps</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Immigration documents are hard to read when deadlines matter.</h2>
          </div>
          <p className="text-sm leading-7 text-slate-300 sm:text-base">
            Immigration documents are often long, confusing, and full of legal language. VisaTodo helps you understand what matters, what to do next, and what deadlines to watch.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">How it works</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">From confusing document to clear checklist</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Document to plain-language summary to action items to to-do list to deadline tracking.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-400 text-xs font-bold text-slate-950">
                {index + 1}
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-100">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5">
              <Icon className="h-5 w-5 text-sky-300" />
              <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              Example workflow
            </div>
            <h2 className="text-2xl font-semibold text-white">Start organizing your visa paperwork today.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Upload your I-20, USCIS notice, school email, or visa instruction document. VisaTodo highlights key dates, required actions, and better questions to ask a DSO, attorney, employer, or school official.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-start gap-3 rounded-xl bg-slate-900 p-4">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-slate-100">Questions to ask</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  “Can you confirm my OPT filing window and whether this document changes my next step?”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingScreen;
