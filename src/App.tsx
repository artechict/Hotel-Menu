import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, Coffee, Shirt, Info, Phone, Settings, Plus, Trash2, 
  Clock, Globe, LogOut, Save, Image as ImageIcon, ChevronLeft, ChevronRight,
  Sun, Moon, Home as HomeIcon, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './services/supabaseClient';
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
    try {
      const storedData = localStorage.getItem('appData_v4');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setData({ menus: parsed.menus, categories: parsed.categories, items: parsed.items, info: parsed.info, phones: parsed.phones });
        setSettings(parsed.settings);
      } else {
        setData({ menus: initialMockData.menus, categories: initialMockData.categories, items: initialMockData.items, info: initialMockData.info, phones: initialMockData.phones });
        setSettings(initialMockData.settings);
        localStorage.setItem('appData_v4', JSON.stringify(initialMockData));
      }
    } catch (e) {
      console.error(e);
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
          {activeTab === 'home' && <HomeGrid key="home" navigateTo={navigateTo} t={t} />}
          {activeTab === 'info' && <InfoSection key="info" info={data?.info || []} phones={data?.phones || []} t={t} />}
          {(activeTab === 'restaurant' || activeTab === 'cafe' || activeTab === 'laundry') && (
            <MenuSection key={activeTab} type={activeTab} categories={data?.categories.filter(c => c.type === activeTab) || []} items={data?.items || []} t={t} />
          )}
          {activeTab === 'phones' && <PhoneSection key="phones" phones={data?.phones || []} t={t} />}
          {activeTab === 'admin' && <AdminSection key="admin" isAdmin={isAdmin} onLogin={(p: string) => { if(p === 'admin123') setIsAdmin(true); else alert('Wrong password'); }} data={data} refresh={fetchData} t={t} settings={settings} />}
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

function HomeGrid({ navigateTo, t }: any) {
  const tiles = [
    { id: 'info', icon: <Info size={32} />, label: t.info, color: 'from-blue-500 to-blue-600', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
    { id: 'restaurant', icon: <Utensils size={32} />, label: t.restaurant, color: 'from-orange-500 to-orange-600', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' },
    { id: 'cafe', icon: <Coffee size={32} />, label: t.cafe, color: 'from-amber-500 to-amber-600', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' },
    { id: 'laundry', icon: <Shirt size={32} />, label: t.laundry, color: 'from-indigo-500 to-indigo-600', img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80' },
    { id: 'phones', icon: <Phone size={32} />, label: t.contact, color: 'from-emerald-500 to-emerald-600', img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=400&q=80' },
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
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{t[type]}</h2>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10 mx-6" />
      </div>

      {categories.length === 0 && <div className="text-center py-20 text-zinc-400 dark:text-zinc-600 font-medium">{t.noItems}</div>}

      {categories.map((cat: any) => (
        <div key={cat.id} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{cat.name}</h3>
          </div>
          <div className="grid gap-6">
            {items.filter((i: any) => i.category_id === cat.id).map((item: any) => (
              <motion.div whileHover={{ y: -4 }} key={item.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden flex flex-col sm:flex-row group transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-white/10 shadow-sm">
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
            ))}
          </div>
        </div>
      ))}
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

function AdminSection({ isAdmin, onLogin, data, refresh, t, settings }: any) {
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

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <SubNavBtn active={activeSub === 'settings'} onClick={() => setActiveSub('settings')} label="Settings" />
        <SubNavBtn active={activeSub === 'menu'} onClick={() => setActiveSub('menu')} label="Menus" />
        <SubNavBtn active={activeSub === 'info'} onClick={() => setActiveSub('info')} label={t.hotelSettings} />
        <SubNavBtn active={activeSub === 'cat'} onClick={() => setActiveSub('cat')} label={t.catMgmt} />
        <SubNavBtn active={activeSub === 'item'} onClick={() => setActiveSub('item')} label={t.itemMgmt} />
        <SubNavBtn active={activeSub === 'phone'} onClick={() => setActiveSub('phone')} label={t.phoneMgmt} />
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm transition-colors">
        {activeSub === 'settings' && <AdminSettings settings={settings} refresh={refresh} t={t} />}
        {activeSub === 'menu' && <AdminMenu menus={data.menus} refresh={refresh} t={t} />}
        {activeSub === 'info' && <AdminInfo info={data.info} refresh={refresh} t={t} />}
        {activeSub === 'cat' && <AdminCat categories={data.categories} menus={data.menus} refresh={refresh} t={t} />}
        {activeSub === 'item' && <AdminItem items={data.items} categories={data.categories} refresh={refresh} t={t} />}
        {activeSub === 'phone' && <AdminPhone phones={data.phones} refresh={refresh} t={t} />}
      </div>
    </div>
  );
}

function AdminSettings({ settings, refresh, t }: any) {
  const [localSettings, setLocalSettings] = useState(settings);

  const save = async () => {
    const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
    data.settings = localSettings;
    localStorage.setItem('appData_v4', JSON.stringify(data));
    refresh();
    alert('Settings saved!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Hotel Name</label>
        <input value={localSettings.hotel_name} onChange={e => setLocalSettings({...localSettings, hotel_name: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-xl" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Logo URL</label>
        <input value={localSettings.logo_url} onChange={e => setLocalSettings({...localSettings, logo_url: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-xl" />
      </div>
      <button onClick={save} className="w-full bg-emerald-500 text-white p-4 rounded-xl font-bold">Save Settings</button>
    </div>
  );
}

function AdminMenu({ menus, refresh, t }: any) {
  const [newMenu, setNewMenu] = useState({ name: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
    if (editing) {
      const index = data.menus.findIndex((m: any) => m.id === editing.id);
      data.menus[index] = { ...newMenu, id: editing.id };
    } else {
      data.menus.push({ ...newMenu, id: Date.now() });
    }
    localStorage.setItem('appData_v4', JSON.stringify(data));
    setEditing(null);
    setNewMenu({ name: '' });
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete menu?')) {
      const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
      data.menus = data.menus.filter((m: any) => m.id !== id);
      data.categories = data.categories.filter((c: any) => c.menu_id !== id);
      localStorage.setItem('appData_v4', JSON.stringify(data));
      refresh();
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
    const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
    data.info = localInfo;
    localStorage.setItem('appData_v4', JSON.stringify(data));
    refresh();
    alert('Info saved!');
  };

  const addItem = () => {
    if (!newItem.label || !newItem.value) return;
    setLocalInfo([...localInfo, { ...newItem, key: Date.now().toString() }]);
    setNewItem({ label: '', value: '' });
  };

  const removeItem = (key: string) => {
    if (confirm('Delete this info item?')) {
      setLocalInfo(localInfo.filter((i: any) => i.key !== key));
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
          <div key={item.key} className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-white/5 relative group">
            <button onClick={() => removeItem(item.key)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
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

function AdminCat({ categories, menus, refresh, t }: any) {
  const [newCat, setNewCat] = useState({ menu_id: '', type: 'restaurant', name: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
    if (editing) {
      const index = data.categories.findIndex((c: any) => c.id === editing.id);
      data.categories[index] = { ...newCat, id: editing.id };
    } else {
      data.categories.push({ ...newCat, id: Date.now() });
    }
    localStorage.setItem('appData_v4', JSON.stringify(data));
    setEditing(null);
    setNewCat({ menu_id: '', type: 'restaurant', name: '' });
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete category?')) {
      const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
      data.categories = data.categories.filter((c: any) => c.id !== id);
      localStorage.setItem('appData_v4', JSON.stringify(data));
      refresh();
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
        <select value={newCat.type} onChange={e => setNewCat({...newCat, type: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl">
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Cafe</option>
          <option value="laundry">Laundry</option>
        </select>
        <div className="grid grid-cols-1 gap-2">
          <input placeholder="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
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
  const [file, setFile] = useState<File | null>(null);

  const add = async () => {
    let imageUrl = newItem.image_url;
    if (file) {
      // In mock mode, we just use a placeholder or the file name as a mock URL
      imageUrl = URL.createObjectURL(file);
    }

    const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
    if (editing) {
      const index = data.items.findIndex((i: any) => i.id === editing.id);
      data.items[index] = { ...newItem, id: editing.id, image_url: imageUrl };
    } else {
      data.items.push({ ...newItem, id: Date.now(), image_url: imageUrl });
    }
    localStorage.setItem('appData_v4', JSON.stringify(data));
    setNewItem({ category_id: '', name: '', description: '', price: '', image_url: '' });
    setFile(null);
    setEditing(null);
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete item?')) {
      const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
      data.items = data.items.filter((i: any) => i.id !== id);
      localStorage.setItem('appData_v4', JSON.stringify(data));
      refresh();
    }
  };

  const edit = (i: any) => {
    setEditing(i);
    setNewItem(i);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <select value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl">
          <option value="">{t.selectCat}</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
        </select>
        <div className="grid grid-cols-1 gap-2">
          <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        </div>
        <input placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <input placeholder="Image URL" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
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
    const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
    if (editing) {
      const index = data.phones.findIndex((p: any) => p.id === editing.id);
      data.phones[index] = { ...newPhone, id: editing.id };
    } else {
      data.phones.push({ ...newPhone, id: Date.now() });
    }
    localStorage.setItem('appData_v4', JSON.stringify(data));
    setEditing(null);
    setNewPhone({ name: '', number: '' });
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete phone?')) {
      const data = JSON.parse(localStorage.getItem('appData_v4') || '{}');
      data.phones = data.phones.filter((p: any) => p.id !== id);
      localStorage.setItem('appData_v4', JSON.stringify(data));
      refresh();
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
