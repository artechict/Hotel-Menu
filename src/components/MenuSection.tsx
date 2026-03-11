import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, LayoutGrid, List, X } from 'lucide-react';
import { Category, MenuItem } from '../types';
import { getTranslated } from '../utils/translation';

interface MenuSectionProps {
  type: string;
  categories: Category[];
  items: MenuItem[];
  t: any;
  lang: string;
}

export function MenuSection({ type, categories, items, t, lang }: MenuSectionProps) {
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLaundry = type === 'laundry';

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0 && activeCatId === null) {
      setActiveCatId(categories[0].id);
    }
    
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories, activeCatId, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const activeCategory = categories.find((c: any) => c.id === activeCatId);
  const filteredItems = items.filter((i: any) => i.category_id === activeCatId);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{t[type]}</h2>
        {!isLaundry && (
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow' : ''}`}><List size={18} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow' : ''}`}><LayoutGrid size={18} /></button>
          </div>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-zinc-400 dark:text-zinc-600 font-medium">{t.noItems}</div>
      ) : (
        <div className="space-y-8">
          {/* Categories Tabs */}
          <div className="flex items-center gap-2 group/scroll relative">
            {showLeftArrow && (
              <button onClick={() => scroll('left')} className="shrink-0 p-2 bg-white dark:bg-zinc-900 rounded-full shadow-md border border-zinc-200 dark:border-white/10 transition-all hidden md:block z-10"><ChevronLeft size={20} /></button>
            )}
            
            <div ref={scrollRef} onScroll={checkScroll} className="flex-1 flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2 scroll-smooth">
              {categories.map((cat: any) => (
                <button key={cat.id} onClick={() => setActiveCatId(cat.id)} className={`flex flex-col items-center gap-3 shrink-0 transition-all ${activeCatId === cat.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeCatId === cat.id ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-transparent'}`}>
                    <img src={cat.image_url || `https://picsum.photos/seed/${cat.id}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${activeCatId === cat.id ? 'text-emerald-500' : 'text-zinc-500'}`}>{getTranslated(cat, 'name', lang)}</span>
                </button>
              ))}
            </div>

            {showRightArrow && (
              <button onClick={() => scroll('right')} className="shrink-0 p-2 bg-white dark:bg-zinc-900 rounded-full shadow-md border border-zinc-200 dark:border-white/10 transition-all hidden md:block z-10"><ChevronRight size={20} /></button>
            )}
          </div>

          {/* Active Category Items */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-8 bg-emerald-500 rounded-full" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{getTranslated(activeCategory, 'name', lang)}</h3>
            </div>
            
            <div className={isLaundry ? "space-y-2" : (viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "grid gap-6")}>
              {filteredItems.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 dark:text-zinc-600 italic">No items in this category yet.</div>
              ) : (
                filteredItems.map((item: any) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }} 
                    key={item.id} 
                    className={isLaundry 
                      ? "p-4 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-2xl flex justify-between items-center"
                      : `bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden flex flex-col group transition-all hover:bg-white/80 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-white/10 shadow-sm ${viewMode === 'list' ? 'sm:flex-row' : ''}`
                    }
                  >
                    {isLaundry ? (
                      <>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{getTranslated(item, 'name', lang)}</h4>
                        <span className="text-emerald-600 dark:text-emerald-400 font-black">{item.price}</span>
                      </>
                    ) : (
                      <>
                        <div className={`${viewMode === 'list' ? 'w-24 sm:w-40 h-24 sm:h-40' : 'w-full h-48'} shrink-0 overflow-hidden cursor-pointer`} onClick={() => setZoomedImage(item.image_url || `https://picsum.photos/seed/${item.id}/600/600`)}>
                          <img src={item.image_url || `https://picsum.photos/seed/${item.id}/300/300`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col justify-between flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{getTranslated(item, 'name', lang)}</h4>
                            <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-lg shrink-0">{item.price}</span>
                          </div>
                          {viewMode === 'list' && <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed line-clamp-2">{getTranslated(item, 'description', lang)}</p>}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {zoomedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setZoomedImage(null)}>
            <button className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white"><X size={24} /></button>
            <img src={zoomedImage} className="max-w-full max-h-full rounded-2xl" referrerPolicy="no-referrer" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
