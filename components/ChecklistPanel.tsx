
import React, { useState } from 'react';
import { ChecklistItem, Locale, DueCategory, TranslatedAnalysis } from '../types';
import { CheckCircle2, Circle, Clock, ClipboardList, Copy, Check, CalendarDays, User, Filter, AlertCircle, Globe } from 'lucide-react';
import { t } from '../utils/i18n';

interface ChecklistPanelProps {
  items: ChecklistItem[];
  onToggleStatus: (id: string) => void;
  locale: Locale;
  onCopy: (text: string, successMessage?: string) => void;
  translationResult: TranslatedAnalysis | null;
  isTranslating: boolean;
}

type FilterType = 'all' | 'high' | 'today' | 'week';

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({ items, onToggleStatus, locale, onCopy, translationResult, isTranslating }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  
  const handleCopy = () => {
    // Copy only visible items if filtered? Or all? Usually copy all is safer, but "Copy visible" matches WYSIWYG.
    // Let's copy filtered items to respect the user's view.
    const itemsToCopy = getFilteredItems();
    const textToCopy = itemsToCopy.map(item => 
      `[${item.status.toUpperCase()}] ${item.title} (${item.priority ? item.priority.toUpperCase() + ' PRIORITY' : ''})\n${item.description}\nWho: ${item.actor || 'Student'}\nDue: ${item.dueLabel || 'Unspecified'}\n`
    ).join('\n');
    
    onCopy(textToCopy);
  };

  const getFilteredItems = () => {
    switch (filter) {
      case 'high':
        return items.filter(i => i.priority === 'high');
      case 'today':
        return items.filter(i => i.timeBucket === 'today');
      case 'week':
        return items.filter(i => i.timeBucket === 'this_week');
      default:
        return items;
    }
  };

  const filteredItems = getFilteredItems();

  const getTranslatedItem = (id: string) => {
    if (!translationResult) return null;
    return translationResult.checklistItems.find(t => t.id === id);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
        <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">{t(locale, 'results.noItems')}</p>
      </div>
    );
  }

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-amber-500" />;
      default:
        return <Circle className="w-6 h-6 text-slate-300" />;
    }
  };

  const getStatusClass = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 border-green-200 opacity-75';
      case 'in-progress':
        return 'bg-amber-50 border-amber-200 ring-1 ring-amber-200';
      default:
        return 'bg-white border-slate-200 hover:border-blue-300';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'high') {
      return (
        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> High Priority
        </span>
      );
    }
    if (priority === 'medium') {
      return (
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
          Medium Priority
        </span>
      );
    }
    return null;
  };

  const timelineGroups: Record<DueCategory, ChecklistItem[]> = {
    today: [],
    this_week: [],
    before_program_end: [],
    after_approval: [],
    unspecified: []
  };

  filteredItems.forEach(item => {
    const cat = item.dueCategory || 'unspecified';
    if (timelineGroups[cat]) {
      timelineGroups[cat].push(item);
    } else {
      timelineGroups['unspecified'].push(item);
    }
  });

  const timelineOrder: DueCategory[] = ['today', 'this_week', 'before_program_end', 'after_approval', 'unspecified'];

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            {t(locale, 'results.checklistTitle')}
         </h3>
         
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
           {(['all', 'high', 'today', 'week'] as const).map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                 filter === f 
                   ? 'bg-slate-800 text-white border-slate-800' 
                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
               }`}
             >
               {f === 'all' && 'All'}
               {f === 'high' && 'High priority'}
               {f === 'today' && 'For today'}
               {f === 'week' && 'For this week'}
             </button>
           ))}
         </div>

         <div className="absolute top-0 right-0 -mt-2 hidden sm:block">
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm border bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
                {t(locale, 'results.copyChecklist')}
              </button>
         </div>
      </div>

      {/* Main Checklist View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
               {filteredItems.filter(i => i.status === 'done').length} / {filteredItems.length} Done
            </span>
             {/* Mobile copy button */}
             <button
                onClick={handleCopy}
                className="sm:hidden text-xs font-medium text-slate-500 hover:text-blue-600"
              >
                {t(locale, 'results.copyChecklist')}
              </button>
        </div>
       
        {filteredItems.length === 0 ? (
           <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
             No items match this filter.
           </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const translated = getTranslatedItem(item.id);
              
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleStatus(item.id)}
                  className={`
                    relative p-4 rounded-xl border transition-all cursor-pointer group
                    ${getStatusClass(item.status)}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1 transition-transform group-hover:scale-110">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/60 px-1.5 py-0.5 rounded border border-slate-100">
                          {item.category}
                        </span>
                        {getPriorityBadge(item.priority)}
                        
                        {/* Who/Actor Pill */}
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <User className="w-3 h-3" /> {t(locale, 'results.who')} {item.actor || 'Student'}
                        </span>
                        {item.dueLabel && (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.dueLabel}
                          </span>
                        )}
                      </div>
                      
                      {/* English Title & Description */}
                      <h4 className={`font-semibold text-slate-800 mb-1 ${item.status === 'done' ? 'line-through text-slate-500' : ''}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm text-slate-600 leading-snug ${item.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                        {item.description}
                      </p>

                      {/* Translated Title & Description */}
                      {translated && (
                         <div className={`mt-3 pt-3 border-t border-slate-200/60 ${item.status === 'done' ? 'opacity-50' : ''}`}>
                            <h4 className="text-sm font-semibold text-slate-700 mb-0.5 flex items-center gap-1.5">
                              <Globe className="w-3 h-3 text-slate-400" />
                              {translated.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {translated.description}
                            </p>
                         </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === 'todo' ? 'Click to start' : item.status === 'in-progress' ? 'Click to complete' : 'Click to undo'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline View */}
      <div className="pt-8 border-t border-slate-200">
         <div className="mb-6">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              {t(locale, 'results.timelineTitle')}
           </h3>
           <p className="text-sm text-slate-500 ml-7">
             {filter !== 'all' ? 'Timeline is filtered based on selection.' : t(locale, 'results.timelineSubtitle')}
           </p>
         </div>
         
         <div className="space-y-6 relative border-l-2 border-slate-100 ml-3">
            {timelineOrder.map((key) => {
              const groupItems = timelineGroups[key];
              if (!groupItems || groupItems.length === 0) return null;

              return (
                <div key={key} className="pl-6 relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-200"></div>
                  
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                     {t(locale, `results.timeline.${key}`)}
                  </h4>

                  <div className="space-y-2">
                    {groupItems.map(item => {
                       const translated = getTranslatedItem(item.id);

                       return (
                       <div 
                        key={`tl-${item.id}`} 
                        className="bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => onToggleStatus(item.id)}
                       >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(item.status)}
                              <div className="flex flex-col">
                                <span className={`text-sm font-medium ${item.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                  {item.title}
                                </span>
                                {translated && (
                                   <span className={`text-xs text-slate-500 mt-0.5 ${item.status === 'done' ? 'line-through text-slate-300' : ''}`}>
                                     {translated.title}
                                   </span>
                                )}
                                <div className="flex gap-2 mt-1">
                                  {item.actor && (
                                    <span className="text-[10px] text-slate-400">
                                      {t(locale, 'results.who')} {item.actor}
                                    </span>
                                  )}
                                  {item.priority === 'high' && <span className="text-[10px] text-red-500 font-bold">High</span>}
                                </div>
                              </div>
                            </div>
                            {item.dueLabel && (
                              <span className="text-xs text-slate-400 hidden sm:inline-block">
                                {item.dueLabel}
                              </span>
                            )}
                          </div>
                       </div>
                    )})}
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default ChecklistPanel;
