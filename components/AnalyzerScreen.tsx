import React, { useRef, useState } from 'react';
import { AppState, UserIntent, VisaSituation } from '../types';
import AnalysisResult from './AnalysisResult';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileText,
  ListChecks,
  Loader2,
  MessageSquareText,
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
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isPasteOpen, setIsPasteOpen] = useState(false);
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

  const helpOptions: { label: string; value: UserIntent }[] = [
    { label: 'Understand this document', value: UserIntent.EMAIL },
    { label: 'Find deadlines & next steps', value: UserIntent.GENERAL },
    { label: 'Create a checklist', value: UserIntent.OPT },
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

  const processUploadedFile = async (file: File) => {
    const isImageFile = file.type.startsWith('image/') || /\.(png|jpe?g)$/i.test(file.name);
    const isSupportedFile =
      file.type === 'application/pdf' ||
      file.type.startsWith('text/') ||
      file.name.toLowerCase().endsWith('.txt') ||
      isImageFile;

    if (!isSupportedFile) {
      setPdfError("We couldn't read this file. Please try another file or paste the text manually.");
      setPdfFileName(null);
      return;
    }

    if (isImageFile) {
      setPdfError("This beta cannot read screenshots directly yet. Please paste the text from the image, or upload a PDF/text file.");
      setPdfFileName(null);
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
        setIsPasteOpen(true);
      }
    } catch (error) {
      console.error(error);
      setPdfError("We couldn't read this file. Please try another file or paste the text manually.");
      setPdfFileName(null);
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
    event.target.value = '';
  };

  const handleFileDrop = async (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  const reviewPreviewItems = [
    { label: 'Plain-English summary', icon: <FileText className="h-4 w-4" /> },
    { label: 'Important dates and deadlines', icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'Required documents', icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'Next-step checklist', icon: <ListChecks className="h-4 w-4" /> },
    { label: 'Questions to ask your DSO, school, or employer', icon: <MessageSquareText className="h-4 w-4" /> },
  ];

  const renderAnalysisPanel = () => {
    if (appState.isAnalyzing) {
      return (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-sky-700" />
          <h2 className="mt-5 text-lg font-semibold text-slate-950">Reading your document</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            VisaTodo is looking for plain-English meaning, dates, documents, and next steps.
          </p>
        </div>
      );
    }

    if (appState.error) {
      return (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
          <AlertCircle className="h-10 w-10 text-rose-600" />
          <h2 className="mt-5 text-lg font-semibold text-rose-950">We could not create a review</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-rose-700">{appState.error}</p>
        </div>
      );
    }

    if (appState.result) {
      return (
        <AnalysisResult
          result={appState.result}
          checklistItems={appState.checklistState}
          situation={appState.situation}
          onCopy={onCopy}
        />
      );
    }

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">What VisaTodo will help you with</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload your document and we will turn it into simple language and practical next steps.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          {reviewPreviewItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                {item.icon}
              </span>
              <span className="text-sm font-medium leading-5 text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm leading-6 text-slate-700">
            Not sure what your visa category is? That's okay. You can upload first and add more details later.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in py-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(360px,0.78fr)] lg:items-start">
        <section className="space-y-5">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Document analyzer</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Upload your immigration document
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Not sure what this document means? Upload it here and VisaTodo will explain it in plain English, find important dates, and create your next-step checklist.
            </p>
          </div>

          <div id="document-input" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
              <div>
                <p className="text-sm font-semibold text-slate-950">Before you upload</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Please avoid passport numbers, SSNs, SEVIS IDs, full birth dates, addresses, or bank details unless they are truly needed.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,text/plain,.txt,image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              disabled={isParsingPdf || appState.isAnalyzing}
              className={`flex min-h-[210px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isDraggingFile
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-sky-200 bg-sky-50/70 hover:border-sky-400 hover:bg-sky-50'
              }`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                {isParsingPdf ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
              </span>
              <span className="mt-5 block text-lg font-semibold text-slate-950">Drag and drop your document here</span>
              <span className="mt-1 block text-sm font-semibold text-sky-700">or click to upload</span>
              <span className="mt-3 block text-xs leading-5 text-slate-500">
                PDF, JPG, PNG, or screenshot. Text extraction currently works best with PDF or TXT files.
              </span>
            </button>

            {pdfFileName && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">File selected: {pdfFileName}</p>
                  <p className="mt-0.5 text-xs font-medium text-sky-700">Ready to analyze</p>
                </div>
              </div>
            )}

            {pdfError && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm leading-5 text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {pdfError}
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsPasteOpen((isOpen) => !isOpen)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-800"
              >
                Paste document text instead
                <ChevronDown className={`h-4 w-4 transition ${isPasteOpen ? 'rotate-180' : ''}`} />
              </button>

              {(isPasteOpen || appState.inputText) && (
                <div className="relative mt-3">
                  <textarea
                    value={appState.inputText}
                    onChange={(event) => setInputText(event.target.value)}
                    placeholder="Paste the document text here. You can use a USCIS notice, DSO email, I-20 instruction, RFE letter, receipt notice, or approval notice."
                    className="min-h-[220px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>{appState.inputText ? `${appState.inputText.length} characters` : 'Upload a document or paste at least 10 characters to begin.'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setPdfFileName(null);
                    setPdfError(null);
                    setIsPasteOpen(false);
                  }}
                  disabled={!appState.inputText}
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-sky-50/70">
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
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
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
          </div>

          <section className="lg:hidden" aria-live="polite">
            {renderAnalysisPanel()}
          </section>

          <details className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  Optional: Tell us your current situation for a more accurate review
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Not sure? That's okay. You can skip this for now.</span>
              </span>
              <span className="mt-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition group-open:bg-slate-100">
                <span className="group-open:hidden">Show</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </summary>
            <div className="mt-4 flex flex-wrap gap-2">
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
          </details>

          <details className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-slate-950">What would you like help with?</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Optional. VisaTodo can still review your document if you skip this.</span>
              </span>
              <span className="mt-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition group-open:bg-slate-100">
                <span className="group-open:hidden">Show</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </summary>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {helpOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIntent(option.value)}
                  className={`rounded-2xl border px-3 py-3 text-left text-xs font-semibold transition ${
                    appState.intent === option.value
                      ? 'border-sky-700 bg-sky-50 text-sky-800 ring-2 ring-sky-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </details>

          <details id="sample-documents" className="group scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold text-slate-950">Don't have a document yet? Try a sample</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Use fictional text to see how the review works.</span>
              </span>
              <span className="mt-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 transition group-open:bg-slate-100">
                <span className="group-open:hidden">Show</span>
                <span className="hidden group-open:inline">Hide</span>
              </span>
            </summary>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
                    setIsPasteOpen(true);
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50"
                >
                  <span className="block text-sm font-semibold text-slate-950">{sample.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{sample.description}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Sample text is fictional and for product demonstration only.
            </p>
          </details>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
              <p className="text-xs leading-5 text-slate-500">
                Beta feedback is welcome, especially if a result feels confusing or too confident.
              </p>
            </div>
            <a
              href="mailto:hello@visatodo.com?subject=VisaTodo%20beta%20feedback"
              className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
            >
              Send feedback
            </a>
          </div>
        </section>

        <section className="hidden lg:sticky lg:top-24 lg:block" aria-live="polite">
          {renderAnalysisPanel()}
        </section>
      </div>
    </div>
  );
};

export default AnalyzerScreen;
