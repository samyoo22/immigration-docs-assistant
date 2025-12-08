
import React, { useState } from 'react';
import { VisaSituation, ChecklistItem, AppState, UserIntent, Locale } from './types';
import { analyzeDocument } from './services/geminiService';
import { SAMPLE_OPT_EMAIL } from './data/sampleTexts';
import LandingScreen from './components/LandingScreen';
import WorkspaceScreen from './components/WorkspaceScreen';
import DisclaimerBanner from './components/DisclaimerBanner';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Layout } from 'lucide-react';
import { t } from './utils/i18n';

// Helper to hash string for local storage key
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

function App() {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    intent: UserIntent.EMAIL, // Kept for type safety but unused in UI
    situation: VisaSituation.F1_OPT_APPLY, 
    inputText: '',
    isAnalyzing: false,
    result: null,
    checklistState: [],
    error: null,
    locale: 'en',
  });

  const handleStartSample = () => {
    setState(prev => ({
      ...prev,
      view: 'workspace',
      inputText: SAMPLE_OPT_EMAIL.trim(),
    }));
  };

  const handleStartCustom = () => {
    setState(prev => ({
      ...prev,
      view: 'workspace',
      inputText: '',
    }));
  };

  const handleBackToStart = () => {
    setState(prev => ({
      ...prev,
      view: 'landing',
      error: null,
      result: null, 
    }));
  };

  const handleAnalyze = async () => {
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      const result = await analyzeDocument(state.situation, state.inputText, state.locale);
      
      // Load saved status from local storage
      const contentHash = simpleHash(state.inputText + state.situation);
      const storageKey = `checklist_status_${contentHash}`;
      const savedStatusJson = localStorage.getItem(storageKey);
      const savedStatus = savedStatusJson ? JSON.parse(savedStatusJson) : {};

      // Transform raw checklist items into stateful items with IDs and status
      const checklistWithIds: ChecklistItem[] = result.checklist.map((item, index) => {
        // Use title as key for restoring status to survive re-analysis slightly better than index
        const status = savedStatus[item.title] || 'todo';
        return {
          ...item,
          id: `item-${Date.now()}-${index}`,
          status: status,
        };
      });

      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        result: result,
        checklistState: checklistWithIds,
      }));

    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: error.message || "An unexpected error occurred.",
      }));
    }
  };

  const handleUpdateChecklist = (items: ChecklistItem[]) => {
    setState(prev => ({ ...prev, checklistState: items }));
    
    // Save status map to local storage
    if (state.inputText) {
      const contentHash = simpleHash(state.inputText + state.situation);
      const storageKey = `checklist_status_${contentHash}`;
      
      const statusMap: Record<string, string> = {};
      items.forEach(item => {
        statusMap[item.title] = item.status;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(statusMap));
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50 font-sans">
      {/* Global Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={handleBackToStart}
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                {t(state.locale, 'common.appName')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(state.locale, 'common.tagline')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
               {t(state.locale, 'common.poweredBy')}
            </div>
            <LanguageSwitcher 
              currentLocale={state.locale} 
              onLocaleChange={(l) => setState(prev => ({ ...prev, locale: l }))} 
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Banner */}
        {state.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-center justify-between">
            <span><strong>Error:</strong> {state.error}</span>
            <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="text-red-500 underline text-xs">Dismiss</button>
          </div>
        )}

        {/* View Switcher */}
        {state.view === 'landing' ? (
          <LandingScreen 
            situation={state.situation}
            setSituation={(s) => setState(prev => ({ ...prev, situation: s }))}
            onStartSample={handleStartSample}
            onStartCustom={handleStartCustom}
            locale={state.locale}
          />
        ) : (
          <WorkspaceScreen 
            appState={state}
            setSituation={(s) => setState(prev => ({ ...prev, situation: s }))}
            setInputText={(t) => setState(prev => ({ ...prev, inputText: t }))}
            onAnalyze={handleAnalyze}
            onBack={handleBackToStart}
            setChecklistState={handleUpdateChecklist}
          />
        )}

      </main>

      {/* Global Footer & Disclaimer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner locale={state.locale} />
        <div className="text-center py-4 text-slate-400 text-xs">
          <p>{t(state.locale, 'common.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
