
import React, { useState, useRef } from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Loader2, Shield, Trash2, UploadCloud, FileText, AlertCircle } from 'lucide-react';
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
    // Note: We do NOT clear inputText here, to preserve edits.
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
        // Append to existing text if any, or replace? Appending seems safer for multiple uploads.
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
      // Reset input so the same file can be selected again if needed
      if (event.target) event.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 flex flex-col h-full">
      
      {/* 1. Situation Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {t(locale, 'workspace.situationTitle')}
          </label>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 truncate max-w-[150px]">
            {situation}
          </span>
        </div>
        
        <label className="text-sm font-semibold text-slate-700 block mb-2">
          {t(locale, 'workspace.contextLabel')}
        </label>
        <select
          value={situation}
          onChange={(e) => setSituation(e.target.value as VisaSituation)}
          className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm"
        >
          {Object.values(VisaSituation).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Document Text Section */}
      <div className="flex-grow flex flex-col">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            {t(locale, 'workspace.inputLabel')}
          </label>
        </div>
        
        {/* PDF Upload Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
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
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        title="Extract text from a PDF file"
                    >
                        {isParsingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <UploadCloud className="w-3.5 h-3.5 text-blue-600" />}
                        Upload PDF (beta)
                    </button>
                    <span className="text-xs text-slate-500 hidden sm:inline">or paste the text below.</span>
                </div>
            </div>
            
            {/* PDF Status Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                {pdfFileName ? (
                <>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-blue-200 px-2 py-1 text-blue-700 shadow-sm max-w-[200px]">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate font-medium">{pdfFileName}</span>
                    </span>
                    <div className="flex items-center gap-2 ml-1">
                        <button
                            type="button"
                            className="text-slate-500 hover:text-blue-600 font-medium transition-colors"
                            onClick={handlePdfUploadClick}
                        >
                            Change
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                            type="button"
                            className="text-slate-500 hover:text-red-600 font-medium transition-colors"
                            onClick={handleClearPdfMeta}
                        >
                            Remove
                        </button>
                    </div>
                </>
                ) : (
                <span className="text-slate-400 italic">
                    No PDF uploaded yet.
                </span>
                )}
            </div>
        </div>
        
        {/* Text Area */}
        <div className="relative flex-grow mb-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t(locale, 'workspace.placeholder')}
            className="w-full h-full min-h-[320px] p-3 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-slate-700 leading-relaxed font-mono text-sm transition-colors shadow-sm placeholder:text-slate-400"
          />
           {/* Loading Overlay for PDF */}
           {isParsingPdf && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg border border-slate-200 z-10 transition-all">
               <div className="bg-white px-5 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-slate-700">Extracting text from PDF...</span>
               </div>
             </div>
           )}
        </div>

        {/* Error Message for PDF */}
        {pdfError && (
           <div className="mb-3 flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{pdfError}</span>
           </div>
        )}

        {/* Privacy Note */}
        <div className="mb-4">
             <div className="flex items-start gap-1.5 text-[11px] text-slate-400 leading-tight">
                 <Shield className="w-3 h-3 shrink-0 mt-0.5" />
                 <p>
                   Avoid entering passport numbers, SSNs, or other highly sensitive IDs.
                   PDF uploads are processed locally to extract text only. Scanned-image PDFs may not work; if that happens, please paste the text manually.
                 </p>
             </div>
        </div>
        
        {/* Footer Row: Utilities + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-auto">
             <div className="flex items-center gap-4 text-xs">
                {inputText.length > 0 && (
                <span className="text-slate-400 font-mono">
                    {t(locale, 'workspace.charCount', { count: inputText.length })}
                </span>
                )}
                <button
                    onClick={() => setInputText('')}
                    disabled={inputText.length === 0}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t(locale, 'workspace.clearText')}
                </button>
             </div>
             
             <button
                onClick={onAnalyze}
                disabled={isAnalyzing || inputText.trim().length < 10}
                className={`py-2.5 px-5 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAnalyzing || inputText.trim().length < 10
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
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
    </div>
  );
};

export default InputSection;
