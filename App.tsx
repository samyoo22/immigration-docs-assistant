
import React, { useState } from 'react';
import { VisaSituation, ChecklistItem, AppState, UserIntent, TranslationLanguageCode } from './types';
import { analyzeDocument, translateAnalysis } from './services/aiService';
import { SAMPLE_OPT_EMAIL } from './data/sampleTexts';
import LandingScreen from './components/LandingScreen';
import AnalyzerScreen from './components/AnalyzerScreen';
import DisclaimerBanner from './components/DisclaimerBanner';
import { ListChecks } from 'lucide-react';
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
  const initialView: AppState['view'] = window.location.pathname === '/analyze' ? 'analyze' : 'landing';
  const [state, setState] = useState<AppState>({
    view: initialView,
    intent: UserIntent.EMAIL, // Kept for type safety but unused in UI
    situation: VisaSituation.F1_OPT_APPLY, 
    inputText: '',
    hasAcceptedDisclaimer: false,
    isAnalyzing: false,
    result: null,
    checklistState: [],
    error: null,
    locale: 'en', // Force English UI
    translationLanguage: 'none',
    translationResult: null,
    isTranslating: false,
  });

  const handleStartSample = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', '/analyze');
    setState(prev => ({
      ...prev,
      view: 'analyze',
      inputText: SAMPLE_OPT_EMAIL.trim(),
    }));
  };

  const handleStartCustom = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', '/analyze');
    setState(prev => ({
      ...prev,
      view: 'analyze',
      inputText: '',
    }));
  };

  const handleBackToStart = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', '/');
    setState(prev => ({
      ...prev,
      view: 'landing',
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleAnalyze = async () => {
    if (!state.hasAcceptedDisclaimer) {
      setState(prev => ({
        ...prev,
        error: "Please accept the general-information disclaimer before analyzing your document.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isAnalyzing: true, error: null, translationResult: null, translationLanguage: 'none' }));
    
    try {
      const result = await analyzeDocument(state.situation, state.inputText);
      
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy result:', error);
      setState(prev => ({ ...prev, error: 'Could not copy to clipboard. Please try selecting the text manually.' }));
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

  const handleTranslate = async (lang: TranslationLanguageCode) => {
    if (lang === 'none') {
      setState(prev => ({ ...prev, translationLanguage: 'none', translationResult: null }));
      return;
    }
    
    // If we already have this language translated, just switch
    if (state.translationResult?.language === lang) {
      setState(prev => ({ ...prev, translationLanguage: lang }));
      return;
    }

    if (!state.result) return;

    setState(prev => ({ ...prev, isTranslating: true, translationLanguage: lang }));

    try {
      const translation = await translateAnalysis(state.result, state.checklistState, lang);
      setState(prev => ({
        ...prev,
        isTranslating: false,
        translationResult: translation
      }));
    } catch (error: any) {
      console.error(error);
      setState(prev => ({
        ...prev,
        isTranslating: false,
        translationLanguage: 'none' // Revert on fail
      }));
    }
  };

  return (
    <div className="min-h-screen pb-12 font-sans bg-slate-50 text-slate-950 transition-colors duration-500">
      {/* Global Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleBackToStart}
          >
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition-colors">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-slate-950">
                {t(state.locale, 'common.appName')}
              </h1>
              <p className="text-xs mt-0.5 text-slate-500">
                Plain-English visa document help
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartCustom}
              className="hidden rounded-full bg-sky-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-800 sm:inline-flex"
            >
              Analyze a document
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        
        {/* Error Banner */}
        {state.error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg text-sm flex items-center justify-between">
            <span><strong>Error:</strong> {state.error}</span>
            <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="text-rose-700 underline text-xs hover:text-rose-900">Dismiss</button>
          </div>
        )}

        {/* View Switcher */}
        {state.view === 'landing' ? (
          <LandingScreen 
            onAnalyzeDocument={handleStartCustom}
            onPasteText={handleStartCustom}
          />
        ) : (
          <AnalyzerScreen
            appState={state}
            setSituation={(s) => setState(prev => ({ ...prev, situation: s }))}
            setInputText={(t) => setState(prev => ({ ...prev, inputText: t }))}
            setAcceptedDisclaimer={(accepted) => setState(prev => ({ ...prev, hasAcceptedDisclaimer: accepted }))}
            onAnalyze={handleAnalyze}
            onBack={handleBackToStart}
            onCopy={handleCopy}
          />
        )}

      </main>

      {/* Global Footer & Disclaimer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner locale={state.locale} />
        <div className="text-center py-4 text-xs text-slate-500">
          <p>{t(state.locale, 'common.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
