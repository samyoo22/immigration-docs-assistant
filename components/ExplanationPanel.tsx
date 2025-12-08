import React from 'react';
import { AnalysisResult } from '../types';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
  result: AnalysisResult;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Quick Summary (요약)
        </h3>
        <ul className="space-y-3">
          {result.summaryKorean.map((point, idx) => (
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Detailed Explanation (상세 설명)
        </h3>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {result.detailedExplanation}
        </div>
      </div>

       {/* Simple English Notes */}
       {result.simpleEnglishNotes && (
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
          <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-2">
            Simple English Note
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
