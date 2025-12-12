
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
        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">{t(locale, 'workspace.analyzing')}</h3>
          <p className="max-w-xs mx-auto text-sm">{t(locale, 'workspace.analyzingDesc')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
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
          <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
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
           <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
             <ListChecks className="w-10 h-10 text-slate-200 mb-3" />
             <p className="text-sm">{t(locale, 'workspace.emptyChecklist')}</p>
          </div>
        );
      }
      if (activeTab === 'safety') {
        return (
           <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
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
    <div className="animate-fade-in pb-10 relative">
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

      {/* Header Row: Back Button */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(locale, 'workspace.backButton')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input (Sticky on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
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

        {/* Right Column: Output (Tabs) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative">
              
              {/* Translation Controls (Absolute Position or Above Tabs) */}
              {/* Placing it above the tabs for better visibility and access across all tabs */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Translation Mode</span>
                 </div>
                 
                 <div className="flex items-center gap-2 w-full sm:w-auto">
                   <div className="relative w-full sm:w-auto">
                     <select
                       value={translationLanguage}
                       onChange={(e) => onTranslate(e.target.value as TranslationLanguageCode)}
                       className="w-full sm:w-48 appearance-none bg-white border border-slate-300 hover:border-blue-400 text-slate-700 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer font-medium"
                       disabled={isAnalyzing || !result}
                     >
                       <option value="none">English only</option>
                       {SUPPORTED_TRANSLATION_LANGUAGES.map((lang) => (
                         <option key={lang.code} value={lang.code}>{lang.label}</option>
                       ))}
                     </select>
                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                   </div>
                 </div>
              </div>
              
              {/* Helper Text for Translation */}
              <div className="bg-blue-50/50 px-4 py-2 border-b border-blue-100/50">
                <p className="text-[10px] text-center text-slate-500">
                  Translations are for convenience only. Always rely on the English version and official sources.
                </p>
              </div>

              {/* Tab Header */}
              <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('explain')}
                  className={`flex-1 min-w-[100px] py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'explain'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t(locale, 'workspace.tabExplain')}
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`flex-1 min-w-[100px] py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'checklist'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                   {t(locale, 'workspace.tabChecklist')}
                  {appState.checklistState.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {appState.checklistState.filter(i => i.status !== 'done').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`flex-1 min-w-[100px] py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap px-4 ${
                    activeTab === 'safety'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                   {t(locale, 'workspace.tabSafety')}
                </button>
              </div>

              {/* Tab Content Area */}
              <div className="p-6 md:p-8 flex-grow relative">
                 {/* Overlay loading state for translation */}
                 {isTranslating && (
                   <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center">
                       <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                       <span className="text-sm font-medium text-slate-700">Translating content...</span>
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
