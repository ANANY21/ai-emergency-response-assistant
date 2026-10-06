import React from 'react';
import { Scissors, Flame, Droplet, Activity, Wind, Sparkles } from 'lucide-react';

const SCENARIOS = [
  {
    id: "cut",
    title: "1. Minor Cut",
    type: "Cut",
    priority: "Low",
    priorityColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    text: "A person has a small superficial cut on their finger.",
    icon: Scissors,
  },
  {
    id: "burn",
    title: "2. Burn",
    type: "Burn",
    priority: "Moderate",
    priorityColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    text: "A person accidentally touched a hot pan and has a painful red area on their hand.",
    icon: Flame,
  },
  {
    id: "bleeding",
    title: "3. Heavy Bleeding",
    type: "Bleeding",
    priority: "High",
    priorityColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    text: "A person has a deep wound on their arm and is bleeding heavily.",
    icon: Droplet,
  },
  {
    id: "injury",
    title: "4. Injury",
    type: "Injury",
    priority: "High",
    priorityColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    text: "A person fell from a bike and has severe pain and swelling in their arm.",
    icon: Activity,
  },
  {
    id: "breathing",
    title: "5. Breathing Emergency",
    type: "Breathing",
    priority: "Critical",
    priorityColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    text: "A person is experiencing severe difficulty breathing.",
    icon: Wind,
  },
];

export default function DemonstrationScenarios({ onSelectScenario, activeText }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 m-0">
            Demonstration Scenarios (Try Examples)
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Click any scenario to load into analyzer
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SCENARIOS.map((item) => {
          const Icon = item.icon;
          const isSelected = activeText === item.text;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScenario(item.text)}
              className={`text-left p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 text-teal-400 transition">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${item.priorityColor}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mb-1 group-hover:text-teal-300 transition">
                  {item.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  "{item.text}"
                </p>
              </div>
              <div className="mt-2 text-[10px] text-teal-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Load scenario &rarr;
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
