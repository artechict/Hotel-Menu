import React from 'react';
import { Clock, Info as InfoIcon, Phone } from 'lucide-react';
import { HotelInfo, PhoneNumber } from '../types';

interface InfoSectionProps {
  info: HotelInfo[];
  phones: PhoneNumber[];
  t: any;
}

export const InfoSection = React.memo(function InfoSection({ info, phones, t }: InfoSectionProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Working Hours */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-emerald-500 rounded-full" />
          <h2 className="text-lg font-black text-zinc-900">{t.workingHours}</h2>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {info.filter(item => item.label !== 'Tile Images').map((item) => (
            <div key={item.key} className="p-3 bg-white border border-zinc-100 rounded-xl flex items-start gap-3 shadow-sm">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 shrink-0">
                {item.label.toLowerCase().includes('hour') ? <Clock size={16} /> : <InfoIcon size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-zinc-900 text-xs">{item.label}</h3>
                <p className="text-[11px] text-zinc-500 break-words">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Phones */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-zinc-400 rounded-full" />
          <h2 className="text-lg font-black text-zinc-900">{t.internalPhones}</h2>
        </div>
        <div className="p-4 bg-zinc-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 gap-2 relative z-10">
            {phones.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-zinc-400 font-medium text-xs truncate mr-2">{p.name}</span>
                <span className="text-sm font-black text-emerald-400 shrink-0">{p.number}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
            <div className="p-1 bg-emerald-500 rounded-md shrink-0"><Phone size={12} /></div>
            <p className="text-[9px] text-zinc-400">{t.callInstruction}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
