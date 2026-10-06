import React from 'react';
import { FileText, Calendar, Activity, Crosshair, Hash, Tag } from 'lucide-react';

export default function NLPAnalysis({ data }) {
  if (!data) return null;

  const { processed_text, extracted_information, tokens, token_count } = data;
  const { event, body_part, symptoms = [], relevant_terms = [] } = extracted_information || {};

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 02
          </span>
          <h3 className="text-lg font-bold text-white m-0">NLP Analysis</h3>
        </div>
        <span className="text-xs text-slate-400">
          Text Normalization & Entity Extraction Module
        </span>
      </div>

      <div className="space-y-4">
        {/* Processed Text */}
        <div className="bg-slate-950/70 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              Processed Text
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Cleaned & Normalized
            </span>
          </div>
          <p className="text-sm font-mono text-teal-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 m-0">
            "{processed_text || 'None'}"
          </p>
        </div>

        {/* Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Detected Event */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
            <div className="text-xs uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Detected Event
            </div>
            <div className="text-base font-bold text-white bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {event || "Unspecified"}
            </div>
          </div>

          {/* Body Part */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
            <div className="text-xs uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-rose-400" />
              Body Part
            </div>
            <div className="text-base font-bold text-white bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {body_part || "Not specified"}
            </div>
          </div>

          {/* Token Statistics */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
            <div className="text-xs uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              Token Count
            </div>
            <div className="text-base font-bold text-white bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>{token_count || 0} tokens</span>
              <span className="text-xs font-normal text-slate-500">Whitespace/Punctuation normalized</span>
            </div>
          </div>
        </div>

        {/* Symptoms and Relevant Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symptoms */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
            <div className="text-xs uppercase font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              Symptoms
            </div>
            {symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    {symptom}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic m-0">No specific physiological symptoms detected.</p>
            )}
          </div>

          {/* Relevant Terms */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
            <div className="text-xs uppercase font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              Relevant Terms
            </div>
            {relevant_terms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {relevant_terms.map((term, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {term}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic m-0">No emergency terms extracted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
