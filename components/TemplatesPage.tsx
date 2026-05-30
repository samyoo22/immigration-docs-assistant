import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Mail, MessageSquareText } from 'lucide-react';
import { messageTemplateCategories, MessageTemplate } from '../data/messageTemplates';

interface TemplatesPageProps {
  onNavigateHome: (event?: React.MouseEvent<HTMLElement>) => void;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ onNavigateHome }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const templateCount = useMemo(
    () => messageTemplateCategories.reduce((sum, category) => sum + category.templates.length, 0),
    [],
  );

  const handleCopy = async (template: MessageTemplate) => {
    const copyText = `Subject: ${template.subject}\n\n${template.body}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = copyText;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedId(template.id);
    window.setTimeout(() => setCopiedId((current) => (current === template.id ? null : current)), 2200);
  };

  return (
    <div className="animate-fade-in py-8">
      <a
        href="/"
        onClick={onNavigateHome}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </a>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),280px] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Practical next-step messages</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Message Templates</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Copy simple templates to ask your DSO, employer, or attorney the right questions.
          </p>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-sky-700" />
            <h2 className="text-sm font-semibold text-slate-950">Template library</h2>
          </div>
          <p className="mt-4 text-2xl font-semibold text-slate-950">{templateCount} templates</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Copy subject and body together. Nothing is sent automatically.</p>
        </aside>
      </div>

      <div className="mt-8 space-y-8">
        {messageTemplateCategories.map((category) => (
          <section key={category.id} className="scroll-mt-24">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-950">{category.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {category.templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  copied={copiedId === template.id}
                  onCopy={() => handleCopy(template)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const TemplateCard = ({
  template,
  copied,
  onCopy,
}: {
  template: MessageTemplate;
  copied: boolean;
  onCopy: () => void;
}) => (
  <article className="flex min-h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Mail className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-950">{template.title}</h3>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
          copied
            ? 'bg-emerald-100 text-emerald-700'
            : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50'
        }`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>

    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Best for</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{template.bestFor}</p>
    </div>

    <div className="mt-4 grid flex-1 gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Subject</p>
        <p className="mt-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800">
          {template.subject}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Message</p>
        <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
          {template.body}
        </div>
      </div>
    </div>
  </article>
);

export default TemplatesPage;
