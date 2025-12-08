
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { t } from '../utils/i18n';
import { Locale } from '../types';

interface TextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onSave: (text: string) => void;
  locale: Locale;
}

const TextEditorModal: React.FC<TextEditorModalProps> = ({
  isOpen,
  onClose,
  initialText,
  onSave,
  locale,
}) => {
  const [text, setText] = useState(initialText);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            {t(locale, 'workspace.modalTitle')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-grow flex flex-col p-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow w-full p-6 resize-none outline-none text-base font-mono leading-relaxed text-slate-700 bg-slate-50 focus:bg-white transition-colors"
            placeholder={t(locale, 'workspace.placeholder')}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
          >
            {t(locale, 'workspace.cancel')}
          </button>
          <button
            onClick={() => {
              onSave(text);
              onClose();
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all"
          >
            <Check className="w-4 h-4" />
            {t(locale, 'workspace.saveAndClose')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditorModal;
