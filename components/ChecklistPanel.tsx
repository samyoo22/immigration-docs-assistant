
import React, { useState } from 'react';
import { ChecklistItem, Locale, DueCategory, TranslatedAnalysis } from '../types';
import { CheckCircle2, Circle, Clock, ClipboardList, Copy, AlertCircle, Globe, User, CalendarDays } from 'lucide-react';
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
      <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/50">
        <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">{t(locale, 'results.noItems')}</p>
      </div>
    );
  }

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <Circle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusClass = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-950/10 border-emerald-900/30 opacity-60';
      case 'in-progress':
        return 'bg-amber-950/10 border-amber-900/30';
      default:
        return 'bg-slate-900/90 border-slate-800 hover:border-slate-600';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'high') {
      return (
        <span className="text-[10px] font-bold text-red-400 bg-red-950/30 px-1.5 py-0.5 rounded border border-red-900/30 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> High
        </span>
      );
    }
    if (priority === 'medium') {
      return (
        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-900/30">
          Medium
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
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
               Action Checklist
            </h3>
         </div>
         
         <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition-all text-[11px] font-medium"
          >
            <Copy className="w-3 h-3" />
            Copy list
          </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
           {(['all', 'high', 'today', 'week'] as const).map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                 filter === f 
                   ? 'bg-sky-500 text-slate-950 border-sky-500' 
                   : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
               }`}
             >
               {f === 'all' && 'All'}
               {f === 'high' && 'High priority'}
               {f === 'today' && 'Today'}
               {f === 'week' && 'This week'}
             </button>
           ))}
      </div>

      {/* 3. Main Checklist Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
           <div className="p-8 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
             No items match this filter.
           </div>
        ) : (
            filteredItems.map((item) => {
              const translated = getTranslatedItem(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleStatus(item.id)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${getStatusClass(item.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-grow min-w-0">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800">
                          {item.category}
                        </span>
                        {getPriorityBadge(item.priority)}
                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                           <User className="w-3 h-3" /> {item.actor || 'Student'}
                        </span>
                        {item.dueLabel && (
                          <span className="text-[10px] font-medium text-sky-400 bg-sky-950/20 px-2 py-0.5 rounded border border-sky-900/30 flex items-center gap-1 truncate">
                            <Clock className="w-3 h-3" /> {item.dueLabel}
                          </span>
                        )}
                      </div>
                      
                      {/* Title & Desc */}
                      <h4 className={`font-semibold text-sm mb-1 leading-snug ${item.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs text-slate-400 leading-relaxed ${item.status === 'done' ? 'line-through text-slate-600' : ''}`}>
                        {item.description}
                      </p>

                      {/* Translated */}
                      {translated && (
                         <div className={`mt-2 pt-2 border-t border-slate-700/50 ${item.status === 'done' ? 'opacity-50' : ''}`}>
                            <h4 className="text-xs font-semibold text-slate-300 mb-0.5 flex items-center gap-1.5">
                              <Globe className="w-3 h-3 text-slate-500" />
                              {translated.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {translated.description}
                            </p>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* 4. Timeline View */}
      <div className="pt-6 border-t border-slate-800">
         <div className="mb-4">
           <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              {t(locale, 'results.timelineTitle')}
           </h3>
         </div>
         
         <div className="space-y-4 relative border-l border-slate-800 ml-2">
            {timelineOrder.map((key) => {
              const groupItems = timelineGroups[key];
              if (!groupItems || groupItems.length === 0) return null;

              return (
                <div key={key} className="pl-5 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                  
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                     {t(locale, `results.timeline.${key}`)}
                  </h4>

                  <div className="space-y-2">
                    {groupItems.map(item => (
                       <div 
                        key={`tl-${item.id}`} 
                        className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                        onClick={() => onToggleStatus(item.id)}
                       >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="shrink-0">{getStatusIcon(item.status)}</div>
                              <span className={`text-xs font-medium truncate ${item.status === 'done' ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                                {item.title}
                              </span>
                            </div>
                            {item.dueLabel && (
                              <span className="text-[10px] text-slate-500 shrink-0">
                                {item.dueLabel}
                              </span>
                            )}
                          </div>
                       </div>
                    ))}
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
