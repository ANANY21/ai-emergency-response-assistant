import React from 'react';
import { Send, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export default function EmergencyInput({
  text,
  onChange,
  onAnalyze,
  isLoading,
  error,
  onClear,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden mb-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span>Enter Emergency Incident Description</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Provide the emergency details in natural language. The system extracts NLP entities, generates DistilBERT contextual embeddings, classifies triage priority, and structures response protocols.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <textarea
              rows={4}
              value={text}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. A person fell from a bike and has severe pain and swelling in the arm..."
              className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 rounded-xl p-4 text-sm sm:text-base border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition resize-y font-normal"
              disabled={isLoading}
            />

            {text && (
              <button
                type="button"
                onClick={onClear}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                title="Clear input"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{text.length} characters</span>
              <span>•</span>
              <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                isLoading || !text.trim()
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white shadow-teal-500/20 active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Emergency...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Analyze Emergency</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Analysis Notice:</span> {error}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
