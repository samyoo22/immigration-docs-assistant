
import React, { useState } from 'react';
import { SafetyTerm, Locale } from '../types';
import { BookOpen, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { t } from '../utils/i18n';

interface SafetyPanelProps {
  terms: SafetyTerm[];
  locale: Locale;
}

const SafetyPanel: React.FC<SafetyPanelProps> = ({ terms, locale }) => {
  const [copied, setCopied] = useState(false);

  const officialLinks = [
    { name: 'USCIS Official Site', url: 'https://www.uscis.gov' },
    { name: 'DHS Study in the States', url: 'https://studyinthestates.dhs.gov/students' },
    { name: 'USCIS Case Status', url: 'https://egov.uscis.gov/casestatus/landing.do' },
  ];

  const handleCopy = () => {
    let textToCopy = "[KEY TERMS]\n";
    terms.forEach(term => {
      textToCopy += `${term.term}: ${term.definition}\n`;
    });
    textToCopy += "\n[OFFICIAL RESOURCES]\n";
    officialLinks.forEach(link => {
       textToCopy += `${link.name}: ${link.url}\n`;
    });

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header Copy Button */}
      <div className="absolute top-0 right-0 -mt-2">
         <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm border ${
              copied 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t(locale, 'results.copied') : t(locale, 'results.copyNotes')}
          </button>
      </div>

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
    </div>
  );
};

export default SafetyPanel;
