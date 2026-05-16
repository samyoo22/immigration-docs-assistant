import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  IdCard,
  ListChecks,
  MessageCircleQuestion,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

interface LandingScreenProps {
  onAnalyzeDocument: () => void;
  onPasteText: () => void;
}

const helpCategories = [
  { icon: FileText, title: 'USCIS notices' },
  { icon: GraduationCap, title: 'OPT / STEM OPT instructions' },
  { icon: ClipboardList, title: 'I-20 and school documents' },
  { icon: IdCard, title: 'EAD-related instructions' },
  { icon: ListChecks, title: 'Required document checklists' },
  { icon: MessageCircleQuestion, title: 'Questions to ask your DSO or attorney' },
];

const previewActions = [
  'Review your I-20 information',
  'Prepare required forms and supporting documents',
  'Confirm deadlines with your DSO',
  'Submit materials before the listed deadline',
];

const trustItems = [
  'Not legal advice',
  'Based only on the document you provide',
  'Important dates should be verified',
  'User controls their data',
  'Designed for plain-language understanding',
];

const LandingScreen: React.FC<LandingScreenProps> = ({ onAnalyzeDocument, onPasteText }) => {
  return (
    <div className="animate-fade-in">
      <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr),minmax(360px,0.9fr)] lg:items-center lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            General information only. Not legal advice.
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Understand your visa documents. Know what to do next.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            VisaTodo turns confusing immigration instructions into simple summaries, clear checklists, and next steps — in plain English.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onAnalyzeDocument}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99]"
            >
              Analyze a document
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onPasteText}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
            >
              Paste text instead
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-sky-900/5 sm:p-5">
          <div className="rounded-[1.5rem] bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">VisaTodo preview</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">OPT instruction summary</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Ready</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-700" />
                  <h3 className="text-sm font-semibold text-slate-950">Simple Summary</h3>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  This document appears to explain steps for preparing an OPT or STEM OPT application.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-emerald-700" />
                  <h3 className="text-sm font-semibold text-slate-950">Action Items</h3>
                </div>
                <div className="space-y-2">
                  {previewActions.map((task) => (
                    <div key={task} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-slate-950">Important Dates</h3>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">Detected dates are highlighted. Unclear dates are marked “Verify with official source.”</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-sky-700" />
                    <h3 className="text-sm font-semibold text-slate-950">Documents Mentioned</h3>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">I-20, Form I-765, passport, I-94, EAD card if applicable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">How it works</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">From document to to-do list</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Upload or paste your document', UploadCloud],
            ['Get a plain-language explanation', FileText],
            ['Follow your personalized to-do list', CheckCircle2],
          ].map(([title, Icon], index) => {
            const StepIcon = Icon as typeof UploadCloud;
            return (
              <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <StepIcon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Step {index + 1}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-950">{title as string}</h3>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-4">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">What VisaTodo can help with</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Common documents and next-step questions</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map(({ icon: Icon, title }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-sky-700" />
              <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Result preview</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Clear output you can act on carefully</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                VisaTodo keeps the output practical: what the document appears to mean, what to prepare, and what to verify.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Simple Summary', 'This document appears to explain steps for preparing an OPT or STEM OPT application.'],
                ['Action Items', 'Review your I-20, prepare forms, confirm deadlines with your DSO, and submit before the listed deadline.'],
                ['Important Dates', 'Highlight detected dates clearly. Mark unclear dates as “Verify with official source.”'],
                ['Documents Mentioned', 'I-20, Form I-765, passport, I-94, and EAD card if applicable.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.7fr,1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">Trust and safety</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Careful by design</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700 ring-1 ring-sky-100">
                <ShieldCheck className="h-4 w-4 shrink-0 text-sky-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 text-center">
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
          Turn confusing visa instructions into a clear to-do list.
        </h2>
        <button
          onClick={onAnalyzeDocument}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99]"
        >
          Try VisaTodo
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
};

export default LandingScreen;
