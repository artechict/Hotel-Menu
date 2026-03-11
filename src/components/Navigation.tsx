import React from 'react';

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function NavBtn({ active, onClick, icon, label }: NavBtnProps) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 transition-all relative ${active ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-800'}`}>
      <div className={`p-1.5 rounded-lg transition-all ${active ? 'bg-emerald-500/10' : ''}`}>{icon}</div>
      <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

interface SubNavBtnProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export function SubNavBtn({ active, onClick, label }: SubNavBtnProps) {
  return (
    <button onClick={onClick} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>
      {label}
    </button>
  );
}
