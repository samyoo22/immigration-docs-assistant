
import React from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Shield } from 'lucide-react';
import { t } from '../utils/i18n';

interface LandingScreenProps {
  situation: VisaSituation;
  setSituation: (s: VisaSituation) => void;
  onStartSample: () => void;
  onStartCustom: () => void;
  locale: Locale;
}

const LandingScreen: React.FC<LandingScreenProps> = ({
  situation,
  setSituation,
  onStartSample,
  onStartCustom,
  locale,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] animate-fade-in p-4">
      
      {/* Hero Section */}
      <div className="text-center mb-10 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          {t(locale, 'landing.heroTitle')} <br className="hidden sm:block" />
          <span className="text-blue-600 block sm:inline"> {t(locale, 'landing.heroTitleSuffix')}</span>
        </h1>
        
        {/* Subtitles */}
        <div className="space-y-2 mb-6">
          <p className="text-lg text-slate-600">
            {t(locale, 'landing.heroSubtitle')}
          </p>
          <p className="text-base text-slate-500 font-medium">
            {t(locale, 'landing.heroSubtitleSupport')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
          <Shield className="w-3 h-3" />
          {t(locale, 'landing.badge')}
        </div>
      </div>

      {/* Quick Start Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t(locale, 'landing.step1')}
            </span>
          </div>

          {/* Situation Dropdown */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {t(locale, 'landing.situationLabel')}
            </label>
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value as VisaSituation)}
              className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium text-base mb-2"
            >
              {Object.values(VisaSituation).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500">
              {t(locale, 'landing.situationHelper')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-2">
            <button
              onClick={onStartSample}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
            >
              {t(locale, 'landing.btnSample')}
              <ArrowRight className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <button
                onClick={onStartCustom}
                className="text-slate-500 text-sm font-medium hover:text-blue-600 transition-colors border-b border-transparent hover:border-blue-600 pb-0.5"
              >
                {t(locale, 'landing.btnCustom')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-slate-400 max-w-md text-center">
        {t(locale, 'landing.agreement')}
      </p>

    </div>
  );
};

export default LandingScreen;
