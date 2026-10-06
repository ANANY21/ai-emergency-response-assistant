import React from 'react';
import { AlertCircle, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EmergencyAnalysis({ data }) {
  if (!data) return null;

  const { emergency_type, priority, priority_confidence, generated_response } = data;
  const upperPriority = (priority || "UNKNOWN").toUpperCase();

  const getPriorityTheme = (p) => {
    switch (p) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/15',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          pill: 'bg-rose-500 text-white',
          glow: 'shadow-rose-500/20',
          badge: 'CRITICAL ACUITY',
          desc: 'Immediate life-safety threat suspected. Immediate EMS dispatch indicated.'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          pill: 'bg-orange-500 text-white',
          glow: 'shadow-orange-500/20',
          badge: 'HIGH ACUITY',
          desc: 'Significant physical trauma or rapid deterioration risk. Urgent evaluation needed.'
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          pill: 'bg-amber-500 text-slate-950 font-bold',
          glow: 'shadow-amber-500/20',
          badge: 'MODERATE ACUITY',
          desc: 'Distressing injury or acute condition requiring timely medical assessment.'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          pill: 'bg-emerald-500 text-slate-950 font-bold',
          glow: 'shadow-emerald-500/20',
          badge: 'LOW ACUITY',
          desc: 'Superficial or minor presentation. Basic first aid and monitoring appropriate.'
        };
    }
  };

  const theme = getPriorityTheme(upperPriority);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 01
          </span>
          <h3 className="text-lg font-bold text-white m-0">Emergency Analysis</h3>
        </div>
        <span className="text-xs text-slate-400">
          Synthesized Incident Triage Classification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Type Card */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-teal-400" />
              <span>Identified Emergency Type</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {emergency_type || "Unspecified"}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Classification Domain:</span>
            <span className="text-slate-300 font-mono">Deep Learning Embedding</span>
          </div>
        </div>

        {/* Priority Card */}
        <div className={`rounded-xl border ${theme.border} ${theme.bg} p-5 flex flex-col justify-between shadow-lg ${theme.glow}`}>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Incident Priority</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${theme.pill}`}>
                {theme.badge}
              </span>
            </div>
            <div className={`text-3xl font-black tracking-tight mt-1 ${theme.text}`}>
              {upperPriority}
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {theme.desc}
            </p>
          </div>
          {priority_confidence !== undefined && (
            <div className="mt-4 pt-3 border-t border-slate-700/40 text-xs flex items-center justify-between text-slate-300">
              <span>Classifier Model Confidence:</span>
              <span className="font-mono font-bold">{(priority_confidence * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>

      {generated_response?.urgency_statement && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{generated_response.urgency_statement}</span>
        </div>
      )}
    </div>
  );
}
