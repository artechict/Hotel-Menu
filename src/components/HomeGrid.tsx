import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Coffee, Shirt, Phone, Info } from 'lucide-react';

interface HomeGridProps {
  navigateTo: (tab: string) => void;
  t: any;
  settings: any;
}

export function HomeGrid({ navigateTo, t, settings }: HomeGridProps) {
  const cards = [
    { id: 'restaurant', icon: <Utensils size={32} />, label: t.restaurant, image: settings?.tile_images?.restaurant || "https://picsum.photos/seed/gourmet-dinner-table/400/400", delay: 0.1 },
    { id: 'cafe', icon: <Coffee size={32} />, label: t.cafe, image: settings?.tile_images?.cafe || "https://picsum.photos/seed/coffee-shop-interior/400/400", delay: 0.2 },
    { id: 'laundry', icon: <Shirt size={32} />, label: t.laundry, image: settings?.tile_images?.laundry || "https://picsum.photos/seed/folded-clothes-laundry/400/400", delay: 0.3 },
    { id: 'phones', icon: <Phone size={32} />, label: t.contact, image: settings?.tile_images?.phones || "https://picsum.photos/seed/hotel-concierge-phone/400/400", delay: 0.4 },
    { id: 'info', icon: <Info size={32} />, label: t.info, image: settings?.tile_images?.info || "https://picsum.photos/seed/hotel-reception-desk/400/400", delay: 0.5 },
  ];

  return (
    <div className="space-y-12 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center space-y-4"
      >
        <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl mb-4">
          <img src={settings?.logo_url || "https://picsum.photos/seed/hotel/200/200"} className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] object-cover shadow-inner" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
          {settings?.hotel_name || t.hotelName}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-widest uppercase text-xs md:text-sm">
          {t.welcome} • Premium Guest Services
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: card.delay }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigateTo(card.id)}
            className={`relative overflow-hidden p-8 rounded-[2.5rem] text-left group h-48 md:h-64 flex flex-col justify-between transition-all shadow-xl hover:shadow-2xl ${card.id === 'info' ? 'col-span-1 md:col-span-1' : ''}`}
          >
            <img src={card.image} alt={card.label} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10 p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit shadow-lg border border-white/20 text-white">
              {card.icon}
            </div>
            
            <div className="relative z-10">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-1">Service</span>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-none">{card.label}</h3>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
