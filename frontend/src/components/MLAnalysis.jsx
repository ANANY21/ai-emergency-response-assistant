import React from 'react';
import { Target, BarChart2, CheckCircle2, AlertCircle, Info, Grid } from 'lucide-react';

export default function MLAnalysis({ data, globalMetrics }) {
  if (!data) return null;

  const { priority, priority_confidence, priority_probabilities = {}, model_information } = data;
  const metrics = model_information?.evaluation_metrics || globalMetrics || {};

  const priorityClasses = ["Low", "Moderate", "High", "Critical"];

  const getPriorityColor = (p) => {
    switch (p?.toUpperCase()) {
      case 'CRITICAL': return 'bg-rose-500 text-rose-100 border-rose-500/40';
      case 'HIGH': return 'bg-orange-500 text-orange-100 border-orange-500/40';
      case 'MODERATE': return 'bg-amber-500 text-amber-950 font-bold border-amber-500/40';
      case 'LOW':
      default: return 'bg-emerald-500 text-emerald-950 font-bold border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 04
          </span>
          <h3 className="text-lg font-bold text-white m-0">Machine Learning Analysis</h3>
        </div>
        <span className="text-xs text-slate-400">
          Supervised Classification on Transformer Embeddings
        </span>
      </div>

      {/* Model & Prediction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
          <div className="text-xs uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            Model Classifier
          </div>
          <div className="text-xl font-extrabold text-white">
            Logistic Regression
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multinomial L-BFGS solver with balanced class weighting on 768-dim embeddings.
          </p>
        </div>

        <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              Predicted Priority Level
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-2xl font-black px-3 py-0.5 rounded-lg border ${getPriorityColor(priority)}`}>
                {priority}
              </span>
              {priority_confidence !== undefined && (
                <span className="text-xs font-mono text-slate-300">
                  Confidence: <strong className="text-teal-400">{(priority_confidence * 100).toFixed(1)}%</strong>
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Downstream inference output based on contextual semantic patterns.
          </div>
        </div>
      </div>

      {/* Class Probabilities Distribution */}
      {priority_probabilities && Object.keys(priority_probabilities).length > 0 && (
        <div className="bg-slate-950/70 rounded-xl border border-slate-800 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-semibold text-slate-300 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-teal-400" />
              Class Probability Distribution
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Softmax Probabilities</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {priorityClasses.map((cls) => {
              const prob = priority_probabilities[cls] || 0;
              const isSelected = cls.toLowerCase() === priority?.toLowerCase();
              return (
                <div
                  key={cls}
                  className={`p-3 rounded-lg border transition ${
                    isSelected
                      ? 'bg-teal-950/30 border-teal-500/50'
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className={isSelected ? 'text-teal-300 font-bold' : 'text-slate-300'}>
                      {cls}
                    </span>
                    <span className="font-mono text-slate-400">
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cls === 'Critical' ? 'bg-rose-500' :
                        cls === 'High' ? 'bg-orange-500' :
                        cls === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.max(prob * 100, 2)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Model Evaluation Metrics Section */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
          <div>
            <div className="text-xs uppercase font-bold text-teal-400 tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-teal-400" />
              Model Evaluation Metrics
            </div>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Calculated on an unseen 25% holdout test split of the dataset.
            </p>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 self-start sm:self-auto">
            Prototype Evaluation ({metrics.test_samples || 0} Test Samples)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3.5 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Accuracy</div>
            <div className="text-2xl font-black text-teal-300 font-mono">
              {metrics.accuracy !== undefined ? (metrics.accuracy * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3.5 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Precision</div>
            <div className="text-2xl font-black text-cyan-300 font-mono">
              {metrics.precision !== undefined ? (metrics.precision * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3.5 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Recall</div>
            <div className="text-2xl font-black text-emerald-300 font-mono">
              {metrics.recall !== undefined ? (metrics.recall * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-3.5 text-center">
            <div className="text-xs text-slate-400 uppercase font-semibold mb-1">F1 Score</div>
            <div className="text-2xl font-black text-blue-300 font-mono">
              {metrics.f1_score !== undefined ? (metrics.f1_score * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
        </div>

        {/* Confusion Matrix Display */}
        {metrics.confusion_matrix && metrics.labels && (
          <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-4 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-300 mb-3">
              <Grid className="w-3.5 h-3.5 text-teal-400" />
              Confusion Matrix (Predicted vs Actual)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-2 text-left font-normal italic">Actual \ Predicted</th>
                    {metrics.labels.map((l) => (
                      <th key={l} className="p-2 font-semibold text-slate-300">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.confusion_matrix.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-800/50">
                      <td className="p-2 text-left font-semibold text-slate-300">
                        {metrics.labels[rowIdx]}
                      </td>
                      {row.map((val, colIdx) => (
                        <td
                          key={colIdx}
                          className={`p-2 font-mono font-bold ${
                            rowIdx === colIdx
                              ? 'bg-teal-500/20 text-teal-300'
                              : val > 0 ? 'bg-rose-500/10 text-rose-300' : 'text-slate-600'
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
          <span>
            {metrics.note || "Calculated using real scikit-learn metrics on the local emergency dataset."}
          </span>
        </div>
      </div>
    </div>
  );
}
