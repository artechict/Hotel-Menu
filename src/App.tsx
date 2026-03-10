import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, Coffee, Shirt, Info, Phone, Settings, Plus, Trash2, 
  Clock, Globe, LogOut, Save, Image as ImageIcon, ChevronLeft, ChevronRight,
  Sun, Moon, Home as HomeIcon, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './services/supabaseClient';
import { AppData, Category, MenuItem, HotelInfo, PhoneNumber } from './types';

type Language = 'fa' | 'en' | 'ar' | 'tr' | 'ku';

const UI_STRINGS = {
  en: {
    hotelName: 'Royal Hotel', welcome: 'Welcome', info: 'Info', restaurant: 'Restaurant', cafe: 'Cafe', laundry: 'Laundry', contact: 'Contact', admin: 'Admin', home: 'Home',
    login: 'Admin Login', password: 'Password', enter: 'Login', logout: 'Logout', workingHours: 'Working Hours & Info', internalPhones: 'Internal Phones',
    noItems: 'No items to display.', callInstruction: 'To call from your room, dial the numbers above.',
    adminTitle: 'Professional Admin Panel', hotelSettings: 'Hotel Settings', catMgmt: 'Category Management', itemMgmt: 'Menu Management', phoneMgmt: 'Contact Management',
    add: 'Add', delete: 'Delete', save: 'Save', name: 'Name', desc: 'Description', price: 'Price', imageUrl: 'Image URL', type: 'Type',
    catName: 'Category Name', itemName: 'Item Name', phoneName: 'Section Name', phoneNumber: 'Number', selectCat: 'Select Category...',
  }
};

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [settings, setSettings] = useState<{ hotel_name: string, logo_url: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'restaurant' | 'cafe' | 'laundry' | 'info' | 'phones' | 'admin'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const t = UI_STRINGS.en;

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
      const { data: categories } = await supabase.from('categories').select('*');
      const { data: items } = await supabase.from('menu_items').select('*');
      const { data: info } = await supabase.from('hotel_info').select('*');
      const { data: phones } = await supabase.from('phone_numbers').select('*');
      const { data: settings } = await supabase.from('settings').select('*');
      
      setData({ categories, items, info, phones });
      const s = settings?.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
      setSettings(s);
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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
              <img src={settings?.logo_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{settings?.hotel_name}</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">{t.welcome}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button onClick={() => setActiveTab('admin')} className={`p-3 rounded-2xl transition-all ${activeTab === 'admin' ? 'bg-emerald-500 text-white' : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500'}`}>
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeGrid key="home" setActiveTab={setActiveTab} t={t} />}
          {activeTab === 'info' && <InfoSection key="info" info={data?.info || []} phones={data?.phones || []} t={t} />}
          {(activeTab === 'restaurant' || activeTab === 'cafe' || activeTab === 'laundry') && (
            <MenuSection key={activeTab} type={activeTab} categories={data?.categories.filter(c => c.type === activeTab) || []} items={data?.items || []} t={t} />
          )}
          {activeTab === 'phones' && <PhoneSection key="phones" phones={data?.phones || []} t={t} />}
          {activeTab === 'admin' && <AdminSection key="admin" isAdmin={isAdmin} onLogin={(p: string) => { if(p === 'admin123') setIsAdmin(true); else alert('Wrong password'); }} data={data} refresh={fetchData} t={t} settings={settings} />}
        </AnimatePresence>
      </main>

      {/* Modern Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-3xl px-4 py-3 flex justify-around items-center z-50 shadow-2xl transition-colors duration-300">
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

function HomeGrid({ setActiveTab, t }: any) {
  const tiles = [
    { id: 'info', icon: <Info size={32} />, label: t.info, color: 'from-blue-500 to-blue-600', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
    { id: 'restaurant', icon: <Utensils size={32} />, label: t.restaurant, color: 'from-orange-500 to-orange-600', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80' },
    { id: 'cafe', icon: <Coffee size={32} />, label: t.cafe, color: 'from-amber-500 to-amber-600', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' },
    { id: 'laundry', icon: <Shirt size={32} />, label: t.laundry, color: 'from-indigo-500 to-indigo-600', img: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=400&q=80' },
    { id: 'phones', icon: <Phone size={32} />, label: t.contact, color: 'from-emerald-500 to-emerald-600', img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 gap-4">
      {tiles.map((tile) => (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          key={tile.id}
          onClick={() => setActiveTab(tile.id as any)}
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

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-6 rounded-3xl space-y-6 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-100"><Phone size={20} className="text-emerald-500" /> {t.internalPhones}</h3>
        <div className="grid grid-cols-2 gap-4">
          {phones.map((p: any) => (
            <div key={p.id} className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col items-center gap-1 group hover:border-emerald-500/30 transition-all">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{p.name}</span>
              <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-widest group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{p.number}</span>
            </div>
          ))}
        </div>
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
  const [activeSub, setActiveSub] = useState<'info' | 'cat' | 'item' | 'phone' | 'settings'>('settings');

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
        <SubNavBtn active={activeSub === 'info'} onClick={() => setActiveSub('info')} label={t.hotelSettings} />
        <SubNavBtn active={activeSub === 'cat'} onClick={() => setActiveSub('cat')} label={t.catMgmt} />
        <SubNavBtn active={activeSub === 'item'} onClick={() => setActiveSub('item')} label={t.itemMgmt} />
        <SubNavBtn active={activeSub === 'phone'} onClick={() => setActiveSub('phone')} label={t.phoneMgmt} />
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm transition-colors">
        {activeSub === 'settings' && <AdminSettings settings={settings} refresh={refresh} t={t} />}
        {activeSub === 'info' && <AdminInfo info={data.info} refresh={refresh} t={t} />}
        {activeSub === 'cat' && <AdminCat categories={data.categories} refresh={refresh} t={t} />}
        {activeSub === 'item' && <AdminItem items={data.items} categories={data.categories} refresh={refresh} t={t} />}
        {activeSub === 'phone' && <AdminPhone phones={data.phones} refresh={refresh} t={t} />}
      </div>
    </div>
  );
}

function AdminSettings({ settings, refresh, t }: any) {
  const update = async (key: string, value: string) => {
    await supabase.from('settings').update({ value }).eq('key', key);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Hotel Name</label>
        <input defaultValue={settings.hotel_name} onBlur={e => update('hotel_name', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-xl" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Logo URL</label>
        <input defaultValue={settings.logo_url} onBlur={e => update('logo_url', e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-xl" />
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
  const update = async (key: string, values: any) => {
    await supabase.from('hotel_info').update(values).eq('key', key);
    refresh();
  };

  return (
    <div className="space-y-8">
      {info.map((item: any) => (
        <div key={item.key} className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-white/5">
          <h4 className="font-bold text-zinc-400 uppercase text-[10px] tracking-widest">{item.label_en}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input defaultValue={item.value_fa} onBlur={e => update(item.key, { value_fa: e.target.value })} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" placeholder="Persian" />
            <input defaultValue={item.value_en} onBlur={e => update(item.key, { value_en: e.target.value })} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" placeholder="English" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminCat({ categories, refresh, t }: any) {
  const [newCat, setNewCat] = useState({ type: 'restaurant', name: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    if (editing) {
      await supabase.from('categories').update(newCat).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('categories').insert(newCat);
    }
    setNewCat({ type: 'restaurant', name: '' });
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete category?')) {
      await supabase.from('categories').delete().eq('id', id);
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
              <span className="text-[10px] uppercase font-black text-emerald-500 mr-3">{c.type}</span>
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
    if (editing) {
      await supabase.from('menu_items').update(newItem).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('menu_items').insert(newItem);
    }
    setNewItem({ category_id: '', name: '', description: '', price: '', image_url: '' });
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete item?')) {
      await supabase.from('menu_items').delete().eq('id', id);
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
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name_en} ({c.type})</option>)}
        </select>
        <div className="grid grid-cols-1 gap-2">
          <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        </div>
        <input placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <input placeholder="Image URL" value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
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
    if (editing) {
      await supabase.from('phone_numbers').update(newPhone).eq('id', editing.id);
      setEditing(null);
    } else {
      await supabase.from('phone_numbers').insert(newPhone);
    }
    setNewPhone({ name: '', number: '' });
    refresh();
  };

  const del = async (id: number) => {
    if (confirm('Delete phone?')) {
      await supabase.from('phone_numbers').delete().eq('id', id);
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
