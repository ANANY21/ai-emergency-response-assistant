import React, { useState } from 'react';
import { Terminal, Copy, Check, MessageSquare, Shield, Settings, ListChecks } from 'lucide-react';

const PROMPT_TABS = [
  { id: 'emergency_response_summary', label: 'Response Summary', num: '1' },
  { id: 'emergency_understanding', label: 'Emergency Understanding', num: '2' },
  { id: 'first_aid_guidance', label: 'First-Aid Guidance', num: '3' },
  { id: 'incident_prioritization', label: 'Incident Prioritization', num: '4' },
  { id: 'hospital_assistance', label: 'Hospital Assistance', num: '5' },
];

export default function PromptEngineering({ promptData, currentInput, currentPriority, currentType }) {
  const [activeTab, setActiveTab] = useState('emergency_response_summary');
  const [copied, setCopied] = useState(false);

  const templates = promptData?.templates || {};
  const activePrompt = templates[activeTab] || {};

  const handleCopy = () => {
    if (activePrompt.full_prompt_text) {
      navigator.clipboard.writeText(activePrompt.full_prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
            Section 06
          </span>
          <h3 className="text-lg font-bold text-white m-0">Prompt Engineering</h3>
        </div>
        <span className="text-xs text-slate-400">
          5 Clinical-Grade Structured Prompt Templates
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PROMPT_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isSelected ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.num}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Template Content */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-5 relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <span>{activePrompt.title || 'Prompt Template'}</span>
            </div>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              {activePrompt.description || 'Structured prompt formulation with clinical guardrails.'}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-teal-400" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Modular Prompt Sections */}
        <div className="space-y-4">
          {/* ROLE */}
          <div className="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800/80">
            <div className="text-[11px] uppercase font-bold text-teal-400 tracking-wider mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              ROLE
            </div>
            <div className="text-xs text-slate-200 font-mono">
              {activePrompt.role}
            </div>
          </div>

          {/* CONTEXT */}
          <div className="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800/80">
            <div className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              CONTEXT
            </div>
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap m-0">
              {activePrompt.context}
            </pre>
          </div>

          {/* TASK */}
          <div className="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800/80">
            <div className="text-[11px] uppercase font-bold text-blue-400 tracking-wider mb-1 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              TASK
            </div>
            <div className="text-xs text-slate-200 font-mono">
              {activePrompt.task}
            </div>
          </div>

          {/* CONSTRAINTS */}
          <div className="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800/80">
            <div className="text-[11px] uppercase font-bold text-amber-400 tracking-wider mb-1 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5" />
              CONSTRAINTS
            </div>
            <pre className="text-xs text-amber-200/90 font-mono whitespace-pre-wrap m-0">
              {activePrompt.constraints}
            </pre>
          </div>

          {/* OUTPUT FORMAT */}
          <div className="bg-slate-900/70 rounded-lg p-3.5 border border-slate-800/80">
            <div className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider mb-1 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              OUTPUT FORMAT
            </div>
            <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap m-0">
              {activePrompt.output_format}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
