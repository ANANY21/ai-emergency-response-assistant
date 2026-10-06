import React from 'react';
import { Cpu, CheckCircle2, Layers, Binary, Database } from 'lucide-react';

export default function TransformerAnalysis({ data }) {
  if (!data) return null;

  const { transformer_info, transformer_status } = data;
  const modelName = transformer_info?.model || "DistilBERT";
  const architecture = transformer_info?.architecture || "Transformer / Deep Learning";
  const explanation = transformer_info?.explanation || "Contextual representation generated from the emergency description.";
  const embeddingDim = transformer_info?.embedding_dim || 768;
  const l2Norm = transformer_info?.l2_norm;
  const mean = transformer_info?.mean;
  const std = transformer_info?.std;
  const preview = transformer_info?.preview || [];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 03
          </span>
          <h3 className="text-lg font-bold text-white m-0">Transformer Analysis</h3>
        </div>
        <span className="text-xs text-slate-400">
          Pretrained Deep Learning Representation Module
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Model Card */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Model
          </div>
          <div className="text-xl font-extrabold text-white">
            {modelName}
          </div>
          <div className="text-[11px] font-mono text-cyan-400/80 mt-1">
            distilbert-base-uncased
          </div>
        </div>

        {/* Architecture Card */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Architecture
          </div>
          <div className="text-xl font-extrabold text-white">
            Transformer
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pretrained Neural Language Model
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Representation Status
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Embedding Generated Successfully
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Output Dim: {embeddingDim} features
          </div>
        </div>
      </div>

      {/* Compact Representation Explanation Box */}
      <div className="bg-teal-950/20 rounded-xl border border-teal-500/30 p-4 mb-4">
        <div className="flex items-start gap-3">
          <Binary className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
              Contextual Representation
            </div>
            <p className="text-sm text-slate-200 m-0 font-medium">
              "{explanation}"
            </p>
            <p className="text-xs text-slate-400 mt-1 m-0">
              Extracted from the 768-dimensional CLS token output of DistilBERT's final self-attention layer to feed the downstream triage classifier.
            </p>
          </div>
        </div>
      </div>

      {/* Embedding Diagnostics */}
      {preview && preview.length > 0 && (
        <div className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              Embedding Diagnostics (First 8 / 768 features)
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              {l2Norm && <span>L2 Norm: <strong className="text-teal-400">{l2Norm}</strong></span>}
              {mean && <span>Mean: <strong className="text-teal-400">{mean}</strong></span>}
              {std && <span>Std: <strong className="text-teal-400">{std}</strong></span>}
            </div>
          </div>
          <div className="font-mono text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 overflow-x-auto flex gap-2">
            {preview.map((val, idx) => (
              <span key={idx} className="bg-slate-800/80 px-2 py-0.5 rounded text-teal-300 border border-slate-700/60">
                [{idx}]: {val}
              </span>
            ))}
            <span className="text-slate-500 self-center">... +760 dims</span>
          </div>
        </div>
      )}
    </div>
  );
}
