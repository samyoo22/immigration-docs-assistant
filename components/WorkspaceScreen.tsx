
import React, { useState } from 'react';
import { VisaSituation, ChecklistItem, AnalysisResult, AppState, Locale } from '../types';
import InputSection from './InputSection';
import ExplanationPanel from './ExplanationPanel';
import ChecklistPanel from './ChecklistPanel';
import SafetyPanel from './SafetyPanel';
import { ArrowLeft, Target } from 'lucide-react';
import { t } from '../utils/i18n';

interface WorkspaceScreenProps {
  appState: AppState;
  setSituation: (s: VisaSituation) => void;
  setInputText: (t: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
  setChecklistState: (items: ChecklistItem[]) => void;
}

const WorkspaceScreen: React.FC<WorkspaceScreenProps> = ({
  appState,
  setSituation,
  setInputText,
  onAnalyze,
  onBack,
  setChecklistState,
}) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'checklist'>('explain');
  const { locale } = appState;

  const handleToggleChecklistStatus = (id: string) => {
    const newChecklist = appState.checklistState.map((item) => {
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
    setChecklistState(newChecklist);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <button 
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(locale, 'workspace.backButton')}
        </button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-sm text-slate-600 self-start sm:self-auto">
          <Target className="w-4 h-4 text-blue-500" />
          <span>{t(locale, 'workspace.goalLabel')} <span className="font-semibold text-slate-800">{appState.intent}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 xl:col-span-4 h-full">
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

        {/* Right Column: Output */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          {appState.result ? (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 bg-white rounded-t-xl overflow-hidden shadow-sm lg:shadow-none lg:bg-transparent lg:border-none lg:rounded-none">
                <button
                  onClick={() => setActiveTab('explain')}
                  className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'explain'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t(locale, 'workspace.tabExplain')}
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === 'checklist'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                   {t(locale, 'workspace.tabChecklist')}
                  {appState.checklistState.length > 0 && (
                    <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                      {appState.checklistState.filter(i => i.status !== 'done').length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'explain' && (
                  <ExplanationPanel result={appState.result} locale={locale} />
                )}
                
                {activeTab === 'checklist' && (
                  <ChecklistPanel 
                    items={appState.checklistState} 
                    onToggleStatus={handleToggleChecklistStatus} 
                    locale={locale}
                  />
                )}
              </div>

              {/* Safety Panel */}
              <div className="border-t border-slate-200 pt-8 mt-4">
                <SafetyPanel terms={appState.result.safetyTerms} locale={locale} />
              </div>
            </>
          ) : (
            // Empty State (Before Analysis)
             <div className="h-full min-h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-bold">?</div>
                 </div>
                 <h3 className="text-lg font-semibold text-slate-600 mb-2">{t(locale, 'workspace.emptyStateTitle')}</h3>
                 <p className="max-w-sm mx-auto mb-6">
                   {t(locale, 'workspace.emptyStateDesc')}
                 </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceScreen;
