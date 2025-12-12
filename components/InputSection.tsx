
import React, { useState, useRef } from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Loader2, Maximize2, ShieldAlert, Trash2, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { t } from '../utils/i18n';
import TextEditorModal from './TextEditorModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const handlePdfUploadClick = () => {
    setPdfError(null);
    pdfInputRef.current?.click();
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
      if (event.target) event.target.value = "";
      return;
    }

    setIsParsingPdf(true);
    setPdfError(null);

    try {
      const text = await extractTextFromPdf(file);
      
      if (!text || text.trim().length === 0) {
        setPdfError("We couldn't find selectable text in this PDF. It might be a scanned image. Please copy and paste the text manually.");
      } else {
        // Append to existing text if any, or replace? Appending seems safer for multiple uploads.
        // Adding a separator if text already exists.
        const newText = inputText.trim().length > 0 
          ? `${inputText}\n\n--- PDF Content (${file.name}) ---\n\n${text}`
          : text;
          
        setInputText(newText);
      }
    } catch (err) {
      console.error(err);
      setPdfError("Something went wrong while reading the PDF. Please try another file or paste the text manually.");
    } finally {
      setIsParsingPdf(false);
      // Reset input so the same file can be selected again if needed
      if (event.target) event.target.value = "";
    }
  };

  return (
    <>
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
        <div className="flex-grow flex flex-col mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              {t(locale, 'workspace.inputLabel')}
            </label>
            
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
                className="text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Extract text from a PDF file"
              >
                {isParsingPdf ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                Upload PDF (beta)
              </button>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                {t(locale, 'workspace.expand')}
              </button>
            </div>
          </div>
          
          <div className="relative flex-grow mb-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t(locale, 'workspace.placeholder')}
              className="w-full h-full min-h-[320px] p-4 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-slate-700 leading-relaxed font-mono text-[15px] transition-colors shadow-sm placeholder:text-slate-400"
            />
             {/* Loading Overlay for PDF */}
             {isParsingPdf && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg border border-slate-200 z-10">
                 <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-100 flex items-center gap-3">
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

          {/* Footer Row: Helper + Utilities */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-col gap-1 text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t(locale, 'workspace.inputHelper')}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-0.5">
                 <FileText className="w-3 h-3 opacity-70" />
                 <span className="opacity-80">PDF uploads are processed locally to extract text only.</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
               {inputText.length > 0 && (
                 <span className="text-slate-400 font-mono">
                   {t(locale, 'workspace.charCount', { count: inputText.length })}
                 </span>
               )}
               <button
                onClick={() => setInputText('')}
                disabled={inputText.length === 0}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
               >
                 <Trash2 className="w-3.5 h-3.5" />
                 {t(locale, 'workspace.clearText')}
               </button>
            </div>
          </div>
        </div>

        {/* 3. Action Button Section */}
        <div>
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || inputText.trim().length < 10}
            className={`w-full py-3.5 px-6 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
              isAnalyzing || inputText.trim().length < 10
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t(locale, 'workspace.btnAnalyzing')}
              </>
            ) : (
              <>
                {t(locale, 'workspace.btnAnalyze')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            {t(locale, 'workspace.btnHelper')}
          </p>
        </div>
      </div>

      <TextEditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialText={inputText}
        onSave={(text) => setInputText(text)}
        locale={locale}
      />
    </>
  );
};

export default InputSection;
