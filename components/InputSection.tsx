import React from 'react';
import { VisaSituation } from '../types';
import { ArrowRight, FileText, Loader2, ShieldAlert, Edit3 } from 'lucide-react';

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
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
          Situation Context
        </label>
        <select
          value={situation}
          onChange={(e) => setSituation(e.target.value as VisaSituation)}
          className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm"
        >
          {Object.values(VisaSituation).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow flex flex-col mb-6">
         <div className="flex items-center justify-between mb-2">
           <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
             Document Text
           </label>
           {inputText.length > 0 && (
             <span className="text-xs text-slate-400 flex items-center gap-1">
               <Edit3 className="w-3 h-3" /> Editable
             </span>
           )}
         </div>
        
        <div className="relative flex-grow">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your English email or instructions here..."
            className="w-full h-80 md:h-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 leading-relaxed font-mono text-sm"
          />
          {inputText.length === 0 && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-center w-full px-4">
               <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
               <p className="text-xs">
                 Privacy Note: Do not paste full SSNs, Passport Numbers, or SEVIS IDs.
               </p>
             </div>
          )}
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || inputText.trim().length < 10}
        className={`w-full py-4 px-6 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
          isAnalyzing || inputText.trim().length < 10
            ? 'bg-slate-300 cursor-not-allowed shadow-none'
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
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
