
import React from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Shield, MessageSquare, ListChecks, Languages } from 'lucide-react';
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

  // Friendly labels for the dropdown (mapped to actual Enum values)
  const situationOptions = [
    { value: VisaSituation.F1_PRE_ARRIVAL, label: "I'm a new student (Pre-arrival)" },
    { value: VisaSituation.F1_STUDY, label: "I'm a current student" },
    { value: VisaSituation.F1_OPT_APPLY, label: "I'm applying for OPT" },
    { value: VisaSituation.F1_OPT_ACTIVE, label: "I'm on OPT / STEM OPT" },
    { value: VisaSituation.OTHER, label: "Other / Not sure" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] animate-fade-in p-4">
      
      {/* Hero Header Section */}
      <div className="text-center mb-10 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
          {t(locale, 'landing.heroTitle')} <br className="hidden sm:block" />
          <span className="text-blue-600 block sm:inline"> {t(locale, 'landing.heroTitleSuffix')}</span>
        </h1>
        
        {/* Subtitles */}
        <div className="space-y-3 mb-6">
          <p className="text-lg sm:text-xl font-bold text-slate-700 tracking-wide">
             {t(locale, 'landing.heroSubtitle')}
          </p>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t(locale, 'landing.heroSubtitleSupport')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
          <Shield className="w-3 h-3" />
          {t(locale, 'landing.badge')}
        </div>
      </div>

      {/* Main Content Grid: Step 1 Card & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl items-start mb-8">
        
        {/* Left Col: Step 1 Card (PRIMARY) */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-end w-full">
           
           <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden relative z-20 transform hover:-translate-y-1 transition-transform duration-300">
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
                  <div className="relative">
                    <select
                      value={situation}
                      onChange={(e) => setSituation(e.target.value as VisaSituation)}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium text-base mb-2 appearance-none shadow-sm"
                    >
                      {situationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    {t(locale, 'landing.situationHelper')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-2">
                  <button
                    onClick={onStartSample}
                    className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
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
        </div>

        {/* Right Col: Preview Mock (SECONDARY) */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start w-full relative pt-2">
            <div className="w-full max-w-md mx-auto lg:mx-0">
               {/* Label above preview */}
               <div className="mb-2 text-center lg:text-left">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {t(locale, 'landing.previewLabel')}
                 </span>
               </div>

               <div className="relative group cursor-default">
                 {/* Reduced glow effect */}
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 
                 {/* Lighter card style */}
                 <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                    
                    {/* Fake App Header */}
                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                      </div>
                      <div className="h-2 w-24 bg-slate-200 rounded-full ml-2"></div>
                    </div>

                    {/* Fake Body - Lower Contrast */}
                    <div className="p-5 space-y-4">
                       {/* Risk Banner */}
                       <div className="flex gap-3 p-3 bg-amber-50/50 border border-amber-100/50 rounded-lg">
                          <div className="w-8 h-8 rounded bg-amber-100 shrink-0"></div>
                          <div className="space-y-2 w-full">
                             <div className="h-2 w-1/3 bg-amber-100 rounded"></div>
                             <div className="h-2 w-3/4 bg-amber-50 rounded"></div>
                          </div>
                       </div>

                       {/* Summary */}
                       <div className="space-y-2">
                          <div className="h-3 w-1/4 bg-slate-100 rounded mb-2"></div>
                          <div className="h-2 w-full bg-slate-50 rounded"></div>
                          <div className="h-2 w-5/6 bg-slate-50 rounded"></div>
                          <div className="h-2 w-full bg-slate-50 rounded"></div>
                       </div>

                       {/* Checklist Preview */}
                       <div className="space-y-2 pt-2">
                          <div className="h-3 w-1/3 bg-slate-100 rounded mb-2"></div>
                          <div className="flex items-center gap-3 p-2 border border-slate-50 rounded bg-slate-50/50">
                             <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                             <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                          </div>
                          <div className="flex items-center gap-3 p-2 border border-slate-50 rounded bg-slate-50/50">
                             <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                             <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                          </div>
                       </div>
                    </div>

                    {/* Overlay Label */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5 group-hover:bg-transparent transition-colors"></div>
                 </div>
               </div>
              
              <p className="mt-3 text-sm font-medium text-slate-400 text-center lg:text-left">
                 {t(locale, 'landing.previewCaption')}
              </p>
            </div>
        </div>
      </div>

      {/* "How it works" Line */}
      <div className="w-full text-center py-6">
        <p className="text-sm font-medium text-slate-500">
          {t(locale, 'landing.howItWorks')}
        </p>
      </div>
      
      {/* 3-Feature Row (Now in a block) */}
      <div className="w-full max-w-4xl bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-8">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
               <div className="bg-white p-3 rounded-full mb-3 shadow-sm border border-slate-100">
                 <MessageSquare className="w-6 h-6 text-blue-600" />
               </div>
               <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2">{t(locale, 'landing.features.plainEnglish.title')}</h3>
               <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                 {t(locale, 'landing.features.plainEnglish.desc')}
               </p>
            </div>

            <div className="flex flex-col items-center text-center">
               <div className="bg-white p-3 rounded-full mb-3 shadow-sm border border-slate-100">
                 <ListChecks className="w-6 h-6 text-indigo-600" />
               </div>
               <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2">{t(locale, 'landing.features.checklist.title')}</h3>
               <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                 {t(locale, 'landing.features.checklist.desc')}
               </p>
            </div>

            <div className="flex flex-col items-center text-center">
               <div className="bg-white p-3 rounded-full mb-3 shadow-sm border border-slate-100">
                 <Languages className="w-6 h-6 text-emerald-600" />
               </div>
               <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2">{t(locale, 'landing.features.korean.title')}</h3>
               <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                 {t(locale, 'landing.features.korean.desc')}
               </p>
            </div>
         </div>
      </div>
      
      <p className="mt-4 text-xs text-slate-400 max-w-md text-center">
        {t(locale, 'landing.agreement')}
      </p>

    </div>
  );
};

export default LandingScreen;
