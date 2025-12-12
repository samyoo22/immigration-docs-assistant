
import React, { useState } from 'react';
import { AnalysisResult, Locale, RiskLevel, TranslatedAnalysis, TranslationLanguageCode, SUPPORTED_TRANSLATION_LANGUAGES } from '../types';
import { MessageSquare, Sparkles, Copy, Check, AlertTriangle, Info, Languages, ChevronDown, ChevronUp, FileText, ArrowRight } from 'lucide-react';
import { t } from '../utils/i18n';

interface ExplanationPanelProps {
  result: AnalysisResult;
  locale: Locale;
  onCopy: (text: string, successMessage?: string) => void;
  onTabChange: (tab: 'explain' | 'checklist' | 'safety') => void;
  translationResult: TranslatedAnalysis | null;
  translationLanguage: TranslationLanguageCode;
  isTranslating: boolean;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ 
  result, 
  locale, 
  onCopy, 
  onTabChange,
  translationResult,
  translationLanguage,
}) => {
  const [isDetailedExpanded, setIsDetailedExpanded] = useState(false);

  const handleCopyExplanation = () => {
    let textToCopy = "";
    
    if (result.riskAssessment) {
      textToCopy += `[RISK ASSESSMENT]\nLevel: ${result.riskAssessment.riskLevel}\nUrgency: ${result.riskAssessment.urgencyLabel}\nSummary: ${result.riskAssessment.summary}\n\n`;
    }

    if (translationResult) {
      textToCopy += `[TRANSLATED SUMMARY]\n${translationResult.summaryBullets.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n`;
    }

    textToCopy += `[SUMMARY]\n${result.summary.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n`;

    textToCopy += `[DETAILED EXPLANATION]\n${result.detailedExplanation}\n\n`;
    
    if (result.simpleEnglishNotes) {
      textToCopy += `[SIMPLE ENGLISH]\n${result.simpleEnglishNotes}`;
    }

    onCopy(textToCopy);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-200 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-200 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Medium': return <Info className="w-5 h-5 text-amber-400" />;
      case 'Low': return <Check className="w-5 h-5 text-emerald-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getFirstStepsText = (level: RiskLevel) => {
    switch (level) {
      case 'High': return t(locale, 'results.firstStepsHigh');
      case 'Medium': return t(locale, 'results.firstStepsMedium');
      case 'Low': return t(locale, 'results.firstStepsLow');
      default: return t(locale, 'results.firstStepsLow');
    }
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
         {label}
      </h3>
      <div className="h-px bg-slate-800 flex-grow"></div>
    </div>
  );

  const hasTranslation = translationLanguage !== 'none' && translationResult !== null;
  const translationLabel = SUPPORTED_TRANSLATION_LANGUAGES.find(l => l.code === translationLanguage)?.label || translationLanguage;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-2">
         {/* Detected Topic */}
         <div className="flex items-center gap-2">
             {result.topicLabel && (
               <div className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium" title={t(locale, 'results.detectedTopicTooltip')}>
                 <span className="opacity-50 mr-1">{t(locale, 'results.detectedTopic')}</span>
                 <span className="text-sky-300">{result.topicLabel}</span>
               </div>
             )}
         </div>

         {/* Copy Button */}
         <button
            onClick={handleCopyExplanation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all border bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-600"
          >
            <Copy className="w-3 h-3" />
            {t(locale, 'results.copyBtn')}
          </button>
      </div>

      {/* Risk & Urgency Card */}
      {result.riskAssessment && (
        <div className={`p-4 rounded-xl border ${getRiskColor(result.riskAssessment.riskLevel)} mb-4`}>
             <div className="flex items-start gap-3">
                <div className="mt-0.5">{getRiskIcon(result.riskAssessment.riskLevel)}</div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {t(locale, 'results.riskTitle')}
                      </span>
                      <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-bold">
                         {result.riskAssessment.riskLevel}
                      </span>
                      <span className="text-xs font-semibold opacity-90">
                         • {result.riskAssessment.urgencyLabel}
                      </span>
                   </div>
                   <p className="text-sm leading-relaxed font-medium opacity-90 mb-3">
                     {result.riskAssessment.summary}
                   </p>
                   
                   {/* First Steps Section */}
                   <div className="bg-black/20 rounded p-2.5">
                     <span className="text-[10px] font-bold uppercase tracking-wide block opacity-70 mb-1">
                       {t(locale, 'results.firstSteps')}
                     </span>
                     <p className="text-xs sm:text-sm opacity-90">
                       {getFirstStepsText(result.riskAssessment.riskLevel)}
                     </p>
                   </div>
                </div>
             </div>
        </div>
      )}

      {/* Quick Summary Section */}
      <div className="mb-6">
        <SectionHeader label="Quick Summary" />
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-4 space-y-4">
            {/* English Summary */}
            <ul className="space-y-3">
              {result.summary.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 border border-sky-500/20">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Translated Summary */}
            {hasTranslation && translationResult && (
               <div className="pt-4 border-t border-slate-800">
                 <div className="flex items-center gap-2 mb-3">
                    <Languages className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">In {translationLabel}</span>
                 </div>
                 <ul className="space-y-3">
                  {translationResult.summaryBullets.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-slate-600 rounded-full mt-2 ml-2"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
               </div>
            )}
            
            <div className="pt-2 flex justify-end">
               <button 
                 onClick={() => onTabChange('checklist')}
                 className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
               >
                 View checklist <ArrowRight className="w-3.5 h-3.5" />
               </button>
            </div>
        </div>
      </div>

      {/* Detailed Explanation */}
      <div className="mb-6">
        <SectionHeader label="Detailed Explanation" />
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-4 relative overflow-hidden">
           <div className={`prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap transition-all duration-300 ${!isDetailedExpanded ? 'max-h-[160px] overflow-hidden' : ''}`}>
             {result.detailedExplanation}
           </div>
           
           {/* Translated Detail */}
           {hasTranslation && translationResult && (
             <div className={`border-t border-slate-800 pt-4 mt-4 ${!isDetailedExpanded ? 'hidden' : 'block'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">In {translationLabel}</span>
               </div>
               <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                 {translationResult.detailedExplanation}
               </div>
             </div>
           )}

           {!isDetailedExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
           )}

           <button 
            onClick={() => setIsDetailedExpanded(!isDetailedExpanded)}
            className="mt-3 text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            {isDetailedExpanded ? (
              <>
                {t(locale, 'results.hideFull')} <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                {t(locale, 'results.showFull')} <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simple English Notes */}
       {result.simpleEnglishNotes && (
        <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/30 p-4 space-y-3">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t(locale, 'results.simpleEnglishTitle')}
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
              {result.simpleEnglishNotes}
            </p>
          
          {/* Translated Simple English */}
          {hasTranslation && translationResult?.simpleEnglishNote && (
            <div className="pt-3 border-t border-indigo-900/50">
               <p className="text-indigo-200/70 text-sm leading-relaxed">
                  {translationResult.simpleEnglishNote}
               </p>
            </div>
          )}
        </div>
      )}

      {/* Footer Jump Button */}
      <div className="pt-2 flex justify-center">
        <button 
            onClick={() => onTabChange('safety')}
            className="text-xs font-medium text-slate-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
          >
            See safety tips & official links <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ExplanationPanel;
