
import React from 'react';
import { VisaSituation, Locale } from '../types';
import { ArrowRight, Shield, MessageSquare, CheckCircle, Languages, Plane, ChevronRight, FileText } from 'lucide-react';
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

  // Friendly labels for the dropdown
  const situationOptions = [
    { value: VisaSituation.F1_PRE_ARRIVAL, label: "I'm a new student (Pre-arrival)" },
    { value: VisaSituation.F1_STUDY, label: "I'm a current student" },
    { value: VisaSituation.F1_OPT_APPLY, label: "I'm applying for OPT" },
    { value: VisaSituation.F1_OPT_ACTIVE, label: "I'm on OPT / STEM OPT" },
    { value: VisaSituation.OTHER, label: "Other / Not sure" },
  ];

  const journeySteps = t(locale, 'landing.journey.steps') as unknown as string[];
  const examples = t(locale, 'landing.examples') as unknown as string[];

  return (
    <div className="relative isolate pt-20 pb-16 animate-fade-in overflow-hidden">
      
      {/* BACKGROUND DECORATIONS */}
      {/* World Map Grid (Abstract) */}
      <div className="absolute inset-0 -z-20 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Flight Path Animation Container */}
      <div className="absolute top-[10%] left-0 right-0 h-[300px] -z-10 pointer-events-none overflow-hidden select-none">
          {/* A large curved SVG path representing a flight/journey */}
          <svg className="w-full h-full opacity-20" preserveAspectRatio="none">
             <path d="M-100,250 C300,50 800,50 1600,250" fill="none" stroke="url(#gradient-path)" strokeWidth="2" strokeDasharray="8 8" />
             <defs>
               <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="transparent" />
                 <stop offset="50%" stopColor="#38bdf8" />
                 <stop offset="100%" stopColor="transparent" />
               </linearGradient>
             </defs>
          </svg>
          {/* Floating Plane Icon */}
          <div className="absolute top-[80px] left-[20%] animate-[float_8s_ease-in-out_infinite]">
             <Plane className="w-6 h-6 text-sky-500/40 rotate-12" />
          </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col items-center">
        
        {/* HERO TEXT */}
        <div className="text-center max-w-4xl mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300/70 mb-4 font-semibold">
            {t(locale, 'landing.heroKicker')}
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
             {t(locale, 'landing.heroTitle')} <br className="hidden sm:block" />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-400 pb-2">
               {t(locale, 'landing.heroTitleSuffix')}
             </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
            {t(locale, 'landing.heroSubtitleSupport')}
          </p>
          
          {/* Badge */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1.5 text-[11px] sm:text-xs font-medium text-sky-100 backdrop-blur-sm">
               <Shield className="w-3.5 h-3.5 text-sky-400" />
               {t(locale, 'landing.badge')}
            </span>
          </div>

          {/* JOURNEY STRIP */}
          <div className="mt-8 flex justify-center">
             <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full bg-slate-900/70 border border-slate-700/60 px-5 py-2.5 backdrop-blur-md shadow-lg">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold mr-1">
                  {t(locale, 'landing.journey.label')}
                </span>
                {journeySteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                       {step}
                    </span>
                  </React.Fragment>
                ))}
             </div>
          </div>
        </div>

        {/* MAIN INTERACTION CARD ("Boarding Pass" Style) */}
        <div className="mt-12 w-full max-w-5xl px-4 lg:px-0">
          <div className="relative rounded-3xl border border-slate-700/70 bg-slate-900/80 shadow-[0_0_60px_rgba(56,189,248,0.15)] backdrop-blur-md p-6 sm:p-8 lg:p-10 transition-colors duration-500 hover:border-sky-500/30">
            
            <div className="grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-8 lg:gap-12">
              
              {/* LEFT COL: Input */}
              <div className="flex flex-col gap-6">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                        {t(locale, 'landing.step1')}
                      </h2>
                   </div>

                   <label className="block text-xl font-bold text-white mb-4">
                     {t(locale, 'landing.situationLabel')}
                   </label>
                   
                   <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-200"></div>
                      <div className="relative">
                        <select
                          value={situation}
                          onChange={(e) => setSituation(e.target.value as VisaSituation)}
                          className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-900 px-4 py-4 text-base font-medium text-white shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors cursor-pointer hover:bg-slate-800"
                        >
                          {situationOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <ChevronRight className="h-4 w-4 rotate-90" />
                        </div>
                      </div>
                   </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-3 pt-2">
                   <button
                     onClick={onStartSample}
                     className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 hover:shadow-sky-500/40 transition-all active:scale-[0.98]"
                   >
                     {t(locale, 'landing.btnSample')}
                     <ArrowRight className="w-5 h-5" />
                   </button>
                   <button
                     onClick={onStartCustom}
                     className="inline-flex justify-center items-center rounded-xl px-6 py-3.5 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-slate-700"
                   >
                     {t(locale, 'landing.btnCustom')}
                   </button>
                 </div>

                 {/* Examples Chips */}
                 <div className="pt-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-3 font-semibold">
                      {t(locale, 'landing.examplesLabel')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {examples.map((ex, idx) => (
                         <span key={idx} className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-300">
                           {ex}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>

              {/* RIGHT COL: Preview Skeleton */}
              <div className="relative hidden lg:block">
                 <div className="absolute -top-4 -right-4 -left-4 -bottom-4 bg-sky-500/5 rounded-[40px] blur-2xl"></div>
                 
                 <div className="relative h-full flex flex-col justify-center">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">
                       {t(locale, 'landing.previewHeader')}
                    </p>

                    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-5 shadow-2xl relative overflow-hidden">
                       {/* Subtle internal gloss */}
                       <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>

                       {/* Fake Header */}
                       <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                             <Shield className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div className="flex-1 space-y-1.5">
                             <div className="h-2.5 w-32 rounded-full bg-slate-700"></div>
                             <div className="h-1.5 w-20 rounded-full bg-slate-800"></div>
                          </div>
                       </div>

                       {/* Fake Body Content */}
                       <div className="space-y-4">
                          {/* Summary Lines */}
                          <div className="space-y-2 p-1">
                             <div className="h-2 w-full rounded-full bg-slate-800/80"></div>
                             <div className="h-2 w-[92%] rounded-full bg-slate-800/80"></div>
                             <div className="h-2 w-[85%] rounded-full bg-slate-800/80"></div>
                          </div>

                          {/* Checklist Items */}
                          <div className="space-y-2.5 pt-2">
                             <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                                <div className="h-4 w-4 rounded-full border-2 border-slate-600"></div>
                                <div className="h-2 w-3/4 rounded-full bg-slate-700"></div>
                             </div>
                             <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                                <div className="h-4 w-4 rounded-full border-2 border-slate-600"></div>
                                <div className="h-2 w-1/2 rounded-full bg-slate-700"></div>
                             </div>
                          </div>
                          
                          {/* Timeline Bar */}
                          <div className="pt-2 flex gap-1">
                             <div className="h-1 flex-1 rounded-full bg-emerald-500/40"></div>
                             <div className="h-1 flex-1 rounded-full bg-slate-800"></div>
                             <div className="h-1 flex-1 rounded-full bg-slate-800"></div>
                          </div>
                       </div>
                    </div>
                    
                    <p className="mt-4 text-center text-xs font-medium text-slate-500">
                       {t(locale, 'landing.previewCaption')}
                    </p>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-5xl px-4 lg:px-0">
           {/* Card 1 */}
           <div className="group rounded-2xl border border-slate-800 bg-slate-900/90 px-5 py-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10">
              <div className="mb-3 text-sky-400 group-hover:text-sky-300 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">
                {t(locale, 'landing.features.plainEnglish.title')}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(locale, 'landing.features.plainEnglish.desc')}
              </p>
           </div>

           {/* Card 2 */}
           <div className="group rounded-2xl border border-slate-800 bg-slate-900/90 px-5 py-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="mb-3 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">
                {t(locale, 'landing.features.checklist.title')}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(locale, 'landing.features.checklist.desc')}
              </p>
           </div>

           {/* Card 3 */}
           <div className="group rounded-2xl border border-slate-800 bg-slate-900/90 px-5 py-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="mb-3 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                <Languages className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">
                {t(locale, 'landing.features.korean.title')}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(locale, 'landing.features.korean.desc')}
              </p>
           </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-500 max-w-md px-4">
           {t(locale, 'landing.howItWorks')}
        </p>

      </div>
    </div>
  );
};

export default LandingScreen;
