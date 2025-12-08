
import React, { useState } from 'react';
import { SafetyTerm, Locale, DsoEmailDraft } from '../types';
import { BookOpen, ExternalLink, ShieldCheck, Copy, Check, Mail, ChevronRight, HelpCircle } from 'lucide-react';
import { t } from '../utils/i18n';

const SafetyPanel: React.FC<{ 
  terms: SafetyTerm[]; 
  locale: Locale; 
  dsoEmailDraft?: DsoEmailDraft; 
  dsoQuestions?: string[];
  onCopy: (text: string, successMessage?: string) => void; 
}> = ({ terms, locale, dsoEmailDraft, dsoQuestions, onCopy }) => {
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

  return (
    <div className="space-y-6 animate-fade-in relative pt-10">
      {/* Header Copy Button */}
      <div className="absolute top-0 right-0">
         <button
            onClick={handleCopyNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm border bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            {t(locale, 'results.copyNotes')}
          </button>
      </div>

      {/* DSO Questions Section (New) */}
      {dsoQuestions && dsoQuestions.length > 0 && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
               <HelpCircle className="w-4 h-4 text-indigo-600" />
               {t(locale, 'results.dsoQuestionsTitle')}
            </h3>
            <ul className="space-y-2.5">
               {dsoQuestions.map((question, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                     <span className="flex-shrink-0 w-1.5 h-1.5 bg-indigo-300 rounded-full mt-2"></span>
                     <span className="text-sm text-slate-700 leading-relaxed font-medium">
                        {question}
                     </span>
                  </li>
               ))}
            </ul>
             <div className="mt-4 text-xs text-slate-400 leading-relaxed bg-slate-50 p-2 rounded">
               {t(locale, 'results.dsoQuestionsNote')}
            </div>
         </div>
      )}

      {/* Official Links Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {t(locale, 'results.officialResourcesTitle')}
        </h3>
        <ul className="space-y-3">
          {officialLinks.map((link, idx) => (
            <li key={idx}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
              >
                <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-800">
                  {link.name}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xs text-slate-500 leading-relaxed">
          {t(locale, 'results.officialResourcesNote')}
        </div>
      </div>

      {/* DSO Email Generator Section */}
      {dsoEmailDraft && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-blue-600" />
            {t(locale, 'results.dsoEmail.title')}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {t(locale, 'results.dsoEmail.desc')}
          </p>

          {!showEmailDraft ? (
            <button
              onClick={() => setShowEmailDraft(true)}
              className="w-full py-3 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {t(locale, 'results.dsoEmail.btnGenerate')}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="bg-white rounded-lg border border-blue-200 shadow-sm animate-fade-in overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Draft Preview</span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <Copy className="w-3 h-3" />
                  {t(locale, 'results.dsoEmail.btnCopy')}
                </button>
              </div>
              <div className="p-4 space-y-3">
                 <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Subject</span>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 select-all">
                      {dsoEmailDraft.subject}
                    </div>
                 </div>
                 <div>
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Body</span>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed p-2 select-all">
                      {dsoEmailDraft.body}
                    </div>
                 </div>
              </div>
              <div className="bg-amber-50 px-4 py-2 border-t border-amber-100">
                <p className="text-[10px] text-amber-700">
                  {t(locale, 'results.dsoEmail.disclaimer')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Glossary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            {t(locale, 'results.keyTermsTitle')}
          </h3>
        </div>
        <div className="p-0">
          {terms.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {terms.map((term, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                  <dt className="text-sm font-bold text-slate-900 mb-1">{term.term}</dt>
                  <dd className="text-sm text-slate-600">{term.definition}</dd>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              {t(locale, 'results.termPlaceholder')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyPanel;
