import React from 'react';
import { X, ShieldCheck, Cpu, Database, Binary, Info, AlertTriangle } from 'lucide-react';

export default function ModelTransparency({ isOpen, onClose, modelInfo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white m-0">Model Transparency & Technical Disclosure</h3>
            <p className="text-xs text-slate-400 m-0">Architecture disclosure and non-fabrication guarantee</p>
          </div>
        </div>

        <div className="space-y-4 my-4 text-xs sm:text-sm">
          {/* NLP */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold uppercase text-teal-400 mb-1 flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              NLP Module
            </div>
            <p className="text-slate-300 m-0">
              Text preprocessing (lowercase conversion, whitespace harmonization, noise filtering) + rule-based clinical entity and symptom extraction.
            </p>
          </div>

          {/* Deep Learning */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold uppercase text-cyan-400 mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Deep Learning
            </div>
            <p className="text-slate-300 m-0">
              Pretrained neural language model architecture operating on raw natural language text representations.
            </p>
          </div>

          {/* Transformer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold uppercase text-teal-400 mb-1 flex items-center gap-1.5">
              <Binary className="w-4 h-4" />
              Transformer: DistilBERT (<code className="text-teal-300">distilbert-base-uncased</code>)
            </div>
            <p className="text-slate-300 m-0">
              Loaded directly from Hugging Face Transformers. Generates 768-dimensional contextual pooled embeddings via the CLS token representation. (Pretrained Transformer; not trained from scratch).
            </p>
          </div>

          {/* Machine Learning */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold uppercase text-blue-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Machine Learning: Logistic Regression
            </div>
            <p className="text-slate-300 m-0">
              scikit-learn Logistic Regression classifier with balanced class weighting trained on DistilBERT embeddings of the demonstration dataset.
            </p>
          </div>

          {/* Clinical Disclaimer */}
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 text-amber-200 text-xs">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Clinical Information Assistant Disclaimer
            </div>
            This application is designed strictly as an emergency-response information assistant. It does NOT diagnose medical conditions, formulate pathology reports, or replace professional emergency medical personnel (EMS/911/112).
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Close Disclosure
          </button>
        </div>
      </div>
    </div>
  );
}
