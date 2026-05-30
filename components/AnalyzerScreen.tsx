import React, { useRef, useState } from 'react';
import { AppState, ChecklistItem, UserIntent, VisaSituation } from '../types';
import AnalysisResult from './AnalysisResult';
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Loader2,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { sampleDocuments } from '../data/sampleDocuments';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

interface AnalyzerScreenProps {
  appState: AppState;
  setSituation: (s: VisaSituation) => void;
  setIntent: (intent: UserIntent) => void;
  setInputText: (t: string) => void;
  setAcceptedDisclaimer: (accepted: boolean) => void;
  onAnalyze: () => void;
  onBack: () => void;
  onCopy: (text: string) => void;
}

const AnalyzerScreen: React.FC<AnalyzerScreenProps> = ({
  appState,
  setSituation,
  setIntent,
  setInputText,
  setAcceptedDisclaimer,
  onAnalyze,
  onBack,
  onCopy,
}) => {
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canAnalyze = appState.inputText.trim().length >= 10 && appState.hasAcceptedDisclaimer && !appState.isAnalyzing;

  const situationOptions = [
    { label: 'F-1 student', value: VisaSituation.SCHOOL_TRANSFER },
    { label: 'F-1 OPT', value: VisaSituation.F1_OPT_APPLY },
    { label: 'STEM OPT', value: VisaSituation.F1_OPT_ACTIVE },
    { label: 'H-1B', value: VisaSituation.H1B },
    { label: 'Change of Status', value: VisaSituation.CHANGE_OF_STATUS },
    { label: 'I received a USCIS notice', value: VisaSituation.USCIS_NOTICE },
    { label: "I'm not sure", value: VisaSituation.OTHER },
  ];

  const helpOptions = [
    UserIntent.EMAIL,
    UserIntent.OPT,
    UserIntent.ASK_DSO,
    UserIntent.ASK_EMPLOYER,
    UserIntent.GENERAL,
  ];

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += `${pageText}\n\n`;
    }

    return fullText.trim();
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      return extractTextFromPdf(file);
    }

    if (file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt')) {
      return file.text();
    }

    return '';
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isSupportedFile =
      file.type === 'application/pdf' ||
      file.type.startsWith('text/') ||
      file.name.toLowerCase().endsWith('.txt');

    if (!isSupportedFile) {
      setPdfError("We couldn't read this file. Please try another file or paste the text manually.");
      setPdfFileName(null);
      event.target.value = '';
      return;
    }

    setIsParsingPdf(true);
    setPdfError(null);

    try {
      const text = await extractTextFromFile(file);
      if (!text) {
        setPdfError("We couldn't read this file. Please try another file or paste the text manually.");
        setPdfFileName(null);
      } else {
        setInputText(text);
        setPdfFileName(file.name);
      }
    } catch (error) {
      console.error(error);
      setPdfError("We couldn't read this file. Please try another file or paste the text manually.");
      setPdfFileName(null);
    } finally {
      setIsParsingPdf(false);
      event.target.value = '';
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </button>

      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Document analyzer</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Upload your visa document
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Add an immigration document and get a plain-English review with dates, documents, questions, and a visa todo checklist.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.25fr)] lg:items-start">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                What is your current situation?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {situationOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSituation(option.value)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                      appState.situation === option.value
                        ? 'border-sky-700 bg-sky-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                What do you need help with?
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {helpOptions.map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => setIntent(intent)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${
                      appState.intent === intent
                        ? 'border-sky-700 bg-sky-50 text-sky-800 ring-2 ring-sky-100'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50'
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-950">Try with a sample</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Not sure what to upload? Start with a sample document type.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {sampleDocuments.map((sample) => (
                  <button
                    key={sample.title}
                    type="button"
                    onClick={() => {
                      setSituation(sample.situation);
                      setIntent(sample.helpGoal);
                      setInputText(sample.text);
                      setPdfFileName(null);
                      setPdfError(null);
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50"
                  >
                    <span className="block text-sm font-semibold text-slate-950">{sample.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">{sample.description}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Sample text is fictional and for product demonstration only.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,text/plain,.txt,image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsingPdf || appState.isAnalyzing}
                className="flex w-full items-center gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-left transition hover:border-sky-300 hover:bg-sky-100/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                  {isParsingPdf ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-950">Upload a document</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">
                    PDF, JPG, PNG, or text files. Common examples: USCIS notices, I-20s, I-765 instructions, DSO emails, RFE letters, receipt notices, approval notices, and EAD-related notices.
                  </span>
                </span>
              </button>

              {pdfFileName && (
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">File selected: {pdfFileName}</p>
                    <p className="mt-0.5 text-xs font-medium text-sky-700">Ready to analyze</p>
                  </div>
                </div>
              )}

              {pdfError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-5 text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {pdfError}
                </div>
              )}

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Or paste document text below
                </p>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="relative mt-3">
                <textarea
                  value={appState.inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Paste the document text here. For example: instructions from your DSO, a USCIS notice, OPT checklist, or EAD-related email."
                  className="min-h-[250px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
                {isParsingPdf && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
                    <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
                      Extracting text...
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>{appState.inputText ? `${appState.inputText.length} characters` : 'Paste at least 10 characters to begin.'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setPdfFileName(null);
                    setPdfError(null);
                  }}
                  disabled={!appState.inputText}
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/70">
              <input
                type="checkbox"
                checked={appState.hasAcceptedDisclaimer}
                onChange={(event) => setAcceptedDisclaimer(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-500"
              />
              <span className="text-sm leading-6 text-slate-600">
                I understand this is general information and not legal advice.
              </span>
            </label>

            <button
              onClick={onAnalyze}
              disabled={!canAnalyze}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              {appState.isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze document'
              )}
            </button>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
              <p className="text-xs leading-5 text-slate-500">
                Avoid entering passport numbers, SSNs, SEVIS IDs, or other highly sensitive details unless necessary.
              </p>
            </div>
          </div>
        </section>

        <section aria-live="polite">
          {appState.isAnalyzing ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin text-sky-700" />
              <h2 className="mt-5 text-lg font-semibold text-slate-950">Reading your document</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                VisaTodo is looking for summaries, next steps, dates, documents, and questions to verify.
              </p>
            </div>
          ) : appState.error ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
              <AlertCircle className="h-10 w-10 text-rose-600" />
              <h2 className="mt-5 text-lg font-semibold text-rose-950">We could not create a review</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-rose-700">{appState.error}</p>
            </div>
          ) : appState.result ? (
            <AnalysisResult
              result={appState.result}
              checklistItems={appState.checklistState}
              situation={appState.situation}
              onCopy={onCopy}
            />
          ) : (
            <div className="min-h-[520px] rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 shadow-sm">
              <div className="flex h-full min-h-[470px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <FileText className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-slate-950">Your analysis will appear here</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                  You will see a plain-English summary, todo checklist, important dates, documents mentioned, and questions to ask.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AnalyzerScreen;
