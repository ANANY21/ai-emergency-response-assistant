import React from 'react';
import { ShieldAlert, Cpu, Network, Activity, Info } from 'lucide-react';

export default function Header({ onOpenTransparency }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/30">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">
                AI Emergency Response Assistant
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 m-0">
              Clinical Triage Support via NLP, Transformers (DistilBERT) & Machine Learning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              DistilBERT Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Logistic Regression
            </span>
          </div>

          <button
            onClick={onOpenTransparency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="System transparency and architecture disclosure"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>Transparency</span>
          </button>
        </div>
      </div>
    </header>
  );
}
