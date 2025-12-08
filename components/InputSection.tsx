
import React from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Loader2, ShieldAlert, Edit3 } from 'lucide-react';
import { t } from '../utils/i18n';

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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      
      {/* 1. Situation Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
             {t(locale, 'workspace.situationTitle')}
          </label>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
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
           {inputText.length > 0 && (
             <span className="text-xs text-slate-400 flex items-center gap-1">
               <Edit3 className="w-3 h-3" /> {t(locale, 'workspace.editable')}
             </span>
           )}
         </div>
        
        <div className="relative flex-grow min-h-[250px]">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t(locale, 'workspace.placeholder')}
            className="w-full h-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 leading-relaxed font-mono text-sm"
          />
          {inputText.length === 0 && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-center w-full px-4">
               <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
               <p className="text-xs">
                 {t(locale, 'common.privacyNote')}
               </p>
             </div>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
           {t(locale, 'workspace.inputHelper')}
        </p>
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
              {t(locale, 'workspace.analyzing')}
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
  );
};

export default InputSection;
