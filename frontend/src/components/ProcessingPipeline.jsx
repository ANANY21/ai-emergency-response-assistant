import React from 'react';
import { ArrowDown, CheckCircle, ShieldAlert, Cpu, Sparkles, Layers, FileText, Activity } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "User Input",
    tech: "Raw Natural Language",
    description: "Accepts emergency description narrative from user or bystander."
  },
  {
    step: "02",
    title: "NLP Preprocessing",
    tech: "Cleaning & Normalization",
    description: "Lowercasing, whitespace normalization, character sanitation, and tokenization."
  },
  {
    step: "03",
    title: "Information Extraction",
    tech: "Clinical Entity Extraction",
    description: "Extracts incident event, symptoms, body part, injury terms, and severity indicators."
  },
  {
    step: "04",
    title: "Transformer / Deep Learning",
    tech: "DistilBERT Pretrained Model",
    description: "Passes normalized tokens through 6 multi-head self-attention Transformer layers."
  },
  {
    step: "05",
    title: "Contextual Representation",
    tech: "CLS Pooled Vector",
    description: "Produces dense 768-dimensional contextual embedding capturing semantic gravity."
  },
  {
    step: "06",
    title: "ML Classification",
    tech: "Logistic Regression",
    description: "Supervised classification using multinomial L-BFGS solver with balanced class weights."
  },
  {
    step: "07",
    title: "Incident Priority",
    tech: "Triage Acuity Stratification",
    description: "Maps output to Low, Moderate, High, or Critical priority tiers with confidence probabilities."
  },
  {
    step: "08",
    title: "Response Generation",
    tech: "Structured Knowledge Synthesis",
    description: "Generates immediate guidance, critical precautions, and emergency escalation criteria."
  },
  {
    step: "09",
    title: "Emergency Assistance",
    tech: "Structured Triage Presentation",
    description: "Delivers conservative, actionable first-aid information to guide bystanders and callers."
  }
];

export default function ProcessingPipeline({ isAnalyzing, hasResults }) {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 07
          </span>
          <h3 className="text-lg font-bold text-white m-0">Processing Pipeline</h3>
        </div>
        <span className="text-xs text-slate-400">
          9-Stage NLP, Transformer & ML Sequential Pipeline
        </span>
      </div>

      <div className="space-y-3">
        {PIPELINE_STEPS.map((item, index) => {
          const isLast = index === PIPELINE_STEPS.length - 1;
          return (
            <React.Fragment key={item.step}>
              {/* Modular Step Card */}
              <div className="bg-slate-950/70 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold flex items-center justify-center text-sm shrink-0 group-hover:bg-teal-500/20 transition">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white m-0 group-hover:text-teal-300 transition">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                        {item.tech}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 m-0 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center text-xs">
                  {hasResults ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Executed
                    </span>
                  ) : isAnalyzing ? (
                    <span className="flex items-center gap-1 text-cyan-400 font-medium text-[11px] bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20 animate-pulse">
                      Processing...
                    </span>
                  ) : (
                    <span className="text-slate-600 font-mono text-[11px]">Ready</span>
                  )}
                </div>
              </div>

              {/* Downward Connector Arrow */}
              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                    <ArrowDown className="w-3.5 h-3.5 text-teal-500/70" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
