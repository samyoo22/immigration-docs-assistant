import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  ListChecks,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

interface LandingScreenProps {
  onUploadDocument: () => void;
  onCreateChecklist: () => void;
}

const coreFeatures = [
  {
    icon: FileText,
    title: 'AI Document Assistant',
    description:
      'Turn confusing immigration documents into simple summaries, key dates, required documents, and next steps.',
  },
  {
    icon: ListChecks,
    title: 'Visa Todo Checklist',
    description:
      'Follow step-by-step tasks for OPT, STEM OPT, H-1B, I-765, and other visa workflows.',
  },
];

const howItWorks = [
  {
    icon: UploadCloud,
    title: 'Upload your document',
    description: 'Add a USCIS notice, DSO email, I-20, RFE letter, or visa-related instruction.',
  },
  {
    icon: Sparkles,
    title: 'Get a simple summary',
    description: 'See the main point, dates to watch, documents mentioned, and warnings in plain English.',
  },
  {
    icon: ClipboardCheck,
    title: 'Follow your checklist',
    description: 'Move through clear next steps and keep track of what is done, due, or needs review.',
  },
];

const popularChecklists = [
  {
    title: 'F-1 OPT',
    description: 'Prepare your OPT timing, I-20 request, Form I-765, and supporting documents.',
  },
  {
    title: 'STEM OPT',
    description: 'Track employer details, Form I-983, school steps, and extension filing tasks.',
  },
  {
    title: 'H-1B',
    description: 'Organize employer-provided steps, notices, status checks, and key dates.',
  },
  {
    title: 'I-765',
    description: 'Collect identity documents, eligibility evidence, photos, fees, and submission tasks.',
  },
  {
    title: 'I-539',
    description: 'Review change or extension of status steps, evidence, signatures, and deadlines.',
  },
  {
    title: 'Change of Status',
    description: 'Understand common tasks, supporting documents, receipt tracking, and follow-up items.',
  },
];

const sampleNextSteps = [
  'Save your receipt notice',
  'Track your case status',
  'Watch for mail from USCIS',
  'Update your address if you move',
];

const LandingScreen: React.FC<LandingScreenProps> = ({ onUploadDocument, onCreateChecklist }) => {
  return (
    <div className="animate-fade-in">
      <HeroSection onUploadDocument={onUploadDocument} onCreateChecklist={onCreateChecklist} />
      <CoreFeaturesSection />
      <HowItWorksSection />
      <PopularChecklistsSection onCreateChecklist={onCreateChecklist} />
      <SampleResultPreview />
      <DisclaimerSection />
    </div>
  );
};

interface HomeActionProps {
  onUploadDocument: () => void;
  onCreateChecklist: () => void;
}

const HeroSection: React.FC<HomeActionProps> = ({ onUploadDocument, onCreateChecklist }) => (
  <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr),minmax(360px,0.82fr)] lg:items-center lg:py-16">
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
        <ShieldCheck className="h-3.5 w-3.5" />
        Plain-language immigration document help
      </div>

      <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        Understand your visa documents. Know what to do next.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        Upload your immigration document and get a plain-English summary with a clear visa checklist.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onUploadDocument}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99]"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Document
        </button>
        <button
          onClick={onCreateChecklist}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 active:scale-[0.99]"
        >
          <ListChecks className="h-4 w-4" />
          Create Checklist
        </button>
      </div>
    </div>

    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl shadow-sky-900/5 sm:p-5">
      <div className="rounded-[1.1rem] bg-slate-50 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Uploaded document</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">USCIS Receipt Notice</h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Summarized</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-700" />
              <h3 className="text-sm font-semibold text-slate-950">Plain-English summary</h3>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              USCIS has received your application. Save this notice and use the receipt number to track your case.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-700" />
              <h3 className="text-sm font-semibold text-slate-950">Next steps</h3>
            </div>
            <div className="space-y-2">
              {sampleNextSteps.map((task) => (
                <div key={task} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-sm text-slate-700">{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MiniPreviewCard icon={CalendarDays} title="Dates" description="Receipt date and notice date are pulled out for review." />
            <MiniPreviewCard icon={ClipboardList} title="Documents" description="The notice is added to your saved document list." />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CoreFeaturesSection: React.FC = () => (
  <section className="border-t border-slate-200 py-14">
    <SectionIntro label="Core features" title="Two simple ways to move forward" />
    <div className="grid gap-4 md:grid-cols-2">
      {coreFeatures.map(({ icon: Icon, title, description }) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorksSection: React.FC = () => (
  <section className="py-4">
    <SectionIntro label="How it works" title="From document to action plan" />
    <div className="grid gap-4 md:grid-cols-3">
      {howItWorks.map(({ icon: Icon, title, description }, index) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Step {index + 1}</p>
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

const PopularChecklistsSection: React.FC<{ onCreateChecklist: () => void }> = ({ onCreateChecklist }) => (
  <section className="py-14">
    <SectionIntro label="Popular checklists" title="Start with a common visa workflow" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {popularChecklists.map(({ title, description }) => (
        <div key={title} className="flex min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <GraduationCap className="h-5 w-5 text-sky-700" />
          <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
          <button
            onClick={onCreateChecklist}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            View checklist
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  </section>
);

const SampleResultPreview: React.FC = () => (
  <section className="py-4">
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.75fr,1.25fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Sample result preview</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">What you get after uploading</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A calm, practical view of what the document says, what matters, and what to do next.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Document type</p>
              <h3 className="mt-1 text-base font-semibold text-slate-950">USCIS Receipt Notice</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              General information
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr,0.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-950">Plain-English summary</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                USCIS has received your application. You should save this notice and use the receipt number to track your case.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-950">Next steps</h4>
              <div className="mt-3 space-y-2">
                {sampleNextSteps.map((step) => (
                  <div key={step} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DisclaimerSection: React.FC = () => (
  <section className="py-14">
    <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 ring-1 ring-sky-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">Trust and disclaimer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Helpful guidance, not legal advice</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            VIsatodo is not a law firm and does not provide legal advice. We help explain documents and organize tasks,
            but you should consult a qualified immigration attorney for legal decisions.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const SectionIntro: React.FC<{ label: string; title: string }> = ({ label, title }) => (
  <div className="mb-8">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{label}</p>
    <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
  </div>
);

const MiniPreviewCard: React.FC<{
  icon: typeof CalendarDays;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="mb-2 flex items-center gap-2">
      <Icon className="h-4 w-4 text-amber-600" />
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
    </div>
    <p className="text-sm leading-6 text-slate-600">{description}</p>
  </div>
);

export default LandingScreen;
