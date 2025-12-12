
import React, { useState } from 'react';
import { AnalysisResult, Locale, RiskLevel, TranslatedAnalysis, SupportedLanguage } from '../types';
import { MessageSquare, Sparkles, Copy, Check, AlertTriangle, Info, Languages, ChevronDown, ChevronUp, FileText, ArrowRight } from 'lucide-react';
import { t } from '../utils/i18n';

interface ExplanationPanelProps {
  result: AnalysisResult;
  locale: Locale;
  onCopy: (text: string, successMessage?: string) => void;
  onTabChange: (tab: 'explain' | 'checklist' | 'safety') => void;
  translationResult: TranslatedAnalysis | null;
  translationLanguage: SupportedLanguage;
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

  const handleCopySessionSummary = () => {
    let textToCopy = `Session summary\n`;
    if (result.riskAssessment) {
      textToCopy += `Risk: ${result.riskAssessment.riskLevel} · Urgency: ${result.riskAssessment.urgencyLabel}\n`;
      textToCopy += `Overview: ${result.riskAssessment.summary}\n`;
    }
    
    // Top 3 checklist items
    const topActions = result.checklist.slice(0, 3);
    if (topActions.length > 0) {
      textToCopy += `Top actions:\n`;
      topActions.forEach(item => textToCopy += `- ${item.title}\n`);
    }

    onCopy(textToCopy);
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

  const getFirstStepsText = (level: RiskLevel) => {
    switch (level) {
      case 'High': return t(locale, 'results.firstStepsHigh');
      case 'Medium': return t(locale, 'results.firstStepsMedium');
      case 'Low': return t(locale, 'results.firstStepsLow');
      default: return t(locale, 'results.firstStepsLow');
    }
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 mt-8 mb-4">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
        {label}
      </span>
      <div className="h-px bg-slate-100 flex-grow"></div>
    </div>
  );

  const hasTranslation = translationLanguage !== 'none' && translationResult !== null;

  return (
    <div className="space-y-6 animate-fade-in relative pt-14 md:pt-10">
      
      {/* Header Controls */}
      <div className="absolute top-0 right-0 left-0 flex flex-col md:flex-row md:items-center justify-between gap-2">
         {/* Detected Topic */}
         <div className="flex items-center gap-3">
             {result.topicLabel && (
               <div className="inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-medium" title={t(locale, 'results.detectedTopicTooltip')}>
                 <span className="opacity-50 mr-1">{t(locale, 'results.detectedTopic')}</span>
                 <span className="text-slate-800">{result.topicLabel}</span>
               </div>
             )}
         </div>

         {/* Copy Button */}
         <div className="self-end md:self-auto">
            <button
                onClick={handleCopyExplanation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm border bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
                {t(locale, 'results.copyBtn')}
              </button>
         </div>
      </div>

      <SectionHeader label="Overview" />

      {/* Session Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
             <FileText className="w-4 h-4 text-blue-500" />
             {t(locale, 'results.sessionSummaryTitle')}
          </h3>
          <button
             onClick={handleCopySessionSummary}
             className="text-[10px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
             {t(locale, 'results.sessionSummaryCopy')}
          </button>
        </div>
        
        <div className="text-sm text-slate-600 space-y-2">
           <div className="flex items-center gap-2 text-xs">
              <span className={`font-bold px-1.5 py-0.5 rounded ${result.riskAssessment?.riskLevel === 'High' ? 'bg-red-100 text-red-700' : result.riskAssessment?.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                Risk: {result.riskAssessment?.riskLevel}
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-medium text-slate-700">{result.riskAssessment?.urgencyLabel}</span>
           </div>
           
           <p className="leading-snug">
              {result.riskAssessment?.summary}
           </p>

           {result.checklist.length > 0 && (
              <div className="bg-slate-50 rounded p-2 text-xs">
                 <span className="font-semibold text-slate-500 block mb-1 uppercase tracking-wider text-[10px]">Top Actions</span>
                 <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                   {result.checklist.slice(0, 3).map((item, i) => (
                     <li key={i} className="truncate">{item.title}</li>
                   ))}
                 </ul>
              </div>
           )}
        </div>
        <p className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-1">
           {t(locale, 'results.sessionSummaryDisclaimer')}
        </p>
      </div>

      {/* Risk & Urgency Card */}
      {result.riskAssessment && (
        <div className="space-y-2">
          {/* English Risk */}
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
                   <p className="text-sm leading-relaxed font-medium opacity-90 mb-3">
                     {result.riskAssessment.summary}
                   </p>
                   
                   {/* First Steps Section */}
                   <div className="bg-white/40 rounded p-2 mb-2">
                     <span className="text-xs font-bold uppercase tracking-wide block opacity-80 mb-1">
                       {t(locale, 'results.firstSteps')}
                     </span>
                     <p className="text-sm">
                       {getFirstStepsText(result.riskAssessment.riskLevel)}
                     </p>
                   </div>

                   <p className="text-[10px] opacity-60 uppercase tracking-wide">
                     {t(locale, 'results.riskDisclaimer')}
                   </p>
                </div>
             </div>
          </div>
          
          {/* Translated Risk */}
          {hasTranslation && translationResult?.riskCard && (
             <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase">In {translationResult.language === 'ko' ? 'Korean' : translationResult.language}</span>
               </div>
               <div className="flex items-center gap-2 mb-1 text-sm text-slate-800 font-semibold">
                  <span>{translationResult.riskCard.riskLevel}</span>
                  <span className="text-slate-300">•</span>
                  <span>{translationResult.riskCard.urgencyLabel}</span>
               </div>
               <p className="text-sm text-slate-600">
                  {translationResult.riskCard.summary}
               </p>
             </div>
          )}
        </div>
      )}

      {/* Quick Summary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          {t(locale, 'results.summaryTitle')}
        </h3>
        
        <div className="space-y-6">
          {/* English Summary */}
          <div>
            {hasTranslation && <div className="text-xs font-bold text-indigo-200 mb-2 uppercase">English</div>}
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

          {/* Translated Summary */}
          {hasTranslation && translationResult && (
             <div className="pt-4 border-t border-indigo-50">
               <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-400 uppercase">In {translationResult.language === 'ko' ? 'Korean' : translationResult.language}</span>
               </div>
               <ul className="space-y-3">
                {translationResult.summaryBullets.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 leading-relaxed">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-indigo-200 rounded-full mt-2 ml-2"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
             </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
           <button 
             onClick={() => onTabChange('checklist')}
             className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
           >
             View my checklist <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <SectionHeader label="Details" />

      {/* Detailed Explanation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            {t(locale, 'results.detailedTitle')}
          </h3>
        </div>
        
        <div className="relative space-y-6">
           {/* English Detail */}
           <div className={`prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap transition-all duration-300 ${!isDetailedExpanded ? 'max-h-[160px] overflow-hidden' : ''}`}>
            {result.detailedExplanation}
          </div>
          
           {/* Translated Detail */}
           {hasTranslation && translationResult && (
             <div className={`border-t border-slate-100 pt-6 ${!isDetailedExpanded ? 'hidden' : 'block'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase">In {translationResult.language === 'ko' ? 'Korean' : translationResult.language}</span>
               </div>
               <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                 {translationResult.detailedExplanation}
               </div>
             </div>
           )}

          {!isDetailedExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          )}
        </div>
        
        <button 
          onClick={() => setIsDetailedExpanded(!isDetailedExpanded)}
          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {isDetailedExpanded ? (
            <>
              {t(locale, 'results.hideFull')} <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {t(locale, 'results.showFull')} <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

       {/* Simple English Notes */}
       {result.simpleEnglishNotes && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-2">
              {t(locale, 'results.simpleEnglishTitle')}
            </h3>
            <p className="text-indigo-900 font-medium leading-relaxed">
              {result.simpleEnglishNotes}
            </p>
          </div>
          
          {/* Translated Simple English */}
          {hasTranslation && translationResult?.simpleEnglishNote && (
            <div className="pt-4 border-t border-indigo-200/50">
               <p className="text-indigo-800/80 font-medium leading-relaxed">
                  {translationResult.simpleEnglishNote}
               </p>
            </div>
          )}
        </div>
      )}

      {/* Footer Jump Button */}
      <div className="pt-2 pb-2 flex justify-center">
        <button 
            onClick={() => onTabChange('safety')}
            className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            See safety tips & official links <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ExplanationPanel;
