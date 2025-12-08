import React from 'react';
import { VisaSituation } from '../types';
import { ArrowRight, FileText, Loader2, ShieldAlert } from 'lucide-react';

interface InputSectionProps {
  situation: VisaSituation;
  setSituation: (s: VisaSituation) => void;
  inputText: string;
  setInputText: (t: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  situation,
  setSituation,
  inputText,
  setInputText,
  onAnalyze,
  isAnalyzing,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          1. Your Situation / 상황 선택
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-3">
          Select your current visa status to get the most relevant advice.
        </p>
        <select
          value={situation}
          onChange={(e) => setSituation(e.target.value as VisaSituation)}
          className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
        >
          {Object.values(VisaSituation).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow flex flex-col mb-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          2. Paste Document Text / 문서 내용 붙여넣기
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-3">
          Paste the email, website text, or instructions you want to understand.
        </p>
        
        <div className="relative flex-grow">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste English text here... (e.g., 'Your OPT application has been received...')"
            className="w-full h-64 md:h-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 leading-relaxed font-mono text-sm"
          />
          {inputText.length === 0 && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-center">
               <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
               <span className="text-xs">
                 Privacy Note: Do not paste full SSNs or Passport Numbers.
               </span>
             </div>
          )}
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || inputText.trim().length < 10}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
          isAnalyzing || inputText.trim().length < 10
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing with Gemini...
          </>
        ) : (
          <>
            Explain & Generate Checklist
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default InputSection;
