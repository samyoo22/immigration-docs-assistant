
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
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <ShieldCheck className="h-5 w-5 text-amber-600" aria-hidden="true" />
        </div>
        <div className="ml-3 min-w-0 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-950">
              {t(locale, 'common.legalTitle')}
            </h3>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="sm:hidden text-amber-800 p-1 hover:bg-amber-100 rounded"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          <div className={`mt-1 text-sm text-amber-900 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
            <p className="leading-relaxed">
              {t(locale, 'common.legalDisclaimer')}
            </p>
          </div>
          
          {!isExpanded && (
            <div className="sm:hidden mt-1">
              <p className="text-xs text-amber-800 truncate">
                {t(locale, 'common.legalDisclaimer')}
              </p>
              <button 
                onClick={() => setIsExpanded(true)}
                className="text-xs font-semibold text-amber-900 underline mt-1"
              >
                {t(locale, 'common.readMore')}
              </button>
            </div>
          )}
           {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="sm:hidden text-xs font-semibold text-amber-900 underline mt-2"
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
