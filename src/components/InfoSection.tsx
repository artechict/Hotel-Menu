import React from 'react';
import { Clock, Info as InfoIcon, Phone } from 'lucide-react';
import { HotelInfo, PhoneNumber } from '../types';

interface InfoSectionProps {
  info: HotelInfo[];
  phones: PhoneNumber[];
  t: any;
}

export function InfoSection({ info, phones, t }: InfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">{t.workingHours}</h2>
        </div>
        <div className="grid gap-4">
          {info.map((item) => (
            <div key={item.key} className="p-4 md:p-6 bg-white border border-zinc-200 rounded-3xl flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                {item.label.toLowerCase().includes('hour') ? <Clock size={24} /> : <InfoIcon size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">{item.label}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-8 bg-zinc-400 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">{t.internalPhones}</h2>
        </div>
        <div className="p-8 bg-zinc-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="grid grid-cols-1 gap-8 relative z-10">
            {phones.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-zinc-400 font-medium">{p.name}</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tighter">{p.number}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="p-2 bg-emerald-500 rounded-lg"><Phone size={18} /></div>
            <p className="text-xs text-zinc-400 font-medium">{t.callInstruction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
