import React, { useState } from 'react';
import { VisaSituation, ChecklistItem, AppState } from './types';
import { analyzeDocument } from './services/geminiService';
import InputSection from './components/InputSection';
import ExplanationPanel from './components/ExplanationPanel';
import ChecklistPanel from './components/ChecklistPanel';
import SafetyPanel from './components/SafetyPanel';
import DisclaimerBanner from './components/DisclaimerBanner';
import { Layout } from 'lucide-react';

function App() {
  const [state, setState] = useState<AppState>({
    situation: VisaSituation.F1_PRE_ARRIVAL,
    inputText: '',
    isAnalyzing: false,
    result: null,
    checklistState: [],
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'explain' | 'checklist'>('explain');

  const handleAnalyze = async () => {
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const result = await analyzeDocument(state.situation, state.inputText);
      
      // Transform raw checklist items into stateful items with IDs and status
      const checklistWithIds: ChecklistItem[] = result.checklist.map((item, index) => ({
        ...item,
        id: `item-${Date.now()}-${index}`,
        status: 'todo',
      }));

      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        result: result,
        checklistState: checklistWithIds,
      }));
      
      // Auto-switch to explanation tab on success
      setActiveTab('explain');

    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: error.message || "An unexpected error occurred.",
      }));
    }
  };

  const handleToggleChecklistStatus = (id: string) => {
    setState((prev) => {
      const newChecklist = prev.checklistState.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'todo'
              ? 'in-progress'
              : item.status === 'in-progress'
              ? 'done'
              : 'todo';
          return { ...item, status: nextStatus };
        }
        return item;
      });
      return { ...prev, checklistState: newChecklist };
    });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                Visa Clarity
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                For F-1 Students
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            Powered by Gemini 3 Pro
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <DisclaimerBanner />

        {state.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
            <strong>Error:</strong> {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 xl:col-span-4 h-full">
            <InputSection
              situation={state.situation}
              setSituation={(s) => setState((prev) => ({ ...prev, situation: s }))}
              inputText={state.inputText}
              setInputText={(t) => setState((prev) => ({ ...prev, inputText: t }))}
              onAnalyze={handleAnalyze}
              isAnalyzing={state.isAnalyzing}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            
            {/* Tabs for Mobile/Desktop Switching */}
            {state.result ? (
              <>
                 <div className="flex border-b border-slate-200 bg-white rounded-t-xl overflow-hidden shadow-sm lg:shadow-none lg:bg-transparent lg:border-none lg:rounded-none">
                  <button
                    onClick={() => setActiveTab('explain')}
                    className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'explain'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Explanation
                  </button>
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                      activeTab === 'checklist'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Checklist
                    {state.checklistState.length > 0 && (
                      <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                        {state.checklistState.filter(i => i.status !== 'done').length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Primary Content (Switches based on tab on mobile, or managed via grid on desktop if we wanted split, but here we just use the active tab logic for simplicity across breakpoints or could show side-by-side on very large screens. Let's stick to the Tab paradigm for the main content to keep it clean.) */}
                  
                  {/* Actually, let's show Explanation AND Checklist side-by-side on XL screens if possible? No, user requested "Right column (Results)". Let's stick to stacked or tabbed. The tabs above control what is visible. */}
                  
                  <div className="lg:col-span-2 space-y-6">
                     {activeTab === 'explain' && (
                        <ExplanationPanel result={state.result} />
                     )}
                     
                     {activeTab === 'checklist' && (
                        <ChecklistPanel 
                          items={state.checklistState} 
                          onToggleStatus={handleToggleChecklistStatus} 
                        />
                     )}
                  </div>
                </div>

                {/* Safety Panel is always visible at the bottom of results or side */}
                <div className="border-t border-slate-200 pt-8 mt-4">
                  <SafetyPanel terms={state.result.safetyTerms} />
                </div>
              </>
            ) : (
              // Empty State
              <div className="h-full min-h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Layout className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to help</h3>
                 <p className="max-w-sm mx-auto">
                   Select your situation and paste a document on the left to get a plain-language explanation and checklist.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>© 2024 Visa & Document Clarity Assistant Prototype</p>
      </footer>
    </div>
  );
}

export default App;
