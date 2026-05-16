
import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { t } from '../utils/i18n';
import { Locale } from '../types';

interface DisclaimerBannerProps {
  locale: Locale;
}

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ locale }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <ShieldCheck className="h-5 w-5 text-sky-700" aria-hidden="true" />
        </div>
        <div className="ml-3 min-w-0 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-950">
              {t(locale, 'common.legalTitle')}
            </h3>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded p-1 text-sky-800 hover:bg-sky-100 sm:hidden"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          <div className={`mt-1 text-sm text-slate-700 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
            <p className="leading-relaxed">
              {t(locale, 'common.legalDisclaimer')}
            </p>
          </div>
          
          {!isExpanded && (
            <div className="sm:hidden mt-1">
              <p className="truncate text-xs text-slate-600">
                {t(locale, 'common.legalDisclaimer')}
              </p>
              <button 
                onClick={() => setIsExpanded(true)}
                className="mt-1 text-xs font-semibold text-sky-800 underline"
              >
                {t(locale, 'common.readMore')}
              </button>
            </div>
          )}
           {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="mt-2 text-xs font-semibold text-sky-800 underline sm:hidden"
            >
              {t(locale, 'common.readLess')}
            </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
