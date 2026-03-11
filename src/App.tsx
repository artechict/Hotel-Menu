import React, { useState, useEffect } from 'react';
import { 
  Settings, Globe, Sun, Moon, Home as HomeIcon, Utensils, Coffee, Shirt, Info, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { AppData } from './types';
import { initialMockData } from './mockData';

// Modular Components & Utils
import { UI_STRINGS, getTranslated, Language } from './utils/translation';
import { NavBtn } from './components/Navigation';
import { HomeGrid } from './components/HomeGrid';
import { InfoSection } from './components/InfoSection';
import { MenuSection } from './components/MenuSection';
import { AdminSection } from './components/AdminSection';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [settings, setSettings] = useState<{ hotel_name: string, logo_url: string } | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const t = (UI_STRINGS as any)[lang];
  const [activeTab, setActiveTab] = useState<'home' | 'restaurant' | 'cafe' | 'laundry' | 'info' | 'admin'>('home');
  const [history, setHistory] = useState<typeof activeTab[]>(['home']);

  const navigateTo = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setHistory(prev => [...prev, tab]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setActiveTab(newHistory[newHistory.length - 1]);
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase is not configured. Using mock data.");
      setData({ 
        menus: initialMockData.menus, 
        categories: initialMockData.categories, 
        items: initialMockData.items, 
        info: initialMockData.info, 
        phones: initialMockData.phones 
      });
      setSettings(initialMockData.settings);
      setLoading(false);
      return;
    }
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      const { data: infoData, error: infoError } = await supabase.from('info').select('*');
      if (infoError) throw infoError;

      const { data: phonesData, error: phonesError } = await supabase.from('phones').select('*');
      if (phonesError) throw phonesError;

      const { data: menusData, error: menusError } = await supabase.from('menus').select('*');
      if (menusError) throw menusError;

      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*');
      if (categoriesError) throw categoriesError;

      const { data: itemsData, error: itemsError } = await supabase.from('items').select('*');
      if (itemsError) throw itemsError;

      if (settingsData) {
        setSettings({ hotel_name: settingsData.hotel_name, logo_url: settingsData.logo_url });
        setData({
          menus: menusData || [],
          categories: categoriesData || [],
          items: itemsData || [],
          info: infoData || [],
          phones: phonesData || []
        });
      } else {
        setSettings(initialMockData.settings);
        setData({
          menus: initialMockData.menus,
          categories: initialMockData.categories,
          items: initialMockData.items,
          info: initialMockData.info,
          phones: initialMockData.phones
        });
      }
    } catch (e) {
      console.error("Error fetching from Supabase:", e);
      setData({ 
        menus: initialMockData.menus, 
        categories: initialMockData.categories, 
        items: initialMockData.items, 
        info: initialMockData.info, 
        phones: initialMockData.phones 
      });
      setSettings(initialMockData.settings);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!confirm("This will RESET the database and seed it with initial data. ALL existing data will be deleted. Continue?")) return;
    setLoading(true);
    try {
      await supabase.from('items').delete().neq('id', 0);
      await supabase.from('categories').delete().neq('id', 0);
      await supabase.from('menus').delete().neq('id', 0);
      await supabase.from('phones').delete().neq('id', 0);
      await supabase.from('info').delete().neq('id', 0);
      
      await supabase.from('settings').upsert({ id: 1, ...initialMockData.settings });
      
      for (const item of initialMockData.info) {
        await supabase.from('info').insert({ key: item.key, label: item.label, value: item.value });
      }

      for (const phone of initialMockData.phones) {
        const { id, ...rest } = phone;
        await supabase.from('phones').insert(rest);
      }

      for (const menu of initialMockData.menus) {
        const { id, ...rest } = menu;
        const { data: newMenu } = await supabase.from('menus').insert(rest).select().single();
        
        if (newMenu) {
          const menuCats = initialMockData.categories.filter(c => c.menu_id === id);
          for (const cat of menuCats) {
            const { id: oldCatId, menu_id, ...catRest } = cat;
            const { data: newCat } = await supabase.from('categories').insert({ ...catRest, menu_id: newMenu.id }).select().single();
            
            if (newCat) {
              const catItems = initialMockData.items.filter(i => i.category_id === oldCatId);
              for (const item of catItems) {
                const { id: oldItemId, category_id, ...itemRest } = item;
                await supabase.from('items').insert({ ...itemRest, category_id: newCat.id });
              }
            }
          }
        }
      }
      
      alert("Database reset and seeded successfully!");
      fetchData();
    } catch (e) {
      console.error("Error seeding database:", e);
      alert("Error seeding database.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="blob w-[300px] h-[300px] bg-emerald-500/30 top-1/4 left-1/4 animate-pulse" />
        <div className="blob w-[300px] h-[300px] bg-blue-500/20 bottom-1/4 right-1/4 animate-pulse" />
      </div>
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl shadow-emerald-500/50 z-10" />
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 relative text-zinc-900 dark:text-zinc-100`}>
      {/* Atmospheric Background */}
      <div className={`atmospheric-bg transition-colors duration-500 ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-zinc-50'}`}>
        <div className="blob w-[600px] h-[600px] -top-24 -left-24 animate-[pulse_8s_infinite]" />
        <div className="blob w-[500px] h-[500px] top-1/2 -right-24 animate-[pulse_10s_infinite]" />
        <div className="blob w-[400px] h-[400px] -bottom-24 left-1/4 animate-[pulse_12s_infinite]" />
      </div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-2xl border-b border-zinc-200 dark:border-white/5 px-6 py-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {activeTab !== 'home' && (
              <button onClick={goBack} className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
              <img src={settings?.logo_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{settings?.hotel_name}</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">{t.welcome}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex items-center group">
              <Globe size={14} className="absolute left-3 text-zinc-400 group-hover:text-emerald-500 transition-colors pointer-events-none" />
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value as Language)} 
                className="pl-8 pr-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all appearance-none cursor-pointer border border-transparent hover:border-emerald-500/30 outline-none"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="tr">Türkçe</option>
                <option value="ku">کوردی</option>
              </select>
            </div>
            
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-500/30">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button onClick={() => navigateTo('admin')} className={`p-2.5 rounded-xl transition-all border border-transparent ${activeTab === 'admin' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/30'}`}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeGrid navigateTo={navigateTo} t={t} settings={settings} />}
          {activeTab === 'info' && <InfoSection info={data?.info || []} phones={data?.phones || []} t={t} />}
          {(activeTab === 'restaurant' || activeTab === 'cafe' || activeTab === 'laundry') && (
            <MenuSection type={activeTab} categories={data?.categories.filter(c => c.type === activeTab) || []} items={data?.items || []} t={t} lang={lang} />
          )}
          {activeTab === 'admin' && (
            <AdminSection 
              isAdmin={isAdmin} 
              onLogin={(p: string) => { if(p === 'admin123') setIsAdmin(true); else alert('Wrong password'); }} 
              data={data} 
              refresh={fetchData} 
              t={t} 
              settings={settings} 
              seedDatabase={seedDatabase} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modern Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 md:hidden bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-3xl px-4 py-3 flex justify-around items-center z-50 shadow-2xl transition-colors duration-300">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon size={20} />} label={t.home} />
        <NavBtn active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Info size={20} />} label={t.info} />
        <NavBtn active={activeTab === 'restaurant'} onClick={() => setActiveTab('restaurant')} icon={<Utensils size={20} />} label={t.restaurant} />
        <NavBtn active={activeTab === 'cafe'} onClick={() => setActiveTab('cafe')} icon={<Coffee size={20} />} label={t.cafe} />
        <NavBtn active={activeTab === 'laundry'} onClick={() => setActiveTab('laundry')} icon={<Shirt size={20} />} label={t.laundry} />
      </nav>
    </div>
  );
}
