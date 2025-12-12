import React from 'react';
import { Locale } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (l: Locale) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale, onLocaleChange }) => {
  const languages: { code: Locale; label: string }[] = [
    { code: 'en', label: 'English' },
    // Temporarily disabled to match strict Locale type 'en'
    // { code: 'ko', label: '한국어' },
    // { code: 'zh', label: '中文' },
    // { code: 'hi', label: 'हिन्दी' },
    // { code: 'ja', label: '日本語' },
  ];

  if (languages.length <= 1) {
    return null;
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase">{currentLocale}</span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hidden group-hover:block z-50">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLocaleChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${
                currentLocale === lang.code ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;