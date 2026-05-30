import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FolderCheck,
  GraduationCap,
  ListChecks,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

interface LandingScreenProps {
  onUploadDocument: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
  onCreateChecklist: (event?: React.MouseEvent<HTMLAnchorElement>, checklistPath?: string) => void;
}

const coreFeatures = [
  {
    icon: FileText,
    title: 'Plain-English summary',
    description: 'See what the document is saying without legal or government jargon.',
  },
  {
    icon: CalendarDays,
    title: 'Key dates',
    description: 'Pull out receipt dates, deadlines, appointment dates, and timing notes.',
  },
  {
    icon: ListChecks,
    title: 'Next steps',
    description: 'Turn the document into practical tasks you can follow.',
  },
  {
    icon: FolderCheck,
    title: 'Required documents',
    description: 'Keep track of documents to save, prepare, or review.',
  },
  {
    icon: ClipboardCheck,
    title: 'Saved checklist',
    description: 'Organize what is done, what is due, and what needs attention.',
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
    title: 'Get a plain-English summary',
    description: 'Understand what the document says without legal jargon.',
  },
  {
    icon: ClipboardCheck,
    title: 'Follow your checklist',
    description: 'See key dates, next steps, and documents to keep or prepare.',
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
  'USCIS Receipt Notices',
  'OPT / STEM OPT documents',
  'School DSO instructions',
  'RFE letters',
  'Visa appointment documents',
];

const sampleNextSteps = [
  'Save your receipt notice',
  'Track your case status',
  'Watch for mail from USCIS',
  'Update your address if you move',
];

const LandingScreen: React.FC<LandingScreenProps> = ({ onUploadDocument }) => {
  return (
    <div className="animate-fade-in">
      <HeroSection onUploadDocument={onUploadDocument} />
      <HowItWorksSection />
      <WhatVisaTodoExtractsSection />
      <TrustSection />
      <DocumentTypesSection />
      <FinalCtaSection onUploadDocument={onUploadDocument} />
    </div>
  );
};

interface HomeActionProps {
  onUploadDocument: (event?: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroSection: React.FC<HomeActionProps> = ({ onUploadDocument }) => (
  <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr),minmax(360px,0.82fr)] lg:items-center lg:py-16">
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm">
        <ShieldCheck className="h-3.5 w-3.5" />
        Plain-language immigration document help
      </div>

      <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        Turn confusing immigration documents into clear next steps.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        VisaTodo explains USCIS, school, and visa-related documents in plain English &mdash; then turns them into key dates, next steps, and a checklist.
      </p>

      <div className="mt-8 max-w-sm">
        <a
          href="/upload"
          onClick={onUploadDocument}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Your Document
        </a>
        <p className="mt-3 text-xs font-medium text-slate-500">No account required to preview results.</p>
      </div>
    </div>

    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl shadow-sky-900/5 sm:p-5">
      <div className="rounded-[1.1rem] bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-3 sm:grid-cols-[1fr,auto,1fr] sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Original document</p>
              <h2 className="mt-1 text-base font-semibold text-slate-950">USCIS Receipt Notice</h2>
            </div>
            <div className="hidden h-px w-8 bg-slate-300 sm:block" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">VisaTodo result</p>
              <h2 className="mt-1 text-base font-semibold text-slate-950">Summary + Checklist</h2>
            </div>
          </div>
          <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Ready in seconds</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-700" />
              <h3 className="text-sm font-semibold text-slate-950">Plain-English summary</h3>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              USCIS has received your application. Save this notice and use the receipt number to track your case status.
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
            <MiniPreviewCard icon={CalendarDays} title="Key dates" description="Receipt date and next expected step are pulled out for review." />
            <MiniPreviewCard icon={ClipboardList} title="Documents" description="The notice is added to your saved document list." />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CoreFeaturesSection: React.FC = () => (
  <section className="border-t border-slate-200 py-14">
    <SectionIntro label="What VisaTodo extracts" title="Know exactly what you receive" />
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
  <section className="border-t border-slate-200 py-14">
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

const WhatVisaTodoExtractsSection: React.FC = () => <CoreFeaturesSection />;

const TrustSection: React.FC = () => (
  <section className="py-14">
    <SectionIntro label="Trust and safety" title="Designed for sensitive immigration paperwork" />
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
  <section className="py-4">
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.78fr,1.22fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Made for documents like</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Recognize your document faster</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            VisaTodo is focused on the immigration, school, and visa paperwork people actually need to understand.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {documentTypes.map((documentType) => (
            <div key={documentType} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-sky-700" />
              <span className="text-sm font-medium text-slate-700">{documentType}</span>
            </div>
          ))}
        </div>
      </div>
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
