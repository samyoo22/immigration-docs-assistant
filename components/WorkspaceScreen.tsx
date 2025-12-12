
import React, { useState, useEffect } from 'react';
import { VisaSituation, ChecklistItem, AppState, Locale, TranslationLanguageCode, SUPPORTED_TRANSLATION_LANGUAGES } from '../types';
import InputSection from './InputSection';
import ExplanationPanel from './ExplanationPanel';
import ChecklistPanel from './ChecklistPanel';
import SafetyPanel from './SafetyPanel';
import QAPanel from './QAPanel';
import { ArrowLeft, FileText, ListChecks, ShieldCheck, Loader2, AlertCircle, CheckCircle, XCircle, Globe, ChevronDown } from 'lucide-react';
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

  const handleTabChange = (tab: 'explain' | 'checklist' | 'safety') => {
    setActiveTab(tab);
  };

  // Helper to render content based on current tab and result state
  const renderTabContent = () => {
    if (isAnalyzing) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">{t(locale, 'workspace.analyzing')}</h3>
          <p className="max-w-xs mx-auto text-sm">{t(locale, 'workspace.analyzingDesc')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
           <div className="bg-red-50 p-4 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
           </div>
           <h3 className="text-lg font-semibold text-slate-800 mb-2">{t(locale, 'common.errorTitle')}</h3>
           <p className="max-w-xs mx-auto text-sm text-slate-600">{t(locale, 'common.retry')}</p>
           <p className="mt-4 text-xs text-red-400 font-mono bg-red-50 p-2 rounded max-w-sm truncate">
             {error}
           </p>
        </div>
      );
    }

    if (!result) {
      // Empty States
      if (activeTab === 'explain') {
        return (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
             <div className="bg-slate-50 p-4 rounded-full mb-4">
                <FileText className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-semibold text-slate-600 mb-2">{t(locale, 'workspace.emptyStateTitle')}</h3>
             <p className="max-w-xs mx-auto text-sm">{t(locale, 'workspace.emptyStateDesc')}</p>
          </div>
        );
      }
      if (activeTab === 'checklist') {
        return (
           <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
             <ListChecks className="w-10 h-10 text-slate-200 mb-3" />
             <p className="text-sm">{t(locale, 'workspace.emptyChecklist')}</p>
          </div>
        );
      }
      if (activeTab === 'safety') {
        return (
           <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 min-h-[400px]">
             <ShieldCheck className="w-10 h-10 text-slate-200 mb-3" />
             <p className="text-sm">{t(locale, 'workspace.emptySafety')}</p>
          </div>
        );
      }
    }

    // Result States
    switch (activeTab) {
      case 'explain':
        return <ExplanationPanel 
                  result={result} 
                  locale={locale} 
                  onCopy={handleCopy}
                  onTabChange={handleTabChange}
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
                  result={result} // Pass full result for DSO summary
                  situation={appState.situation} // Pass situation for DSO summary
                  locale={locale} 
                  onCopy={handleCopy}
                  translationResult={translationResult}
                  isTranslating={isTranslating}
               />;
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
           <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
             toast.type === 'success' 
               ? 'bg-slate-800 text-white border-slate-700' 
               : 'bg-red-50 text-red-800 border-red-200'
           }`}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
           </div>
        </div>
      )}

      {/* Back Button Row */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(locale, 'workspace.backButton')}
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column: Context & Input */}
        {/* Fixed width on desktop, full width on mobile/tablet */}
        <div className="w-full lg:w-[360px] xl:w-[380px] lg:shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
               {t(locale, 'workspace.step2Header')}
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
               {t(locale, 'workspace.step2Subtitle')}
            </h2>
          </div>

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

        {/* Right Column: Output (Results Card) */}
        {/* Flexible width on desktop */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px] relative">
              
              {/* 1. Translation Mode Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <Globe className="w-4 h-4 text-slate-500" />
                       <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Translation Mode</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                       Translations are for convenience only. Always rely on the English version and official sources.
                    </p>
                 </div>
                 
                 <div className="shrink-0 w-full sm:w-auto">
                    <div className="relative">
                       <select
                         value={translationLanguage}
                         onChange={(e) => onTranslate(e.target.value as TranslationLanguageCode)}
                         className="w-full sm:w-48 appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                         disabled={isAnalyzing || !result}
                       >
                         <option value="none">English only</option>
                         {SUPPORTED_TRANSLATION_LANGUAGES.map((lang) => (
                           <option key={lang.code} value={lang.code}>{lang.label}</option>
                         ))}
                       </select>
                       <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* 2. Tabs Row */}
              <div className="flex border-b border-slate-100 bg-white overflow-x-auto no-scrollbar px-6 gap-6">
                {['explain', 'checklist', 'safety'].map(tabKey => (
                   <button
                     key={tabKey}
                     onClick={() => setActiveTab(tabKey as any)}
                     className={`py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                        activeTab === tabKey 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                     }`}
                   >
                      {tabKey === 'explain' && t(locale, 'workspace.tabExplain')}
                      {tabKey === 'checklist' && t(locale, 'workspace.tabChecklist')}
                      {tabKey === 'safety' && t(locale, 'workspace.tabSafety')}
                      
                      {tabKey === 'checklist' && appState.checklistState.length > 0 && (
                         <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'checklist' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {appState.checklistState.filter(i => i.status !== 'done').length}
                         </span>
                      )}
                   </button>
                ))}
              </div>

              {/* 3. Content Area */}
              <div className="p-6 md:p-8 flex-grow relative">
                 {/* Translation Loading Overlay */}
                 {isTranslating && (
                   <div className="absolute inset-0 bg-white/60 z-20 flex items-start justify-center pt-20 backdrop-blur-[1px]">
                     <div className="bg-white p-3 pr-5 rounded-full shadow-lg border border-slate-100 flex items-center gap-3">
                       <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                       <span className="text-sm font-medium text-slate-700">Translating...</span>
                     </div>
                   </div>
                 )}
                 
                 {renderTabContent()}
              </div>
           </div>

           {/* Follow-up Q&A Panel */}
           {result && !isAnalyzing && (
             <QAPanel documentText={appState.inputText} analysisResult={result} />
           )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceScreen;
