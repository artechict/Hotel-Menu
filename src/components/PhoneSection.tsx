import React from 'react';
import { motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { PhoneNumber } from '../types';

interface PhoneSectionProps {
  phones: PhoneNumber[];
  t: any;
}

export function PhoneSection({ phones, t }: PhoneSectionProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{t.contact}</h2>
        <p className="text-zinc-500 dark:text-zinc-500 text-sm">{t.callInstruction}</p>
      </div>
      <div className="grid gap-4">
        {phones.map((p) => (
          <a key={p.id} href={`tel:${p.number}`} className="p-6 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-3xl flex items-center justify-between group hover:bg-emerald-500 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-white transition-colors">{p.name}</span>
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors tracking-tighter">{p.number}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
