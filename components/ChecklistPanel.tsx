import React from 'react';
import { ChecklistItem } from '../types';
import { CheckCircle2, Circle, Clock, ClipboardList } from 'lucide-react';

interface ChecklistPanelProps {
  items: ChecklistItem[];
  onToggleStatus: (id: string) => void;
}

const ChecklistPanel: React.FC<ChecklistPanelProps> = ({ items, onToggleStatus }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
        <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No action items detected yet.</p>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Your Action Checklist
          </h3>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {items.filter(i => i.status === 'done').length} / {items.length} Done
          </span>
      </div>
     
      <div className="space-y-3">
        {items.map((item) => (
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/50 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <h4 className={`font-semibold text-slate-800 mb-1 ${item.status === 'done' ? 'line-through text-slate-500' : ''}`}>
                  {item.title}
                </h4>
                <p className={`text-sm text-slate-600 leading-snug ${item.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                  {item.description}
                </p>
              </div>
            </div>
            
            {/* Status Tooltip/Label on Hover/Active */}
             <div className="absolute top-4 right-4 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.status === 'todo' ? 'Click to start' : item.status === 'in-progress' ? 'Click to complete' : 'Click to undo'}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistPanel;
