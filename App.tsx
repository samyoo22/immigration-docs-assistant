
import React, { useEffect, useState } from 'react';
import { VisaSituation, ChecklistItem, AppState, UserIntent, TranslationLanguageCode } from './types';
import { analyzeDocument, translateAnalysis } from './services/aiService';
import { sampleDocuments } from './data/sampleDocuments';
import LandingScreen from './components/LandingScreen';
import AnalyzerScreen from './components/AnalyzerScreen';
import ChecklistRoutes from './components/ChecklistRoutes';
import MyChecklistPage from './components/MyChecklistPage';
import TemplatesPage from './components/TemplatesPage';
import RoadmapsRoutes from './components/RoadmapsRoutes';
import DisclaimerBanner from './components/DisclaimerBanner';
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

const getSituationForPath = (pathname: string): VisaSituation => {
  if (pathname === '/upload' || pathname === '/upload/' || pathname === '/analyze' || pathname === '/analyze/') {
    return VisaSituation.OTHER;
  }
  if (pathname.includes('stem-opt')) return VisaSituation.F1_OPT_ACTIVE;
  if (pathname.includes('h1b')) return VisaSituation.H1B;
  if (pathname.includes('i-765')) return VisaSituation.I765;
  if (pathname.includes('i-539')) return VisaSituation.I539;
  if (pathname.includes('change-of-status')) return VisaSituation.CHANGE_OF_STATUS;
  return VisaSituation.F1_OPT_APPLY;
};

const getViewForPath = (pathname: string): AppState['view'] => {
  if (pathname === '/my-checklist' || pathname === '/my-checklist/') {
    return 'my-checklist';
  }
  if (pathname === '/templates' || pathname === '/templates/') {
    return 'templates';
  }
  if (pathname.startsWith('/roadmaps')) {
    return 'roadmaps';
  }
  if (pathname.startsWith('/checklists')) {
    return 'checklists';
  }
  if (pathname === '/upload' || pathname === '/analyze') {
    return 'analyze';
  }
  return 'landing';
};

function App() {
  const initialView = getViewForPath(window.location.pathname);
  const [state, setState] = useState<AppState>({
    view: initialView,
    intent: UserIntent.EMAIL, // Kept for type safety but unused in UI
    situation: getSituationForPath(window.location.pathname), 
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

  useEffect(() => {
    const handlePopState = () => {
      const nextView = getViewForPath(window.location.pathname);
      setState(prev => ({
        ...prev,
        view: nextView,
        situation: getSituationForPath(window.location.pathname),
        error: null,
        result: nextView === 'analyze' ? prev.result : null,
        checklistState: nextView === 'analyze' ? prev.checklistState : [],
        translationResult: nextView === 'analyze' ? prev.translationResult : null,
        translationLanguage: nextView === 'analyze' ? prev.translationLanguage : 'none',
      }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStartSample = (event?: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    const sample = sampleDocuments[0];
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', '/upload');
    setState(prev => ({
      ...prev,
      view: 'analyze',
      situation: sample.situation,
      intent: sample.helpGoal,
      inputText: sample.text,
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleStartCustom = (event?: React.MouseEvent<HTMLElement>, route = '/upload') => {
    event?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', route);
    setState(prev => ({
      ...prev,
      view: 'analyze',
      situation: getSituationForPath(route),
      intent: UserIntent.EMAIL,
      inputText: '',
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleStartChecklist = (event?: React.MouseEvent<HTMLElement>, route = '/checklists') => {
    event?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', route);
    setState(prev => ({
      ...prev,
      view: 'checklists',
      situation: getSituationForPath(route),
      inputText: '',
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleStartMyChecklist = (event?: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', '/my-checklist');
    setState(prev => ({
      ...prev,
      view: 'my-checklist',
      inputText: '',
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleStartTemplates = (event?: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', '/templates');
    setState(prev => ({
      ...prev,
      view: 'templates',
      inputText: '',
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleStartRoadmaps = (event?: React.MouseEvent<HTMLElement>, route = '/roadmaps') => {
    event?.preventDefault();
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState({}, '', route);
    setState(prev => ({
      ...prev,
      view: 'roadmaps',
      inputText: '',
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
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
      const result = await analyzeDocument(state.situation, state.inputText, state.intent);
      
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
        error: "We couldn't create a document review this time. Please try again or paste a clearer document excerpt.",
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

  const handleSetSituation = (situation: VisaSituation) => {
    setState(prev => ({
      ...prev,
      situation,
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleSetIntent = (intent: UserIntent) => {
    setState(prev => ({
      ...prev,
      intent,
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
  };

  const handleSetInputText = (inputText: string) => {
    setState(prev => ({
      ...prev,
      inputText,
      error: null,
      result: null,
      checklistState: [],
      translationResult: null,
      translationLanguage: 'none',
    }));
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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            aria-label="VisaTodo home"
            className="flex items-center"
            onClick={(event) => {
              event.preventDefault();
              handleBackToStart();
            }}
          >
            <img
              src="/visatodo-logo.png"
              alt="VisaTodo"
              width={180}
              height={135}
              className="block h-12 w-[150px] object-cover object-center md:w-[180px]"
            />
          </a>
          
          <div className="flex items-center gap-4">
            {state.view === 'landing' ? (
              <>
                <a
                  href="#how-it-works"
                  className="hidden text-xs font-bold text-slate-600 transition hover:text-sky-700 md:inline-flex"
                >
                  How it works
                </a>
                <a
                  href="#supported-documents"
                  className="hidden text-xs font-bold text-slate-600 transition hover:text-sky-700 md:inline-flex"
                >
                  Supported documents
                </a>
                <a
                  href="/upload"
                  onClick={(event) => handleStartCustom(event, '/upload')}
                  className="hidden rounded-full bg-sky-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-800 sm:inline-flex"
                >
                  Upload
                </a>
              </>
            ) : (
              <>
                <a
                  href="/templates"
                  onClick={handleStartTemplates}
                  className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 sm:inline-flex"
                >
                  Templates
                </a>
                <a
                  href="/my-checklist"
                  onClick={handleStartMyChecklist}
                  className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 sm:inline-flex"
                >
                  Saved Checklist
                </a>
                <a
                  href="/checklists"
                  onClick={(event) => handleStartChecklist(event, '/checklists')}
                  className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 sm:inline-flex"
                >
                  Checklists
                </a>
                <a
                  href="/roadmaps"
                  onClick={(event) => handleStartRoadmaps(event, '/roadmaps')}
                  className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 sm:inline-flex"
                >
                  Roadmaps
                </a>
                <a
                  href="/upload"
                  onClick={(event) => handleStartCustom(event, '/upload')}
                  className="hidden rounded-full bg-sky-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-800 sm:inline-flex"
                >
                  Upload
                </a>
              </>
            )}
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
            onUploadDocument={(event) => handleStartCustom(event, '/upload')}
          />
        ) : state.view === 'analyze' ? (
          <AnalyzerScreen
            appState={state}
            setSituation={handleSetSituation}
            setIntent={handleSetIntent}
            setInputText={handleSetInputText}
            setAcceptedDisclaimer={(accepted) => setState(prev => ({ ...prev, hasAcceptedDisclaimer: accepted }))}
            onAnalyze={handleAnalyze}
            onBack={handleBackToStart}
            onCopy={handleCopy}
          />
        ) : state.view === 'checklists' ? (
          <ChecklistRoutes pathname={window.location.pathname} onNavigateHome={handleBackToStart} />
        ) : state.view === 'roadmaps' ? (
          <RoadmapsRoutes
            pathname={window.location.pathname}
            onNavigateHome={handleBackToStart}
            onNavigateRoadmaps={handleStartRoadmaps}
          />
        ) : state.view === 'templates' ? (
          <TemplatesPage onNavigateHome={handleBackToStart} />
        ) : (
          <MyChecklistPage
            onNavigateHome={handleBackToStart}
            onNavigateUpload={(event) => handleStartCustom(event, '/upload')}
            onNavigateChecklists={(event) => handleStartChecklist(event, '/checklists')}
            onNavigateTemplates={handleStartTemplates}
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
