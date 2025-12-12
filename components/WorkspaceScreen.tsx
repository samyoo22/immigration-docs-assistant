
import React, { useState, useEffect } from 'react';
import { VisaSituation, ChecklistItem, AppState, TranslationLanguageCode, SUPPORTED_TRANSLATION_LANGUAGES } from '../types';
import InputSection from './InputSection';
import ExplanationPanel from './ExplanationPanel';
import ChecklistPanel from './ChecklistPanel';
import SafetyPanel from './SafetyPanel';
import QAPanel from './QAPanel';
import { ArrowLeft, Loader2, AlertCircle, FileText, ListChecks, ShieldCheck, Globe, ChevronDown } from 'lucide-react';
import { t } from '../utils/i18n';

interface WorkspaceScreenProps {
  appState: AppState;
  setSituation: (s: VisaSituation) => void;
  setInputText: (t: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
  setChecklistState: (items: ChecklistItem[]) => void;
  onTranslate: (lang: TranslationLanguageCode) => void;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({
  appState,
  setSituation,
  setInputText,
  onAnalyze,
  onBack,
  setChecklistState,
  onTranslate,
}) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'checklist' | 'safety'>('explain');
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
  const { locale, result, isAnalyzing, error, translationLanguage, translationResult, isTranslating } = appState;

  // Clear toast after timeout
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
  };

  const handleCopy = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage || t(locale, 'workspace.toast.successGeneric'), 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showToast(t(locale, 'workspace.toast.error'), 'error');
    }
  };

  const handleToggleChecklistStatus = (id: string) => {
    const newChecklist = appState.checklistState.map((item) => {
      if (item.id === id) {
        const nextStatus: ChecklistItem['status'] =
          item.status === 'todo'
            ? 'in-progress'
            : item.status === 'in-progress'
            ? 'done'
            : 'todo';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setChecklistState(newChecklist);
  };

  const renderTabContent = () => {
    if (isAnalyzing) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 min-h-[400px]">
          <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">{t(locale, 'workspace.analyzing')}</h3>
          <p className="max-w-xs mx-auto text-sm text-slate-500">{t(locale, 'workspace.analyzingDesc')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
           <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-400" />
           </div>
           <h3 className="text-lg font-semibold text-slate-200 mb-2">{t(locale, 'common.errorTitle')}</h3>
           <p className="max-w-xs mx-auto text-sm text-slate-400">{t(locale, 'common.retry')}</p>
        </div>
      );
    }

    if (!result) {
      const Icon = activeTab === 'explain' ? FileText : activeTab === 'checklist' ? ListChecks : ShieldCheck;
      const title = activeTab === 'explain' ? t(locale, 'workspace.emptyStateTitle') : '';
      const desc = activeTab === 'explain' ? t(locale, 'workspace.emptyStateDesc') 
                  : activeTab === 'checklist' ? t(locale, 'workspace.emptyChecklist') 
                  : t(locale, 'workspace.emptySafety');

      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 min-h-[400px]">
           <div className="bg-slate-800/50 p-4 rounded-full mb-4">
              <Icon className="w-8 h-8 text-slate-600" />
           </div>
           {title && <h3 className="text-lg font-semibold text-slate-400 mb-2">{title}</h3>}
           <p className="max-w-xs mx-auto text-sm text-slate-500">{desc}</p>
        </div>
      );
    }

    // Result States
    switch (activeTab) {
      case 'explain':
        return <ExplanationPanel 
                  result={result} 
                  locale={locale} 
                  onCopy={handleCopy}
                  onTabChange={setActiveTab}
                  translationResult={translationResult}
                  translationLanguage={translationLanguage}
                  isTranslating={isTranslating}
               />;
      case 'checklist':
        return (
          <ChecklistPanel 
            items={appState.checklistState} 
            onToggleStatus={handleToggleChecklistStatus} 
            locale={locale}
            onCopy={handleCopy}
            translationResult={translationResult}
            isTranslating={isTranslating}
          />
        );
      case 'safety':
        return <SafetyPanel 
                  terms={result.safetyTerms} 
                  dsoEmailDraft={result.dsoEmailDraft} 
                  dsoQuestions={result.dsoQuestions}
                  result={result} 
                  situation={appState.situation} 
                  locale={locale} 
                  onCopy={handleCopy}
                  translationResult={translationResult}
                  isTranslating={isTranslating}
               />;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
           <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md ${
             toast.type === 'success' 
               ? 'bg-slate-800/90 text-white border-slate-700' 
               : 'bg-red-900/90 text-red-100 border-red-800'
           }`}>
              <span className="text-sm font-medium">{toast.message}</span>
           </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <button 
                onClick={onBack}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-sky-300 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                {t(locale, 'workspace.backButton')}
              </button>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-slate-500 font-bold">
                 {t(locale, 'workspace.step2Header')}
              </span>
           </div>
           <h2 className="text-xl sm:text-2xl font-semibold text-slate-50 leading-tight">
             {t(locale, 'workspace.step2Subtitle')}
           </h2>
           <p className="mt-1 text-xs sm:text-sm text-slate-400">
             {t(locale, 'workspace.btnHelper')}
           </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.2fr)] items-start">
        
        {/* Left Column: Context & Input */}
        <div className="flex flex-col gap-4">
          <InputSection
            situation={appState.situation}
            setSituation={setSituation}
            inputText={appState.inputText}
            setInputText={setInputText}
            onAnalyze={onAnalyze}
            isAnalyzing={appState.isAnalyzing}
            locale={locale}
          />
        </div>

        {/* Right Column: Results Card */}
        <div className="flex flex-col gap-6">
           <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-5 sm:px-5 sm:py-6 relative min-h-[600px]">
              
              {/* 1. Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                          Translation Mode
                       </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                       Translations are for convenience only. Always rely on the English version and official sources.
                    </p>
                 </div>
                 
                 <div className="shrink-0 w-full sm:w-auto relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <select
                      value={translationLanguage}
                      onChange={(e) => onTranslate(e.target.value as TranslationLanguageCode)}
                      className="w-full sm:w-auto appearance-none rounded-xl border border-slate-700 bg-slate-950/70 pl-9 pr-8 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500 hover:border-slate-600 transition-colors cursor-pointer"
                      disabled={isAnalyzing || !result}
                    >
                      <option value="none">English only</option>
                      {SUPPORTED_TRANSLATION_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                 </div>
              </div>

              {/* 2. Tabs Row */}
              <div className="inline-flex w-full rounded-full bg-slate-950/80 border border-slate-800 p-1">
                  {['explain', 'checklist', 'safety'].map(tabKey => {
                    const isActive = activeTab === tabKey;
                    return (
                       <button
                         key={tabKey}
                         onClick={() => setActiveTab(tabKey as any)}
                         className={`flex-1 relative h-9 text-[11px] sm:text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 select-none ${
                            isActive
                              ? 'bg-sky-500 text-slate-950 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                         }`}
                       >
                          <span>
                            {tabKey === 'explain' && t(locale, 'workspace.tabExplain')}
                            {tabKey === 'checklist' && t(locale, 'workspace.tabChecklist')}
                            {tabKey === 'safety' && t(locale, 'workspace.tabSafety')}
                          </span>
                          {/* Badge for Checklist */}
                          {tabKey === 'checklist' && appState.checklistState.length > 0 && (
                             <span className={`hidden sm:inline-flex px-1.5 py-0.5 rounded-full text-[9px] leading-none font-bold ${isActive ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                                {appState.checklistState.filter(i => i.status !== 'done').length}
                             </span>
                          )}
                       </button>
                    );
                  })}
              </div>

              {/* 3. Content Area */}
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 sm:px-5 sm:py-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                 <div className="relative">
                   {isTranslating && (
                     <div className="absolute inset-0 z-20 flex items-start justify-center pt-20">
                       <div className="bg-slate-900 p-3 pr-5 rounded-full shadow-lg border border-slate-700 flex items-center gap-3">
                         <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                         <span className="text-xs font-medium text-slate-300">Translating...</span>
                       </div>
                     </div>
                   )}
                   {renderTabContent()}
                 </div>
                 
                 {/* Follow-up Q&A Panel (only in Explain tab and if result exists) */}
                 {result && !isAnalyzing && activeTab === 'explain' && (
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <QAPanel documentText={appState.inputText} analysisResult={result} />
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceScreen;
