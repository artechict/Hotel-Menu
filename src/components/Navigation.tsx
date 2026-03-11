import React from 'react';
import { motion } from 'motion/react';

interface NavBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function NavBtn({ active, onClick, icon, label }: NavBtnProps) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all relative ${active ? 'text-emerald-500' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}>
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-emerald-500/10' : ''}`}>{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {active && <motion.div layoutId="nav-pill" className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full" />}
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
    <button onClick={onClick} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'}`}>
      {label}
    </button>
  );
}
