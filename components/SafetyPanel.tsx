import React from 'react';
import { SafetyTerm } from '../types';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface SafetyPanelProps {
  terms: SafetyTerm[];
}

const SafetyPanel: React.FC<SafetyPanelProps> = ({ terms }) => {
  const officialLinks = [
    { name: 'USCIS Official Site', url: 'https://www.uscis.gov' },
    { name: 'DHS Study in the States', url: 'https://studyinthestates.dhs.gov/students' },
    { name: 'USCIS Case Status', url: 'https://egov.uscis.gov/casestatus/landing.do' },
  ];

  return (
    <div className="space-y-6">
      {/* Glossary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Key Terms (용어 설명)
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
              Terms will appear here after analysis.
            </div>
          )}
        </div>
      </div>

      {/* Official Links Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Official Resources
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
          * Always rely on .gov websites or your school's (.edu) official portal for the most accurate information.
        </div>
      </div>
    </div>
  );
};

export default SafetyPanel;
