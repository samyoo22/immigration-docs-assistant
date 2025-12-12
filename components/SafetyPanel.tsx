
import React, { useState } from 'react';
import { SafetyTerm, Locale, DsoEmailDraft, AnalysisResult, VisaSituation, TranslatedAnalysis } from '../types';
import { BookOpen, ExternalLink, ShieldCheck, Copy, Mail, ChevronRight, HelpCircle, FileText, Languages } from 'lucide-react';
import { t } from '../utils/i18n';

interface SafetyPanelProps {
  terms: SafetyTerm[]; 
  locale: Locale; 
  dsoEmailDraft?: DsoEmailDraft; 
  dsoQuestions?: string[];
  result?: AnalysisResult; 
  situation?: VisaSituation;
  onCopy: (text: string, successMessage?: string) => void;
  translationResult: TranslatedAnalysis | null;
  isTranslating: boolean;
}

const SafetyPanel: React.FC<SafetyPanelProps> = ({ terms, locale, dsoEmailDraft, dsoQuestions, result, situation, onCopy, translationResult }) => {
  const [showEmailDraft, setShowEmailDraft] = useState(false);

  const officialLinks = [
    { name: 'USCIS Official Site', url: 'https://www.uscis.gov' },
    { name: 'DHS Study in the States', url: 'https://studyinthestates.dhs.gov/students' },
    { name: 'USCIS Case Status', url: 'https://egov.uscis.gov/casestatus/landing.do' },
  ];

  const handleCopyNotes = () => {
    let textToCopy = "[KEY TERMS]\n";
    terms.forEach(term => {
      textToCopy += `${term.term}: ${term.definition}\n`;
    });
    
    if (dsoQuestions && dsoQuestions.length > 0) {
      textToCopy += "\n[QUESTIONS TO ASK YOUR DSO]\n";
      dsoQuestions.forEach(q => textToCopy += `- ${q}\n`);
    }

    textToCopy += "\n[OFFICIAL RESOURCES]\n";
    officialLinks.forEach(link => {
       textToCopy += `${link.name}: ${link.url}\n`;
    });

    onCopy(textToCopy);
  };

  const handleCopyEmail = () => {
    if (!dsoEmailDraft) return;
    const textToCopy = `Subject: ${dsoEmailDraft.subject}\n\n${dsoEmailDraft.body}`;
    onCopy(textToCopy, t(locale, 'workspace.toast.successEmail'));
  };

  const handleCopyDsoSummary = () => {
    if (!result || !situation) return;

    let summaryText = `Summary of your email as I understood it:\n\n`;
    summaryText += `Topic: ${result.topicLabel || 'Immigration Document'}\n`;
    summaryText += `My current situation: ${situation}\n`;
    summaryText += `Risk Assessment: ${result.riskAssessment?.riskLevel || 'N/A'} · Urgency: ${result.riskAssessment?.urgencyLabel || 'N/A'}\n\n`;
    
    summaryText += `Main Points:\n`;
    result.summary.forEach(point => {
        summaryText += `- ${point}\n`;
    });

    const dsoActions = result.checklist.filter(
        item => item.actor?.toLowerCase().includes('school') || item.actor?.toLowerCase().includes('dso')
    );

    if (dsoActions.length > 0) {
        summaryText += `\nAction items for School/DSO:\n`;
        dsoActions.slice(0, 3).forEach(item => {
            summaryText += `- ${item.title}: ${item.description}\n`;
        });
    }

    onCopy(summaryText, "DSO summary copied – please review and edit before sending.");
  };

  const getTranslatedTerm = (term: string) => {
    if (!translationResult?.keyTerms) return null;
    return translationResult.keyTerms.find(t => t.term === term)?.explanation;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header Copy Button */}
      <div className="flex justify-end mb-2">
         <button
            onClick={handleCopyNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all border bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-600"
          >
            <Copy className="w-3 h-3" />
            {t(locale, 'results.copyNotes')}
          </button>
      </div>

      {/* DSO Questions Section */}
      {dsoQuestions && dsoQuestions.length > 0 && (
         <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-4">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2 mb-3">
               <HelpCircle className="w-4 h-4 text-indigo-400" />
               {t(locale, 'results.dsoQuestionsTitle')}
            </h3>
            <ul className="space-y-3">
               {dsoQuestions.map((question, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                     <span className="flex-shrink-0 w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></span>
                     <span className="text-sm text-slate-300 leading-relaxed">
                        {question}
                     </span>
                  </li>
               ))}
            </ul>
             <div className="mt-4 text-[10px] text-slate-500 leading-relaxed bg-slate-950/50 p-2 rounded border border-slate-800">
               {t(locale, 'results.dsoQuestionsNote')}
            </div>
         </div>
      )}

      {/* Official Links Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-4">
        <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {t(locale, 'results.officialResourcesTitle')}
        </h3>
        <ul className="space-y-2">
          {officialLinks.map((link, idx) => (
            <li key={idx}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group p-2.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:border-emerald-500/30 hover:bg-emerald-950/10 transition-all"
              >
                <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-300">
                  {link.name}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-[10px] text-slate-500 leading-relaxed">
          {t(locale, 'results.officialResourcesNote')}
        </div>
      </div>

      {/* DSO Email Generator Section */}
      {dsoEmailDraft && (
        <div className="rounded-xl border border-blue-900/30 bg-blue-950/10 px-4 py-4">
          <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-blue-400" />
            {t(locale, 'results.dsoEmail.title')}
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {t(locale, 'results.dsoEmail.desc')}
          </p>

          {!showEmailDraft ? (
            <div className="space-y-3">
                <button
                onClick={() => setShowEmailDraft(true)}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 text-sm"
                >
                    {t(locale, 'results.dsoEmail.btnGenerate')}
                    <ChevronRight className="w-4 h-4" />
                </button>
                
                <button
                    onClick={handleCopyDsoSummary}
                    className="w-full py-2.5 bg-transparent border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
                >
                    <FileText className="w-3.5 h-3.5" />
                    Copy summary for my DSO
                </button>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg border border-blue-900/30 overflow-hidden">
              <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Draft Preview</span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all text-blue-300 bg-blue-950 hover:bg-blue-900"
                >
                  <Copy className="w-3 h-3" />
                  {t(locale, 'results.dsoEmail.btnCopy')}
                </button>
              </div>
              <div className="p-4 space-y-3">
                 <div>
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Subject</span>
                    <div className="text-sm font-medium text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 select-all">
                      {dsoEmailDraft.subject}
                    </div>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Body</span>
                    <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed p-2 select-all font-mono text-xs">
                      {dsoEmailDraft.body}
                    </div>
                 </div>
                 {translationResult?.dsoEmailNote && (
                   <div className="mt-2 bg-amber-950/20 p-3 rounded border border-amber-900/30">
                      <div className="flex items-center gap-1.5 mb-1 text-amber-500 font-bold text-[10px]">
                         <Languages className="w-3 h-3" />
                         <span>Note in {translationResult.language === 'ko' ? 'Korean' : translationResult.language}</span>
                      </div>
                      <p className="text-xs text-amber-200/80 leading-relaxed">
                        {translationResult.dsoEmailNote}
                      </p>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Glossary Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800">
           <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            {t(locale, 'results.keyTermsTitle')}
          </h3>
        </div>
        <div className="p-0">
          {terms.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {terms.map((term, idx) => {
                const translatedExplanation = getTranslatedTerm(term.term);
                return (
                <div key={idx} className="p-4 hover:bg-slate-800/50 transition-colors">
                  <dt className="text-sm font-bold text-slate-200 mb-1">{term.term}</dt>
                  <dd className="text-xs text-slate-400 leading-relaxed">{term.definition}</dd>
                  {translatedExplanation && (
                     <dd className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800/50 flex gap-2">
                        <Languages className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
                        <span>{translatedExplanation}</span>
                     </dd>
                  )}
                </div>
              )})}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-600 text-xs">
              {t(locale, 'results.termPlaceholder')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyPanel;
