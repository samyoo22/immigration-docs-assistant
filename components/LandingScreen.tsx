import React from 'react';
import {
  ArrowDown,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FolderCheck,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  SearchCheck,
  UploadCloud,
} from 'lucide-react';

interface LandingScreenProps {
  onUploadDocument: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const coreFeatures = [
  {
    icon: FileText,
    title: 'Plain-English summary',
    description: 'Understand what the document says without legal jargon.',
  },
  {
    icon: CalendarDays,
    title: 'Key dates',
    description: 'See receipt dates, deadlines, and when to check again.',
  },
  {
    icon: SearchCheck,
    title: 'Action needed',
    description: 'Know whether you need to respond, wait, save, or prepare something.',
  },
  {
    icon: ListChecks,
    title: 'Checklist',
    description: 'Turn your document into simple steps you can follow.',
  },
  {
    icon: FolderCheck,
    title: 'Saved documents',
    description: 'Keep important notices organized in one place.',
  },
];

const howItWorks = [
  {
    icon: UploadCloud,
    title: 'Upload your document',
    description: 'Add a USCIS, school, or visa-related document.',
  },
  {
    icon: Sparkles,
    title: 'VisaTodo pulls out what matters',
    description: 'Get the summary, dates, receipt details, and action items.',
  },
  {
    icon: ClipboardCheck,
    title: 'Follow your next steps',
    description: 'Use your checklist to track what to save, check, or prepare.',
  },
];

const trustCards = [
  {
    icon: LockKeyhole,
    title: 'Private by design',
    description: 'Your documents are used only to generate your summary and checklist.',
  },
  {
    icon: ShieldCheck,
    title: 'Not legal advice',
    description: 'VisaTodo helps you understand documents, but does not replace an attorney.',
  },
  {
    icon: GraduationCap,
    title: 'Built for immigrants and students',
    description: 'Designed for people navigating USCIS, school, and visa paperwork.',
  },
];

const documentTypes = [
  'USCIS Receipt Notice',
  'OPT / STEM OPT',
  'RFE',
  'DSO Instructions',
  'Visa Appointment',
];

const sampleNextSteps = [
  'Save this receipt notice',
  'Track your case with the receipt number',
  'Watch for mail from USCIS',
  'Update your address if you move',
];

const LandingScreen: React.FC<LandingScreenProps> = ({ onUploadDocument }) => {
  return (
    <div className="animate-fade-in">
      <HeroSection onUploadDocument={onUploadDocument} />
      <SupportedDocumentPills />
      <WhatVisaTodoExtractsSection />
      <HowItWorksSection />
      <TrustSection />
      <FinalCtaSection onUploadDocument={onUploadDocument} />
    </div>
  );
};

interface HomeActionProps {
  onUploadDocument: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection: React.FC<HomeActionProps> = ({ onUploadDocument }) => (
  <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.92fr),minmax(420px,1.08fr)] lg:items-center lg:py-10">
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
        <ShieldCheck className="h-3.5 w-3.5" />
        Plain-language immigration document help
      </div>

      <h1 className="max-w-2xl text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:text-5xl lg:text-[4.15rem]">
        Upload your notice. Get your next steps.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        VisaTodo turns USCIS, school, and visa documents into a plain-English summary, key dates, and a checklist you can follow.
      </p>

      <div className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href="/upload"
          onClick={onUploadDocument}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Document
        </a>
        <a href="#example-result" className="inline-flex justify-center text-sm font-semibold text-sky-700 transition hover:text-sky-900">
          See example result
        </a>
      </div>

      <div className="mt-5 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3">
        {['Preview before account', 'Private by design', 'Not legal advice'].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
            {item}
          </div>
        ))}
      </div>
    </div>

    <ProductFlowDemo />
  </section>
);

const ProductFlowDemo: React.FC = () => (
  <div id="example-result" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white/80 p-4 shadow-2xl shadow-sky-900/10 sm:p-5">
    <div className="rounded-[1.35rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Product flow demo</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">Uploaded document → extracted details → checklist</h2>
        </div>
        <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">Ready in seconds</span>
      </div>

      <div className="space-y-3">
        <FlowCard step="Step 1" label="Upload" icon={UploadCloud} accent="sky">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">Uploaded document</h3>
              <p className="mt-2 text-sm font-medium text-slate-700">USCIS_Receipt_Notice.pdf</p>
              <p className="mt-1 text-xs text-slate-500">I-797C Notice of Action</p>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Uploaded</span>
          </div>
        </FlowCard>

        <FlowConnector />

        <FlowCard step="Step 2" label="Understand" icon={SearchCheck} accent="teal" className="lg:ml-8">
          <h3 className="text-sm font-semibold text-slate-950">VisaTodo found</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <DetailPill label="Receipt number" value="IOE0912345678" />
            <DetailPill label="Receipt date" value="May 12, 2026" />
            <DetailPill label="Action needed" value="No immediate action" />
            <DetailPill label="Next check" value="2–4 weeks" />
          </div>
        </FlowCard>

        <FlowConnector />

        <FlowCard step="Step 3" label="Follow" icon={ClipboardCheck} accent="emerald" className="lg:ml-16">
          <h3 className="text-sm font-semibold text-slate-950">Your checklist</h3>
          <div className="mt-3 space-y-2">
            {sampleNextSteps.map((task) => (
              <div key={task} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-100">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-sm text-slate-700">{task}</span>
              </div>
            ))}
          </div>
        </FlowCard>
      </div>
    </div>
  </div>
);

const FlowConnector: React.FC = () => (
  <div className="flex h-5 items-center pl-7 text-slate-300 lg:pl-12">
    <div className="h-full border-l border-dashed border-slate-300" />
    <ArrowDown className="-ml-2 mt-4 h-4 w-4 text-slate-300" />
  </div>
);

const FlowCard: React.FC<{
  accent: 'sky' | 'teal' | 'emerald';
  children: React.ReactNode;
  className?: string;
  icon: typeof UploadCloud;
  label: string;
  step: string;
}> = ({ accent, children, className = '', icon: Icon, label, step }) => {
  const accentClasses = {
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5 ${className}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentClasses[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{step}</p>
          <p className="text-xs font-semibold text-slate-600">{label}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const DetailPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
  </div>
);

const CoreFeaturesSection: React.FC = () => (
  <section id="outputs" className="border-t border-slate-200 py-14 scroll-mt-24">
    <SectionIntro label="Outputs" title="What VisaTodo pulls out for you" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {coreFeatures.map(({ icon: Icon, title, description }) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorksSection: React.FC = () => (
  <section id="how-it-works" className="border-t border-slate-200 py-14 scroll-mt-24">
    <SectionIntro label="How it works" title="From confusing notice to clear checklist" />
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

const WhatVisaTodoExtractsSection: React.FC = () => <CoreFeaturesSection />;

const TrustSection: React.FC = () => (
  <section className="py-14">
    <SectionIntro label="Trust and safety" title="Built for sensitive immigration paperwork" />
    <div className="grid gap-4 md:grid-cols-3">
      {trustCards.map(({ icon: Icon, title, description }) => (
        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

const DocumentTypesSection: React.FC = () => (
  <section id="supported-documents" className="py-4 scroll-mt-24">
    <div className="flex flex-wrap gap-2">
      {documentTypes.map((documentType) => (
        <div key={documentType} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          <FileText className="h-4 w-4 shrink-0 text-sky-700" />
          {documentType}
        </div>
      ))}
    </div>
  </section>
);

const SupportedDocumentPills = DocumentTypesSection;

const FinalCtaSection: React.FC<HomeActionProps> = ({ onUploadDocument }) => (
  <section className="py-14">
    <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50 p-6 text-center sm:p-8">
      <h2 className="text-2xl font-semibold text-slate-950">Ready to understand your document?</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-700">
        Upload your immigration document and get a simple summary, key dates, and next steps.
      </p>
      <div className="mt-6">
        <a
          href="/upload"
          onClick={onUploadDocument}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Your Document
        </a>
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

export default LandingScreen;
