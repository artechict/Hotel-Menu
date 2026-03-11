import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, Coffee, Shirt, Info, Phone, Settings, Plus, Trash2, 
  Clock, Globe, LogOut, Save, Image as ImageIcon, ChevronLeft, ChevronRight,
  Sun, Moon, Home as HomeIcon, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { AppData, Category, MenuItem, HotelInfo, PhoneNumber } from './types';
import { initialMockData } from './mockData';

type Language = 'en' | 'ar' | 'tr' | 'ku';

const UI_STRINGS = {
  en: {
    hotelName: 'Royal Hotel', welcome: 'Welcome', info: 'Info', restaurant: 'Restaurant', cafe: 'Cafe', laundry: 'Laundry', contact: 'Contact', admin: 'Admin', home: 'Home',
    login: 'Admin Login', password: 'Password', enter: 'Login', logout: 'Logout', workingHours: 'Working Hours & Info', internalPhones: 'Internal Phones',
    noItems: 'No items to display.', callInstruction: 'To call from your room, dial the numbers above.',
    adminTitle: 'Professional Admin Panel', hotelSettings: 'Hotel Settings', catMgmt: 'Category Management', itemMgmt: 'Menu Management', phoneMgmt: 'Contact Management',
    add: 'Add', delete: 'Delete', save: 'Save', name: 'Name', desc: 'Description', price: 'Price', imageUrl: 'Image URL', type: 'Type',
    catName: 'Category Name', itemName: 'Item Name', phoneName: 'Section Name', phoneNumber: 'Number', selectCat: 'Select Category...',
  },
  ar: {
    hotelName: 'فندق رويال', welcome: 'أهلاً بك', info: 'معلومات', restaurant: 'مطعم', cafe: 'مقهى', laundry: 'مغسلة', contact: 'اتصل بنا', admin: 'مدير', home: 'الرئيسية',
    login: 'تسجيل دخول المدير', password: 'كلمة المرور', enter: 'دخول', logout: 'خروج', workingHours: 'ساعات العمل ومعلومات', internalPhones: 'هواتف داخلية',
    noItems: 'لا توجد عناصر لعرضها.', callInstruction: 'للاتصال من غرفتك، اطلب الأرقام أعلاه.',
    adminTitle: 'لوحة تحكم المدير', hotelSettings: 'إعدادات الفندق', catMgmt: 'إدارة الفئات', itemMgmt: 'إدارة القائمة', phoneMgmt: 'إدارة جهات الاتصال',
    add: 'إضافة', delete: 'حذف', save: 'حفظ', name: 'الاسم', desc: 'الوصف', price: 'السعر', imageUrl: 'رابط الصورة', type: 'النوع',
    catName: 'اسم الفئة', itemName: 'اسم العنصر', phoneName: 'اسم القسم', phoneNumber: 'الرقم', selectCat: 'اختر فئة...',
  },
  tr: {
    hotelName: 'Royal Otel', welcome: 'Hoş Geldiniz', info: 'Bilgi', restaurant: 'Restoran', cafe: 'Kafe', laundry: 'Çamaşırhane', contact: 'İletişim', admin: 'Yönetici', home: 'Ana Sayfa',
    login: 'Yönetici Girişi', password: 'Şifre', enter: 'Giriş', logout: 'Çıkış', workingHours: 'Çalışma Saatleri & Bilgi', internalPhones: 'Dahili Telefonlar',
    noItems: 'Görüntülenecek öğe yok.', callInstruction: 'Odanızdan aramak için yukarıdaki numaraları tuşlayın.',
    adminTitle: 'Profesyonel Yönetici Paneli', hotelSettings: 'Otel Ayarları', catMgmt: 'Kategori Yönetimi', itemMgmt: 'Menü Yönetimi', phoneMgmt: 'İletişim Yönetimi',
    add: 'Ekle', delete: 'Sil', save: 'Kaydet', name: 'İsim', desc: 'Açıklama', price: 'Fiyat', imageUrl: 'Resim URL', type: 'Tür',
    catName: 'Kategori Adı', itemName: 'Öğe Adı', phoneName: 'Bölüm Adı', phoneNumber: 'Numara', selectCat: 'Kategori Seç...',
  },
  ku: {
    hotelName: 'Royal Hotel', welcome: 'Bi xêr hatî', info: 'Agahî', restaurant: 'Restoran', cafe: 'Kafe', laundry: 'Cilşo', contact: 'Têkilî', admin: 'Rêveber', home: 'Malper',
    login: 'Têketina Rêveber', password: 'Şîfre', enter: 'Têketin', logout: 'Derketin', workingHours: 'Demjimêrên Kar & Agahî', internalPhones: 'Telefonên Navxweyî',
    noItems: 'Ti tişt ji bo nîşandanê tune.', callInstruction: 'Ji bo gazîkirinê ji odeya xwe, hejmarên li jor lêxin.',
    adminTitle: 'Panela Rêveberiya Pîşeyî', hotelSettings: 'Mîhengên Otêlê', catMgmt: 'Rêveberiya Kategoriyan', itemMgmt: 'Rêveberiya Menûyê', phoneMgmt: 'Rêveberiya Têkiliyan',
    add: 'Zêde bike', delete: 'Jê bibe', save: 'Tomar bike', name: 'Nav', desc: 'Danasîn', price: 'Biha', imageUrl: 'URL-ya Wêne', type: 'Cure',
    catName: 'Navê Kategoriyê', itemName: 'Navê Tiştê', phoneName: 'Navê Beşê', phoneNumber: 'Hejmar', selectCat: 'Kategorî hilbijêre...',
  }
};

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [settings, setSettings] = useState<{ hotel_name: string, logo_url: string } | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const t = UI_STRINGS[lang];
  const [activeTab, setActiveTab] = useState<'home' | 'restaurant' | 'cafe' | 'laundry' | 'info' | 'phones' | 'admin'>('home');
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
      setData({ menus: initialMockData.menus, categories: initialMockData.categories, items: initialMockData.items, info: initialMockData.info, phones: initialMockData.phones });
      setSettings(initialMockData.settings);
      setLoading(false);
      return;
    }
    try {
      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      // Fetch info
      const { data: infoData, error: infoError } = await supabase
        .from('info')
        .select('*');
      
      if (infoError) throw infoError;

      // Fetch phones
      const { data: phonesData, error: phonesError } = await supabase
        .from('phones')
        .select('*');
      
      if (phonesError) throw phonesError;

      // Fetch menus
      const { data: menusData, error: menusError } = await supabase
        .from('menus')
        .select('*');
      
      if (menusError) throw menusError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;

      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');
      
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
        // If no settings, database might be empty
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
      // Fallback to mock data if Supabase fails
      setData({ menus: initialMockData.menus, categories: initialMockData.categories, items: initialMockData.items, info: initialMockData.info, phones: initialMockData.phones });
      setSettings(initialMockData.settings);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!confirm("This will seed the database with initial data. Existing data might be duplicated or overwritten. Continue?")) return;
    setLoading(true);
    try {
      // Seed settings
      await supabase.from('settings').upsert({ id: 1, ...initialMockData.settings });
      
      // Seed info
      for (const item of initialMockData.info) {
        await supabase.from('info').upsert({ key: item.key, label: item.label, value: item.value });
      }

      // Seed phones
      for (const phone of initialMockData.phones) {
        const { id, ...rest } = phone;
        await supabase.from('phones').insert(rest);
      }

      // Seed menus
      for (const menu of initialMockData.menus) {
        const { id, ...rest } = menu;
        const { data: newMenu } = await supabase.from('menus').insert(rest).select().single();
        
        if (newMenu) {
          // Seed categories for this menu
          const menuCats = initialMockData.categories.filter(c => c.menu_id === id);
          for (const cat of menuCats) {
            const { id: oldCatId, menu_id, ...catRest } = cat;
            const { data: newCat } = await supabase.from('categories').insert({ ...catRest, menu_id: newMenu.id }).select().single();
            
            if (newCat) {
              // Seed items for this category
              const catItems = initialMockData.items.filter(i => i.category_id === oldCatId);
              for (const item of catItems) {
                const { id: oldItemId, category_id, ...itemRest } = item;
                await supabase.from('items').insert({ ...itemRest, category_id: newCat.id });
              }
            }
          }
        }
      }
      
      alert("Database seeded successfully!");
      fetchData();
    } catch (e) {
      console.error("Error seeding database:", e);
      alert("Error seeding database. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl shadow-emerald-500/50" />
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-200 dark:border-white/5 px-6 py-4 transition-colors duration-300">
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
            <select value={lang} onChange={e => setLang(e.target.value as Language)} className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all">
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="tr">TR</option>
              <option value="ku">KU</option>
            </select>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button onClick={() => navigateTo('admin')} className={`p-3 rounded-2xl transition-all ${activeTab === 'admin' ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500'}`}>
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeGrid key="home" navigateTo={navigateTo} t={t} settings={settings} />}
          {activeTab === 'info' && <InfoSection key="info" info={data?.info || []} phones={data?.phones || []} t={t} />}
          {(activeTab === 'restaurant' || activeTab === 'cafe' || activeTab === 'laundry') && (
            <MenuSection key={activeTab} type={activeTab} categories={data?.categories.filter(c => c.type === activeTab) || []} items={data?.items || []} t={t} />
          )}
          {activeTab === 'phones' && <PhoneSection key="phones" phones={data?.phones || []} t={t} />}
          {activeTab === 'admin' && <AdminSection key="admin" isAdmin={isAdmin} onLogin={(p: string) => { if(p === 'admin123') setIsAdmin(true); else alert('Wrong password'); }} data={data} refresh={fetchData} t={t} settings={settings} seedDatabase={seedDatabase} />}
        </AnimatePresence>
      </main>

      {/* Modern Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 md:hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-3xl px-4 py-3 flex justify-around items-center z-50 shadow-2xl transition-colors duration-300">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<HomeIcon size={20} />} label={t.home} />
        <NavBtn active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<Info size={20} />} label={t.info} />
        <NavBtn active={activeTab === 'restaurant'} onClick={() => setActiveTab('restaurant')} icon={<Utensils size={20} />} label={t.restaurant} />
        <NavBtn active={activeTab === 'cafe'} onClick={() => setActiveTab('cafe')} icon={<Coffee size={20} />} label={t.cafe} />
        <NavBtn active={activeTab === 'laundry'} onClick={() => setActiveTab('laundry')} icon={<Shirt size={20} />} label={t.laundry} />
        <NavBtn active={activeTab === 'phones'} onClick={() => setActiveTab('phones')} icon={<Phone size={20} />} label={t.contact} />
      </nav>
    </div>
  );
}

function HomeGrid({ navigateTo, t, settings }: any) {
  const tiles = [
    { id: 'info', icon: <Info size={32} />, label: t.info, color: 'from-blue-500 to-blue-600', img: settings?.tile_images?.info || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
    { id: 'restaurant', icon: <Utensils size={32} />, label: t.restaurant, color: 'from-orange-500 to-orange-600', img: settings?.tile_images?.restaurant || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' },
    { id: 'cafe', icon: <Coffee size={32} />, label: t.cafe, color: 'from-amber-500 to-amber-600', img: settings?.tile_images?.cafe || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' },
    { id: 'laundry', icon: <Shirt size={32} />, label: t.laundry, color: 'from-indigo-500 to-indigo-600', img: settings?.tile_images?.laundry || 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80' },
    { id: 'phones', icon: <Phone size={32} />, label: t.contact, color: 'from-emerald-500 to-emerald-600', img: settings?.tile_images?.phones || 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {tiles.map((tile) => (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          key={tile.id}
          onClick={() => navigateTo(tile.id as any)}
          className="relative h-48 rounded-[2.5rem] overflow-hidden group shadow-lg"
        >
          <img src={tile.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-60 group-hover:opacity-40 transition-opacity`} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <div className="mb-3 p-3 bg-white/20 backdrop-blur-md rounded-2xl">{tile.icon}</div>
            <span className="text-xl font-black tracking-tight uppercase">{tile.label}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all relative ${active ? 'text-emerald-500' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}>
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-emerald-500/10' : ''}`}>{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {active && <motion.div layoutId="nav-pill" className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full" />}
    </button>
  );
}

function InfoSection({ info, phones, t }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <div className="relative h-48 rounded-3xl overflow-hidden group shadow-xl">
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute bottom-6 right-6 left-6">
          <h2 className="text-2xl font-bold text-white">{t.workingHours}</h2>
        </div>
      </div>

      <div className="grid gap-4">
        {info.map((item: any) => (
          <div key={item.key} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">{item.label}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MenuSection({ type, categories, items, t }: any) {
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categories.length > 0 && activeCatId === null) {
      setActiveCatId(categories[0].id);
    }
  }, [categories, activeCatId]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const activeCategory = categories.find((c: any) => c.id === activeCatId);
  const filteredItems = items.filter((i: any) => i.category_id === activeCatId);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{t[type]}</h2>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10 mx-6" />
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 text-zinc-400 dark:text-zinc-600 font-medium">{t.noItems}</div>
      ) : (
        <div className="space-y-8">
          {/* Categories Tabs */}
          <div className="relative group/scroll">
            <button 
              onClick={() => scroll('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-lg border border-zinc-200 dark:border-white/10 opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2 scroll-smooth"
            >
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCatId(cat.id)}
                  className={`flex flex-col items-center gap-3 shrink-0 transition-all ${activeCatId === cat.id ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeCatId === cat.id ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-transparent'}`}>
                    <img src={cat.image_url || `https://picsum.photos/seed/${cat.id}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${activeCatId === cat.id ? 'text-emerald-500' : 'text-zinc-500'}`}>{cat.name}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-lg border border-zinc-200 dark:border-white/10 opacity-0 group-hover/scroll:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Active Category Items */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-8 bg-emerald-500 rounded-full" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{activeCategory?.name}</h3>
            </div>
            
            <div className="grid gap-6">
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
                    className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden flex flex-col sm:flex-row group transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-white/10 shadow-sm"
                  >
                    <div className="w-full sm:w-40 h-40 shrink-0 overflow-hidden">
                      <img src={item.image_url || `https://picsum.photos/seed/${item.id}/300/300`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                          <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">{item.price}</span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PhoneSection({ phones, t }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
      <h2 className="text-3xl font-black px-2 text-zinc-900 dark:text-zinc-100">{t.contact}</h2>
      <div className="grid gap-4">
        {phones.map((p: any) => (
          <div key={p.id} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 border border-zinc-200 dark:border-white/5 transition-all">
                <Phone size={24} />
              </div>
              <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{p.name}</span>
            </div>
            <span className="text-3xl font-black font-mono tracking-[0.2em] text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{p.number}</span>
          </div>
        ))}
      </div>
      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl text-center">
        <p className="text-emerald-600 dark:text-emerald-400/80 text-sm font-medium leading-relaxed">{t.callInstruction}</p>
      </div>
    </motion.div>
  );
}

function AdminSection({ isAdmin, onLogin, data, refresh, t, settings, seedDatabase }: any) {
  const [pass, setPass] = useState('');
  const [activeSub, setActiveSub] = useState<'info' | 'cat' | 'item' | 'phone' | 'settings' | 'menu'>('settings');

  if (!isAdmin) return (
    <div className="max-w-sm mx-auto mt-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-center transition-colors">
      <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-500/20"><Settings size={40} /></div>
      <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">{t.login}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onLogin(pass); }} className="space-y-4">
        <input type="password" placeholder={t.password} value={pass} onChange={e => setPass(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-emerald-500 transition-all text-center text-zinc-900 dark:text-zinc-100" />
        <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">{t.enter}</button>
      </form>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{t.adminTitle}</h2>
        <button onClick={() => window.location.reload()} className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><LogOut size={24} /></button>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        <SubNavBtn active={activeSub === 'settings'} onClick={() => setActiveSub('settings')} label="Settings" />
        <SubNavBtn active={activeSub === 'restaurant'} onClick={() => setActiveSub('restaurant')} label={t.restaurant} />
        <SubNavBtn active={activeSub === 'cafe'} onClick={() => setActiveSub('cafe')} label={t.cafe} />
        <SubNavBtn active={activeSub === 'laundry'} onClick={() => setActiveSub('laundry')} label={t.laundry} />
        <SubNavBtn active={activeSub === 'info'} onClick={() => setActiveSub('info')} label={t.hotelSettings} />
        <SubNavBtn active={activeSub === 'phone'} onClick={() => setActiveSub('phone')} label={t.phoneMgmt} />
        <SubNavBtn active={activeSub === 'menu'} onClick={() => setActiveSub('menu')} label="Global Menus" />
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm transition-colors">
        {activeSub === 'settings' && <AdminSettings settings={settings} refresh={refresh} t={t} seedDatabase={seedDatabase} />}
        {(activeSub === 'restaurant' || activeSub === 'cafe' || activeSub === 'laundry') && (
          <AdminMenuManager 
            type={activeSub} 
            categories={data.categories.filter(c => c.type === activeSub)} 
            items={data.items} 
            menus={data.menus}
            refresh={refresh} 
            t={t} 
          />
        )}
        {activeSub === 'menu' && <AdminMenu menus={data.menus} refresh={refresh} t={t} />}
        {activeSub === 'info' && <AdminInfo info={data.info} refresh={refresh} t={t} />}
        {activeSub === 'phone' && <AdminPhone phones={data.phones} refresh={refresh} t={t} />}
      </div>
    </div>
  );
}

function ImageUploader({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <ImageIcon className="text-zinc-300" size={24} />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Image URL or upload below..." 
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-xs"
          />
          <label className={`block w-full text-center py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${uploading ? 'bg-zinc-100 border-zinc-300 animate-pulse' : 'border-zinc-200 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-500/5'}`}>
            <span className="text-xs font-bold text-zinc-500">{uploading ? 'Processing...' : 'Upload Image'}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ settings, refresh, t, seedDatabase }: any) {
  const [localSettings, setLocalSettings] = useState(settings);

  const save = async () => {
    try {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...localSettings });
      if (error) throw error;
      refresh();
      alert('Settings saved!');
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    }
  };

  const updateTileImage = (key: string, val: string) => {
    setLocalSettings({
      ...localSettings,
      tile_images: {
        ...localSettings.tile_images,
        [key]: val
      }
    });
  };

  return (
    <div className="space-y-8">
      {!isSupabaseConfigured && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 text-xs font-medium leading-relaxed">
          ⚠️ <strong>Supabase is not configured!</strong><br />
          Please set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in the environment settings to enable database persistence.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">General</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Hotel Name</label>
            <input value={localSettings.hotel_name} onChange={e => setLocalSettings({...localSettings, hotel_name: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-xl" />
          </div>
          <ImageUploader label="Hotel Logo" value={localSettings.logo_url} onChange={(val) => setLocalSettings({...localSettings, logo_url: val})} />
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Home Tiles</h3>
          <div className="grid gap-4">
            <ImageUploader label="Info Tile" value={localSettings.tile_images?.info} onChange={(val) => updateTileImage('info', val)} />
            <ImageUploader label="Restaurant Tile" value={localSettings.tile_images?.restaurant} onChange={(val) => updateTileImage('restaurant', val)} />
            <ImageUploader label="Cafe Tile" value={localSettings.tile_images?.cafe} onChange={(val) => updateTileImage('cafe', val)} />
            <ImageUploader label="Laundry Tile" value={localSettings.tile_images?.laundry} onChange={(val) => updateTileImage('laundry', val)} />
            <ImageUploader label="Contact Tile" value={localSettings.tile_images?.phones} onChange={(val) => updateTileImage('phones', val)} />
          </div>
        </div>
      </div>

      <button onClick={save} className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Save All Settings</button>
      
      <div className="pt-8 border-t border-zinc-200 dark:border-white/5">
        <h4 className="text-sm font-bold mb-4">Database Maintenance</h4>
        <button onClick={seedDatabase} className="w-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 p-4 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
          Seed Database with Initial Data
        </button>
      </div>
    </div>
  );
}

function AdminMenu({ menus, refresh, t }: any) {
  const [newMenu, setNewMenu] = useState({ name: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('menus').update(newMenu).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menus').insert(newMenu);
        if (error) throw error;
      }
      setEditing(null);
      setNewMenu({ name: '' });
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving menu');
    }
  };

  const del = async (id: number) => {
    if (!isSupabaseConfigured) return;
    if (confirm('Delete menu? All categories and items in this menu will be deleted.')) {
      try {
        const { error } = await supabase.from('menus').delete().eq('id', id);
        if (error) throw error;
        refresh();
      } catch (e) {
        console.error(e);
        alert('Error deleting menu');
      }
    }
  };

  const edit = (m: any) => {
    setEditing(m);
    setNewMenu(m);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <input placeholder="Menu Name" value={newMenu.name} onChange={e => setNewMenu({...newMenu, name: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
      </div>

      <div className="space-y-2">
        {menus.map((m: any) => (
          <div key={m.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <span className="font-bold">{m.name}</span>
            <div className="flex gap-2">
              <button onClick={() => edit(m)} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
              <button onClick={() => del(m.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubNavBtn({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'}`}>
      {label}
    </button>
  );
}

function AdminInfo({ info, refresh, t }: any) {
  const [localInfo, setLocalInfo] = useState(info);
  const [newItem, setNewItem] = useState({ label: '', value: '' });

  const save = async () => {
    try {
      // For info, we'll just upsert all items
      // This is a bit inefficient but simple for this demo
      for (const item of localInfo) {
        const { id, ...rest } = item;
        await supabase.from('info').upsert({ key: item.key, ...rest });
      }
      refresh();
      alert('Info saved!');
    } catch (e) {
      console.error(e);
      alert('Error saving info');
    }
  };

  const addItem = async () => {
    if (!newItem.label || !newItem.value) return;
    try {
      const key = newItem.label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
      const { error } = await supabase.from('info').insert({ ...newItem, key });
      if (error) throw error;
      setNewItem({ label: '', value: '' });
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error adding info item');
    }
  };

  const removeItem = async (id: string) => {
    if (confirm('Delete this info item?')) {
      try {
        const { error } = await supabase.from('info').delete().eq('id', id);
        if (error) throw error;
        refresh();
      } catch (e) {
        console.error(e);
        alert('Error deleting info item');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">New Label</label>
            <input placeholder="e.g. Wi-Fi" value={newItem.label} onChange={e => setNewItem({...newItem, label: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">New Value</label>
            <input placeholder="e.g. Password123" value={newItem.value} onChange={e => setNewItem({...newItem, value: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          </div>
        </div>
        <button onClick={addItem} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"><Plus size={20} /> Add Info Item</button>
      </div>

      <div className="space-y-4">
        {localInfo.map((item: any, index: number) => (
          <div key={item.id} className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-white/5 relative group">
            <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Label</label>
                <input value={item.label} onChange={e => {
                  const newInfo = [...localInfo];
                  newInfo[index].label = e.target.value;
                  setLocalInfo(newInfo);
                }} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-lg text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Value</label>
                <input value={item.value} onChange={e => {
                  const newInfo = [...localInfo];
                  newInfo[index].value = e.target.value;
                  setLocalInfo(newInfo);
                }} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">Save All Info</button>
    </div>
  );
}

function AdminMenuManager({ type, categories, items, menus, refresh, t }: any) {
  const [activeTab, setActiveTab] = useState<'cats' | 'items'>('cats');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-zinc-200 dark:border-white/5 pb-4">
        <button 
          onClick={() => setActiveTab('cats')}
          className={`text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'cats' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('items')}
          className={`text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'items' ? 'text-emerald-500' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          Items
        </button>
      </div>

      <div className="pt-4">
        {activeTab === 'cats' ? (
          <AdminCat categories={categories} menus={menus} refresh={refresh} t={t} defaultType={type} />
        ) : (
          <AdminItem items={items.filter((i: any) => categories.some((c: any) => c.id === i.category_id))} categories={categories} refresh={refresh} t={t} />
        )}
      </div>
    </div>
  );
}

function AdminCat({ categories, menus, refresh, t, defaultType }: any) {
  const [newCat, setNewCat] = useState({ menu_id: menus[0]?.id || '', type: defaultType || 'restaurant', name: '', image_url: '' });
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    if (defaultType) {
      setNewCat(prev => ({ ...prev, type: defaultType }));
    }
  }, [defaultType]);

  const add = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('categories').update(newCat).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(newCat);
        if (error) throw error;
      }
      setEditing(null);
      setNewCat({ menu_id: menus[0]?.id || '', type: defaultType || 'restaurant', name: '', image_url: '' });
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving category');
    }
  };

  const del = async (id: number) => {
    if (confirm('Delete category? All items in this category will be deleted.')) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        refresh();
      } catch (e) {
        console.error(e);
        alert('Error deleting category');
      }
    }
  };

  const edit = (c: any) => {
    setEditing(c);
    setNewCat(c);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <select value={newCat.menu_id} onChange={e => setNewCat({...newCat, menu_id: parseInt(e.target.value)})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl">
          <option value="">Select Menu</option>
          {menus.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {!defaultType && (
          <select value={newCat.type} onChange={e => setNewCat({...newCat, type: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl">
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="laundry">Laundry</option>
          </select>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input placeholder="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          </div>
          <div className="space-y-4">
            <ImageUploader label="Category Image" value={newCat.image_url} onChange={(val) => setNewCat({...newCat, image_url: val})} />
          </div>
        </div>
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
      </div>

      <div className="space-y-2">
        {categories.map((c: any) => (
          <div key={c.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <div>
              <span className="text-[10px] uppercase font-black text-emerald-500 mr-3">{menus.find((m: any) => m.id === c.menu_id)?.name} / {c.type}</span>
              <span className="font-bold">{c.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(c)} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
              <button onClick={() => del(c.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminItem({ items, categories, refresh, t }: any) {
  const [newItem, setNewItem] = useState({ category_id: '', name: '', description: '', price: '', image_url: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('items').update(newItem).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('items').insert(newItem);
        if (error) throw error;
      }
      
      setNewItem({ category_id: '', name: '', description: '', price: '', image_url: '' });
      setEditing(null);
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving item');
    }
  };

  const del = async (id: number) => {
    if (confirm('Delete item?')) {
      try {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) throw error;
        refresh();
      } catch (e) {
        console.error(e);
        alert('Error deleting item');
      }
    }
  };

  const edit = (i: any) => {
    setEditing(i);
    setNewItem(i);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <select value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl">
              <option value="">{t.selectCat}</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
            </select>
            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
            <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm h-24 resize-none" />
            <input placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          </div>
          <div className="space-y-4">
            <ImageUploader label="Item Image" value={newItem.image_url} onChange={(val) => setNewItem({...newItem, image_url: val})} />
          </div>
        </div>
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"><Plus size={20} /> {editing ? 'Update Item' : t.add}</button>
      </div>

      <div className="space-y-2">
        {items.map((i: any) => (
          <div key={i.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <div className="flex items-center gap-4">
              <img src={i.image_url} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
              <span className="font-bold">{i.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => edit(i)} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
              <button onClick={() => del(i.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPhone({ phones, refresh, t }: any) {
  const [newPhone, setNewPhone] = useState({ name: '', number: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('phones').update(newPhone).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('phones').insert(newPhone);
        if (error) throw error;
      }
      setEditing(null);
      setNewPhone({ name: '', number: '' });
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving phone');
    }
  };

  const del = async (id: number) => {
    if (confirm('Delete phone?')) {
      try {
        const { error } = await supabase.from('phones').delete().eq('id', id);
        if (error) throw error;
        refresh();
      } catch (e) {
        console.error(e);
        alert('Error deleting phone');
      }
    }
  };

  const edit = (p: any) => {
    setEditing(p);
    setNewPhone(p);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <div className="grid grid-cols-1 gap-2">
          <input placeholder="Name" value={newPhone.name} onChange={e => setNewPhone({...newPhone, name: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        </div>
        <input placeholder="Number" value={newPhone.number} onChange={e => setNewPhone({...newPhone, number: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
      </div>

      <div className="space-y-2">
        {phones.map((p: any) => (
          <div key={p.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <span className="font-bold">{p.name}: {p.number}</span>
            <div className="flex gap-2">
              <button onClick={() => edit(p)} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
              <button onClick={() => del(p.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
