
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { t } from '../utils/i18n';
import { Locale } from '../types';

interface DisclaimerBannerProps {
  locale: Locale;
}

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ locale }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">
            {t(locale, 'common.legalTitle')}
          </h3>
          <div className="mt-1 text-sm text-amber-700">
            <p>
              {t(locale, 'common.legalDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
