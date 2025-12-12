
import React, { useState, useRef } from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Loader2, Shield, Trash2, UploadCloud, FileText, ChevronDown, AlertCircle } from 'lucide-react';
import { t } from '../utils/i18n';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';

interface InputSectionProps {
  situation: VisaSituation;
  setSituation: (s: VisaSituation) => void;
  inputText: string;
  setInputText: (t: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  locale: Locale;
}

const InputSection: React.FC<InputSectionProps> = ({
  situation,
  setSituation,
  inputText,
  setInputText,
  onAnalyze,
  isAnalyzing,
  locale,
}) => {
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const handlePdfUploadClick = () => {
    setPdfError(null);
    pdfInputRef.current?.click();
  };

  const handleClearPdfMeta = () => {
    setPdfFileName(null);
    setPdfError(null);
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
          
        fullText += pageText + "\n\n";
      }
      
      return fullText.trim();
    } catch (error) {
      console.error("PDF Parsing error:", error);
      throw new Error("Failed to parse PDF structure.");
    }
  };

  const handlePdfFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setPdfError("Please upload a valid PDF file.");
      setPdfFileName(null);
      if (event.target) event.target.value = "";
      return;
    }

    setIsParsingPdf(true);
    setPdfError(null);
    setPdfFileName(null);

    try {
      const text = await extractTextFromPdf(file);
      
      if (!text || text.trim().length === 0) {
        setPdfError("We couldn't find selectable text in this PDF. It might be a scanned image. Please copy and paste the text manually.");
        setPdfFileName(null);
      } else {
        const newText = inputText.trim().length > 0 
          ? `${inputText}\n\n--- PDF Content (${file.name}) ---\n\n${text}`
          : text;
          
        setInputText(newText);
        setPdfFileName(file.name);
      }
    } catch (err) {
      console.error(err);
      setPdfError("Something went wrong while reading the PDF. Please try another file or paste the text manually.");
      setPdfFileName(null);
    } finally {
      setIsParsingPdf(false);
      if (event.target) event.target.value = "";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-5 sm:px-5 sm:py-6 flex flex-col h-full space-y-4">
      
      {/* 3.1 Situation Section */}
      <div>
        <label className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.2em] block">
          {t(locale, 'workspace.situationTitle')}
        </label>
        
        <div className="mt-2 inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-100 border border-slate-700">
           Current: {situation}
        </div>
        
        <div className="relative mt-3">
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value as VisaSituation)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 hover:border-slate-600 transition-colors cursor-pointer"
            >
              {Object.values(VisaSituation).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* 3.2 Document Source */}
      <div>
        <label className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.2em] block">
          Document source
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-2 justify-between">
           <div className="flex items-center gap-2">
              <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfFileChange}
              />
              <button
                  type="button"
                  onClick={handlePdfUploadClick}
                  disabled={isParsingPdf || isAnalyzing}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-sky-400 hover:text-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isParsingPdf ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                  Upload PDF (beta)
              </button>
           </div>
           <span className="text-[11px] text-slate-500">
              Or paste the text below.
           </span>
        </div>
        
        {/* PDF Status Row */}
        {pdfFileName && (
            <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 border border-slate-700 px-2 py-1 text-[10px] text-sky-300">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[150px]">{pdfFileName}</span>
                </span>
                <button
                    type="button"
                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                    onClick={handleClearPdfMeta}
                >
                    Remove
                </button>
            </div>
        )}
        
        {/* PDF Error */}
        {pdfError && (
           <div className="mt-2 flex items-start gap-2 text-[10px] text-red-400 bg-red-950/20 p-2 rounded border border-red-900/30">
              <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
              <span>{pdfError}</span>
           </div>
        )}
      </div>

      {/* 3.3 Text Area */}
      <div className="flex-grow flex flex-col">
        <label className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.2em] block">
          {t(locale, 'workspace.inputLabel')}
        </label>
        
        <div className="relative mt-2 flex-grow">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t(locale, 'workspace.placeholder')}
            className="w-full h-full min-h-[320px] sm:min-h-[420px] p-4 rounded-2xl border border-slate-700/80 bg-slate-950/80 text-xs sm:text-sm text-slate-100 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 resize-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent placeholder:text-slate-600 transition-colors"
          />
           {isParsingPdf && (
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
               <div className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                  <span className="text-xs font-medium text-slate-300">Extracting text...</span>
               </div>
             </div>
           )}
        </div>

        {/* 3.4 Privacy + Meta */}
        <div className="mt-2 space-y-2">
             <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-relaxed">
                 <Shield className="w-3 h-3 shrink-0 mt-0.5" />
                 <p>
                   Avoid entering passport numbers, SSNs, or other highly sensitive IDs.
                   PDF uploads are processed locally.
                 </p>
             </div>
             
             <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>
                   {inputText.length > 0 ? `${inputText.length} chars` : ''}
                </span>
                <button
                    onClick={() => setInputText('')}
                    disabled={inputText.length === 0}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-sky-400 hover:text-sky-200 transition-colors disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:text-slate-300"
                >
                    <Trash2 className="w-3 h-3" />
                    {t(locale, 'workspace.clearText')}
                </button>
             </div>
        </div>

        {/* 3.5 CTA */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || inputText.trim().length < 10}
          className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-all ${
              isAnalyzing || inputText.trim().length < 10
              ? 'bg-slate-700 cursor-not-allowed text-slate-500 shadow-none'
              : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/40'
          }`}
        >
          {isAnalyzing ? (
              <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t(locale, 'workspace.btnAnalyzing')}
              </>
          ) : (
              <>
              {t(locale, 'workspace.btnAnalyze')}
              <ArrowRight className="w-4 h-4" />
              </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
