import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, PhoneCall, HelpCircle, FileCheck } from 'lucide-react';

export default function GeneratedResponse({ data }) {
  if (!data) return null;

  const { generated_response } = data;
  if (!generated_response) return null;

  const {
    emergency_type,
    priority,
    immediate_guidance = [],
    precautions = [],
    when_to_seek_help = [],
    ambiguity_note,
    medical_disclaimer,
    urgency_statement
  } = generated_response;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 05
          </span>
          <h3 className="text-lg font-bold text-white m-0">Generated Response</h3>
        </div>
        <span className="text-xs text-slate-400">
          Structured First-Aid & Escalation Protocol
        </span>
      </div>

      {ambiguity_note && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{ambiguity_note}</span>
        </div>
      )}

      {/* Primary Status Banner */}
      <div className="bg-slate-950/70 rounded-xl border border-slate-800 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs uppercase text-slate-400 font-semibold block">Incident Nature</span>
            <span className="text-lg font-bold text-white">{emergency_type}</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-xs uppercase text-slate-400 font-semibold block">Priority Tier</span>
            <span className="text-lg font-extrabold text-teal-300">{priority}</span>
          </div>
        </div>

        {urgency_statement && (
          <div className="text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 max-w-md">
            {urgency_statement}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Immediate Guidance */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 flex flex-col">
          <div className="text-xs uppercase font-bold text-teal-400 tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Immediate Guidance
          </div>
          <div className="space-y-3 flex-1">
            {immediate_guidance.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-teal-500/30">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Precautions */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 flex flex-col">
          <div className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Precautions (What NOT to do)
          </div>
          <div className="space-y-3 flex-1">
            {precautions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-amber-500/30">
                  !
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* When to Seek Help */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 flex flex-col">
          <div className="text-xs uppercase font-bold text-rose-400 tracking-wider mb-3 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-400" />
            When to Seek Professional Help
          </div>
          <div className="space-y-3 flex-1">
            {when_to_seek_help.map((criterion, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center shrink-0 text-[11px] border border-rose-500/30">
                  &bull;
                </span>
                <span>{criterion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Callout */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <FileCheck className="w-4 h-4 text-teal-400 shrink-0" />
        <span>{medical_disclaimer}</span>
      </div>
    </div>
  );
}
