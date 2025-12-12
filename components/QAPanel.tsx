
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
    const currentMode = mode; 
    setQuestion(''); 

    try {
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
      setHistory(prev => [newEntry, ...prev].slice(0, 3)); 
    } catch (error) {
      console.error(error);
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
    <div className="mt-8">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-indigo-400" />
          Follow-up questions
        </h3>
        <p className="text-[11px] text-slate-500 mt-1">
          Ask short questions about this document or general visa questions.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Toggle Mode */}
        <div className="flex flex-wrap gap-1 bg-slate-900 border border-slate-800 p-1 rounded-full w-fit">
          <button
            onClick={() => setMode('document')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1.5 ${
              mode === 'document' 
                ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <FileText className="w-3 h-3" />
            This document
          </button>
          <button
             onClick={() => setMode('general')}
             className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1.5 ${
               mode === 'general' 
                 ? 'bg-indigo-900/40 text-indigo-200 border border-indigo-500/30 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-300'
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
            className="w-full pl-4 pr-12 py-3 text-sm text-slate-100 placeholder:text-slate-600 bg-slate-950 border border-slate-700 rounded-2xl outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            disabled={isAsking}
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || isAsking}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                   <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wide ml-8 md:ml-0">
                      <FileText className="w-2.5 h-2.5" />
                      This document
                   </span>
                ) : (
                   <span className="inline-flex items-center gap-1 rounded-full bg-indigo-950/30 border border-indigo-900/50 px-2 py-0.5 text-[9px] font-bold text-indigo-300 uppercase tracking-wide ml-8 md:ml-0">
                      <Globe className="w-2.5 h-2.5" />
                      Ask anything
                   </span>
                )}
                
                <div className="flex items-start gap-3 w-full">
                  <div className="bg-slate-800 p-1.5 rounded-full mt-0.5 shrink-0 border border-slate-700">
                     <User className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 pt-0.5 leading-relaxed">{entry.question}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pl-2 w-full">
                 <div className="bg-indigo-900/30 p-1.5 rounded-full mt-0.5 border border-indigo-500/20 shrink-0">
                   <Sparkles className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex-grow w-full">
                   <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QAPanel;
