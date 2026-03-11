import React, { useState, useEffect } from 'react';
import { 
  Settings, Globe, Home as HomeIcon, Utensils, Coffee, Shirt, Info, ChevronLeft
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { AppData, HotelSettings } from './types';
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
  const [settings, setSettings] = useState<HotelSettings | null>(null);
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

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

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
        const tileImagesInfo = infoData?.find(i => i.key === 'tile_images');
        const tileImages = tileImagesInfo ? JSON.parse(tileImagesInfo.value) : { info: '', restaurant: '', cafe: '', laundry: '', phones: '' };
        
        setSettings({ 
          ...settingsData, 
          tile_images: tileImages 
        } as HotelSettings);
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {activeTab !== 'home' && (
              <button onClick={goBack} className="p-3 rounded-2xl bg-zinc-100 text-zinc-600 hover:text-emerald-500 transition-all">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
              <img src={settings?.logo_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{settings?.hotel_name}</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{t.welcome}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Globe size={14} className="absolute left-3 text-zinc-400 pointer-events-none" />
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value as Language)} 
                className="pl-8 pr-3 py-2 rounded-xl bg-zinc-100 text-[11px] font-bold text-zinc-600 appearance-none cursor-pointer border border-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="tr">Türkçe</option>
                <option value="ku">کوردی</option>
              </select>
            </div>
            
            <button onClick={() => navigateTo('admin')} className={`p-2.5 rounded-xl transition-all border border-transparent ${activeTab === 'admin' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-zinc-100 text-zinc-600 hover:text-emerald-500'}`}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 pb-32">
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
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 md:hidden bg-white border border-zinc-200 rounded-3xl px-4 py-3 flex justify-around items-center z-50 shadow-lg">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon size={20} />} label={t.home} />
        <NavBtn active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Info size={20} />} label={t.info} />
        <NavBtn active={activeTab === 'restaurant'} onClick={() => setActiveTab('restaurant')} icon={<Utensils size={20} />} label={t.restaurant} />
        <NavBtn active={activeTab === 'cafe'} onClick={() => setActiveTab('cafe')} icon={<Coffee size={20} />} label={t.cafe} />
        <NavBtn active={activeTab === 'laundry'} onClick={() => setActiveTab('laundry')} icon={<Shirt size={20} />} label={t.laundry} />
      </nav>
    </div>
  );
}
