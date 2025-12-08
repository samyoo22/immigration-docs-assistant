
import React, { useState } from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Loader2, Maximize2, ShieldAlert, Trash2 } from 'lucide-react';
import { t } from '../utils/i18n';
import TextEditorModal from './TextEditorModal';

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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
        
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
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              {t(locale, 'workspace.expand')}
            </button>
          </div>
          
          <div className="relative flex-grow min-h-[250px] mb-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t(locale, 'workspace.placeholder')}
              className="w-full h-full p-4 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 leading-relaxed font-mono text-sm transition-colors shadow-inner"
            />
          </div>

          {/* Footer Row: Helper + Utilities */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t(locale, 'workspace.inputHelper')}</span>
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
