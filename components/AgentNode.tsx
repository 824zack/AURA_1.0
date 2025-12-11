import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AgentNodeProps {
  name: string;
  icon: LucideIcon;
  isActive: boolean;
  desc: string;
  color: 'blue' | 'purple' | 'yellow' | 'green' | 'orange';
  isMaster?: boolean;
}

export const AgentNode: React.FC<AgentNodeProps> = ({ name, icon: Icon, isActive, desc, color, isMaster = false }) => {
  // Dynamic color classes
  const colors = {
    blue: { border: 'border-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]', text: 'text-blue-400', bg: 'bg-blue-400' },
    purple: { border: 'border-purple-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]', text: 'text-purple-400', bg: 'bg-purple-400' },
    yellow: { border: 'border-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]', text: 'text-yellow-400', bg: 'bg-yellow-400' },
    green: { border: 'border-green-500', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]', text: 'text-green-400', bg: 'bg-green-400' },
    orange: { border: 'border-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]', text: 'text-orange-400', bg: 'bg-orange-400' },
  };

  const style = colors[color] || colors.blue;

  return (
    <div className={`
            relative p-3 rounded-lg border bg-[#0f172a] transition-all duration-300
            ${isActive ? `${style.border} ${style.glow} scale-105 z-10 opacity-100` : 'border-slate-800 opacity-20 hover:opacity-40 grayscale'}
            ${isMaster ? 'w-full' : ''}
        `}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded bg-slate-800 ${isActive ? style.text : 'text-slate-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{name}</h3>
          <p className="text-[10px] text-slate-500 leading-tight mt-1">{desc}</p>
        </div>
      </div>
      {isActive && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <span className={`w-1.5 h-1.5 rounded-full ${style.bg} animate-ping`}></span>
        </div>
      )}
    </div>
  );
};
