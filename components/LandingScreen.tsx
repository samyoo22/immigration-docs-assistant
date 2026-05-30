import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FolderCheck,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  MessageSquareText,
  UploadCloud,
} from 'lucide-react';

interface LandingScreenProps {
  onUploadDocument: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
  onOpenTemplates?: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const outputs = [
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
    icon: MessageSquareText,
    title: 'Message templates',
    description: 'Copy simple notes to ask your DSO, employer, or attorney.',
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

const sampleChecklist = [
  'Save this receipt notice',
  'Track your case online',
  'Watch for USCIS mail',
];

const LandingScreen: React.FC<LandingScreenProps> = ({ onUploadDocument, onOpenTemplates }) => {
  return (
    <div className="animate-fade-in">
      <HeroSection onUploadDocument={onUploadDocument} onOpenTemplates={onOpenTemplates} />
      <SupportedDocumentPills />
      <WhatYouGetSection />
      <HowItWorksSection />
      <TrustSection />
      <FinalCtaSection onUploadDocument={onUploadDocument} />
    </div>
  );
};

interface HomeActionProps {
  onUploadDocument: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
  onOpenTemplates?: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection: React.FC<HomeActionProps> = ({ onUploadDocument, onOpenTemplates }) => (
  <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,0.96fr),minmax(360px,0.86fr)] lg:items-center lg:py-10">
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
        <ShieldCheck className="h-3.5 w-3.5" />
        Plain-English immigration document help
      </div>

      <h1 className="max-w-2xl text-4xl font-semibold leading-[1.03] tracking-tight text-slate-950 sm:text-5xl lg:text-[4.05rem]">
        Upload your notice. Get your next steps.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        Upload a USCIS, school, or visa document. VisaTodo explains what it means, highlights key dates, and creates a simple checklist.
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
          See sample result
        </a>
        <a
          href="/templates"
          onClick={onOpenTemplates}
          className="inline-flex justify-center text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          Browse templates
        </a>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        Preview before account · Private by design · Not legal advice
      </p>
    </div>

    <SampleResultCard />
  </section>
);

const SampleResultCard: React.FC = () => (
  <div id="example-result" className="scroll-mt-24 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-sky-900/5">
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Sample VisaTodo result</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">USCIS Receipt Notice</h2>
      </div>
      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Ready in seconds</span>
    </div>

    <div className="divide-y divide-slate-200">
      <ResultSection icon={FileText} title="What this means">
        <p className="text-sm leading-6 text-slate-600">
          USCIS received your application and created a case record.
        </p>
      </ResultSection>

      <ResultSection icon={CalendarDays} title="Key details">
        <div className="space-y-2 text-sm leading-6 text-slate-600">
          <p>Receipt date: May 12, 2026</p>
          <p>Action needed: No immediate action</p>
          <p>Next check: 2–4 weeks</p>
        </div>
      </ResultSection>

      <ResultSection icon={ListChecks} title="Your checklist">
        <div className="space-y-2">
          {sampleChecklist.map((task) => (
            <div key={task} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              {task}
            </div>
          ))}
        </div>
      </ResultSection>
    </div>

    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
      Receipt number saved
    </div>
  </div>
);

const ResultSection: React.FC<{
  children: React.ReactNode;
  icon: typeof FileText;
  title: string;
}> = ({ children, icon: Icon, title }) => (
  <div className="py-4">
    <div className="mb-2 flex items-center gap-2">
      <Icon className="h-4 w-4 text-sky-700" />
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
    </div>
    {children}
  </div>
);

const SupportedDocumentPills: React.FC = () => (
  <section id="supported-documents" className="py-4 scroll-mt-24">
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Works with documents like:</p>
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

const WhatYouGetSection: React.FC = () => (
  <section id="outputs" className="border-t border-slate-200 py-14 scroll-mt-24">
    <SectionIntro
      label="Outputs"
      title="What VisaTodo pulls out for you"
      subtitle="Turn confusing immigration paperwork into clear, useful information."
    />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {outputs.map(({ icon: Icon, title, description }) => (
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
          Upload Document
        </a>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500">Preview before account · Not legal advice</p>
    </div>
  </section>
);

const SectionIntro: React.FC<{ label: string; subtitle?: string; title: string }> = ({ label, subtitle, title }) => (
  <div className="mb-8">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{label}</p>
    <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
    {subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>}
  </div>
);

export default LandingScreen;
