import React from 'react';
import { VisaSituation, UserIntent } from '../types';
import { Mail, FileText, CheckSquare, ArrowRight, Shield } from 'lucide-react';

interface LandingScreenProps {
  intent: UserIntent;
  setIntent: (i: UserIntent) => void;
  situation: VisaSituation;
  setSituation: (s: VisaSituation) => void;
  onStartSample: () => void;
  onStartCustom: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({
  intent,
  setIntent,
  situation,
  setSituation,
  onStartSample,
  onStartCustom,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] animate-fade-in p-4">
      
      {/* Hero Section */}
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Visa & Document <br className="hidden sm:block" />
          <span className="text-blue-600">Clarity Assistant</span>
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          Paste your visa or school email, get a simple explanation and a to-do checklist.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
          <Shield className="w-3 h-3" />
          Supports Korean + English · Not legal advice
        </div>
      </div>

      {/* Quick Start Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Step 1 of 3 · What do you need help with?
            </span>
          </div>

          {/* Intent Selection */}
          <div className="grid gap-3 mb-6">
            {[
              { id: UserIntent.EMAIL, icon: Mail, label: 'Understand an email about my visa' },
              { id: UserIntent.OPT, icon: CheckSquare, label: 'Check what I need to do for OPT' },
              { id: UserIntent.GENERAL, icon: FileText, label: 'Understand general visa instructions' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setIntent(item.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  intent === item.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${intent === item.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`font-medium ${intent === item.id ? 'text-blue-900' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Situation Dropdown */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What is your current situation?
            </label>
            <select
              value={situation}
              onChange={(e) => setSituation(e.target.value as VisaSituation)}
              className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
            >
              {Object.values(VisaSituation).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onStartSample}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Start with sample text
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={onStartCustom}
              className="w-full py-3 px-6 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-all"
            >
              Or paste my own text
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingScreen;
