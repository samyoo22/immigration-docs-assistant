
import React, { useState } from 'react';
import { AnalysisResult, Locale } from '../types';
import { MessageSquare, Sparkles, Copy, Check } from 'lucide-react';
import { t } from '../utils/i18n';

interface ExplanationPanelProps {
  result: AnalysisResult;
  locale: Locale;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ result, locale }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${result.summary.join('\n')}\n\n${result.detailedExplanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          {t(locale, 'results.summaryTitle')}
        </h3>
        <ul className="space-y-3">
          {result.summary.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {idx + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Explanation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            {t(locale, 'results.detailedTitle')}
          </h3>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t(locale, 'results.copied') : t(locale, 'results.copyBtn')}
          </button>
        </div>
        
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {result.detailedExplanation}
        </div>
      </div>

       {/* Simple English Notes */}
       {result.simpleEnglishNotes && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
          <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-2">
             {t(locale, 'results.simpleEnglishTitle')}
          </h3>
          <p className="text-indigo-900 font-medium leading-relaxed">
            {result.simpleEnglishNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;
