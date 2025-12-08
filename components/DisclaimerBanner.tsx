import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">
            Not Legal Advice / 법적 조언이 아닙니다
          </h3>
          <div className="mt-1 text-sm text-amber-700">
            <p>
              This tool is for educational purposes only. Immigration rules change frequently.
              <strong> Always</strong> confirm important deadlines and requirements with your school's official advisor (DSO) or a qualified immigration attorney.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
