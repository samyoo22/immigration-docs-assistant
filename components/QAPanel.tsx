
import React, { useState } from 'react';
import { AnalysisResult, FollowUpQAEntry } from '../types';
import { askFollowUpQuestion } from '../services/geminiService';
import { MessageCircle, Send, Loader2, User, Sparkles, FileText, Globe } from 'lucide-react';

interface QAPanelProps {
  documentText: string;
  analysisResult: AnalysisResult;
}

const QAPanel: React.FC<QAPanelProps> = ({ documentText, analysisResult }) => {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [history, setHistory] = useState<FollowUpQAEntry[]>([]);
  const [mode, setMode] = useState<'document' | 'general'>('document');

  const handleAsk = async () => {
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    const q = question.trim();
    const currentMode = mode; // Capture current mode
    setQuestion(''); // Clear input immediately

    try {
      // Pass null for document/analysis if mode is general (to save context/tokens and follow logic)
      const docText = currentMode === 'document' ? documentText : null;
      const result = currentMode === 'document' ? analysisResult : null;

      const answer = await askFollowUpQuestion(docText, result, q, currentMode);
      
      const newEntry: FollowUpQAEntry = {
        id: Date.now().toString(),
        question: q,
        answer,
        timestamp: Date.now(),
        mode: currentMode,
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 3)); // Keep last 3
    } catch (error) {
      console.error(error);
      // Optional: Handle error UI
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-6 w-full">
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-indigo-500" />
          Follow-up questions
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Ask short questions about this document or ask general questions.
        </p>
      </div>

      <div className="p-6 space-y-4">
        
        {/* Toggle Mode */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-full w-fit">
          <button
            onClick={() => setMode('document')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'document' 
                ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3 h-3" />
            This document
          </button>
          <button
             onClick={() => setMode('general')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
               mode === 'general' 
                 ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                 : 'text-slate-500 hover:text-slate-700'
             }`}
          >
            <Globe className="w-3 h-3" />
            Ask anything
          </button>
        </div>

        {/* Input Area */}
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'document' 
              ? "Example: What happens if I miss this deadline?" 
              : "Example: How does STEM OPT work after regular OPT?"}
            className="w-full p-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            disabled={isAsking}
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || isAsking}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        {/* History */}
        <div className="space-y-6">
          {history.map((entry) => (
            <div key={entry.id} className="animate-fade-in w-full">
              <div className="flex flex-col items-start gap-1 mb-2">
                {/* Context Label */}
                {entry.mode === 'document' ? (
                   <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-8 md:ml-0">
                      <FileText className="w-3 h-3" />
                      This document
                   </span>
                ) : (
                   <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wide ml-8 md:ml-0">
                      <Globe className="w-3 h-3" />
                      Ask anything
                   </span>
                )}
                
                <div className="flex items-start gap-3 w-full">
                  <div className="bg-slate-200 p-1.5 rounded-full mt-0.5 shrink-0">
                     <User className="w-3 h-3 text-slate-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 pt-0.5 leading-relaxed">{entry.question}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pl-2 w-full">
                 <div className="bg-indigo-100 p-1.5 rounded-full mt-0.5 border border-indigo-200 shrink-0">
                   <Sparkles className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex-grow w-full">
                   <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
             <p className="text-[10px] text-slate-400">
             These answers are generated by AI and are not legal advice. Immigration rules change frequently. For questions about your specific case, always confirm with your school’s DSO or an immigration attorney.
             </p>
        </div>
      </div>
    </div>
  );
};

export default QAPanel;
