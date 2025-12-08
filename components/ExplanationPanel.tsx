
import React, { useState } from 'react';
import { AnalysisResult, Locale, RiskLevel } from '../types';
import { MessageSquare, Sparkles, Copy, Check, AlertTriangle, Info, Languages } from 'lucide-react';
import { t } from '../utils/i18n';

interface ExplanationPanelProps {
  result: AnalysisResult;
  locale: Locale;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ result, locale }) => {
  const [copied, setCopied] = useState(false);
  const [langMode, setLangMode] = useState<'en' | 'en_ko'>('en');

  const handleCopy = () => {
    let textToCopy = "";
    
    if (result.riskAssessment) {
      textToCopy += `[RISK ASSESSMENT]\nLevel: ${result.riskAssessment.riskLevel}\nUrgency: ${result.riskAssessment.urgencyLabel}\nSummary: ${result.riskAssessment.summary}\n\n`;
    }

    textToCopy += `[SUMMARY]\n${result.summary.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n`;
    
    if (langMode === 'en_ko' && result.koreanSummary) {
       textToCopy += `[KOREAN SUMMARY]\n${result.koreanSummary.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n`;
    }

    textToCopy += `[DETAILED EXPLANATION]\n${result.detailedExplanation}\n\n`;
    
    if (result.simpleEnglishNotes) {
      textToCopy += `[SIMPLE ENGLISH]\n${result.simpleEnglishNotes}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'High': return <AlertTriangle className="w-5 h-5" />;
      case 'Medium': return <Info className="w-5 h-5" />;
      case 'Low': return <Check className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative pt-10">
      
      {/* Header Controls */}
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between">
         {/* Language Toggle */}
         <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setLangMode('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                langMode === 'en' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t(locale, 'results.langToggle.enOnly')}
            </button>
            <button 
              onClick={() => setLangMode('en_ko')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                langMode === 'en_ko' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t(locale, 'results.langToggle.enKo')}
            </button>
         </div>

         {/* Copy Button */}
         <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm border ${
              copied 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t(locale, 'results.copied') : t(locale, 'results.copyBtn')}
          </button>
      </div>

      {/* Risk & Urgency Card */}
      {result.riskAssessment && (
        <div className={`p-5 rounded-xl border ${getRiskColor(result.riskAssessment.riskLevel)}`}>
           <div className="flex items-start gap-3">
              <div className="mt-0.5">{getRiskIcon(result.riskAssessment.riskLevel)}</div>
              <div>
                 <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {t(locale, 'results.riskTitle')}
                    </span>
                    <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-bold border border-black/5">
                       {result.riskAssessment.riskLevel}
                    </span>
                    <span className="text-sm font-semibold">
                       • {result.riskAssessment.urgencyLabel}
                    </span>
                 </div>
                 <p className="text-sm leading-relaxed font-medium opacity-90 mb-2">
                   {result.riskAssessment.summary}
                 </p>
                 <p className="text-[10px] opacity-60 uppercase tracking-wide">
                   {t(locale, 'results.riskDisclaimer')}
                 </p>
              </div>
           </div>
        </div>
      )}

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

      {/* Korean Summary (Conditional) */}
      {langMode === 'en_ko' && result.koreanSummary && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 animate-fade-in">
           <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-4">
            <Languages className="w-5 h-5 text-blue-600" />
            {t(locale, 'results.koreanSummaryTitle')}
          </h3>
           <ul className="space-y-3">
            {result.koreanSummary.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-blue-800 leading-relaxed">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Explanation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            {t(locale, 'results.detailedTitle')}
          </h3>
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
