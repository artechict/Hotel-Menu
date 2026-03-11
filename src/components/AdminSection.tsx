import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, LayoutGrid, ListOrdered, PhoneCall, LogOut, Database, Plus, Trash2, ChevronLeft, Info } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { ImageUploader } from './ImageUploader';
import { AdminCat, AdminItem } from './AdminMenuManager';

export function AdminSection({ isAdmin, onLogin, data, refresh, t, settings, seedDatabase }: any) {
  const [pass, setPass] = useState('');
  const [activeAdminView, setActiveAdminView] = useState<'dashboard' | 'settings' | 'menus' | 'categories' | 'items' | 'phones' | 'info'>('dashboard');

  if (!isAdmin) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto p-8 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
            <SettingsIcon size={32} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{t.login}</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="password" 
            placeholder={t.password} 
            value={pass} 
            onChange={e => setPass(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && onLogin(pass)}
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all" 
          />
          <button onClick={() => onLogin(pass)} className="w-full bg-emerald-500 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">{t.enter}</button>
        </div>
      </motion.div>
    );
  }

  const dashboardCards = [
    { id: 'settings', label: t.hotelSettings, icon: <SettingsIcon size={24} /> },
    { id: 'menus', label: 'Menus', icon: <LayoutGrid size={24} /> },
    { id: 'categories', label: t.catMgmt, icon: <LayoutGrid size={24} /> },
    { id: 'items', label: t.itemMgmt, icon: <ListOrdered size={24} /> },
    { id: 'phones', label: t.phoneMgmt, icon: <PhoneCall size={24} /> },
    { id: 'info', label: 'Info Sections', icon: <Info size={24} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          {activeAdminView !== 'dashboard' && (
            <button onClick={() => setActiveAdminView('dashboard')} className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-all">
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{activeAdminView === 'dashboard' ? t.adminTitle : dashboardCards.find(c => c.id === activeAdminView)?.label}</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Management Console</p>
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 rounded-xl font-bold text-xs hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
          <LogOut size={16} /> {t.logout}
        </button>
      </div>

      {activeAdminView === 'dashboard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map(card => (
            <button key={card.id} onClick={() => setActiveAdminView(card.id as any)} className="p-8 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">{card.icon}</div>
              <h3 className="font-black text-lg uppercase tracking-tight">{card.label}</h3>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 shadow-sm">
          {activeAdminView === 'settings' && <AdminSettings settings={settings} refresh={refresh} t={t} seedDatabase={seedDatabase} />}
          {activeAdminView === 'menus' && <AdminMenu menus={data?.menus || []} refresh={refresh} t={t} />}
          {activeAdminView === 'categories' && <AdminCat categories={data?.categories || []} menus={data?.menus || []} refresh={refresh} t={t} />}
          {activeAdminView === 'items' && <AdminItem items={data?.items || []} categories={data?.categories || []} refresh={refresh} t={t} />}
          {activeAdminView === 'phones' && <AdminPhone phones={data?.phones || []} refresh={refresh} t={t} />}
          {activeAdminView === 'info' && <AdminInfo info={data?.info || []} refresh={refresh} t={t} />}
        </div>
      )}
    </motion.div>
  );
}
// ... (rest of the functions remain the same)


function AdminTabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/60 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900'}`}>
      {icon} {label}
    </button>
  );
}

function AdminSettings({ settings, refresh, t, seedDatabase }: any) {
  const [newSettings, setNewSettings] = useState(settings || { 
    hotel_name: '', 
    logo_url: '', 
    tile_images: { info: '', restaurant: '', cafe: '', laundry: '', phones: '' } 
  });

  const save = async () => {
    try {
      const { error } = await supabase.from('settings').upsert({ id: settings?.id || 1, ...newSettings });
      if (error) throw error;
      refresh();
      alert('Settings saved');
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t.hotelName}</label>
          <input value={newSettings.hotel_name} onChange={e => setNewSettings({...newSettings, hotel_name: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all" />
        </div>
        <ImageUploader label="Hotel Logo" value={newSettings.logo_url} onChange={(val) => setNewSettings({...newSettings, logo_url: val})} />
        
        <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-white/5">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tile Images</h4>
          <ImageUploader label="Restaurant" value={newSettings.tile_images?.restaurant} onChange={(val) => setNewSettings({...newSettings, tile_images: {...newSettings.tile_images, restaurant: val}})} />
          <ImageUploader label="Cafe" value={newSettings.tile_images?.cafe} onChange={(val) => setNewSettings({...newSettings, tile_images: {...newSettings.tile_images, cafe: val}})} />
          <ImageUploader label="Laundry" value={newSettings.tile_images?.laundry} onChange={(val) => setNewSettings({...newSettings, tile_images: {...newSettings.tile_images, laundry: val}})} />
          <ImageUploader label="Info" value={newSettings.tile_images?.info} onChange={(val) => setNewSettings({...newSettings, tile_images: {...newSettings.tile_images, info: val}})} />
          <ImageUploader label="Phones" value={newSettings.tile_images?.phones} onChange={(val) => setNewSettings({...newSettings, tile_images: {...newSettings.tile_images, phones: val}})} />
        </div>

        <button onClick={save} className="bg-emerald-500 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">{t.save}</button>
      </div>
      
      <div className="pt-8 border-t border-zinc-200 dark:border-white/5">
        <button onClick={seedDatabase} className="flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors text-xs font-bold uppercase tracking-widest">
          <Database size={16} /> Reset to Default Data
        </button>
      </div>
    </div>
  );
}

function AdminMenu({ menus, refresh, t }: any) {
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('menus').update({ name: newName }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menus').insert({ name: newName });
        if (error) throw error;
      }
      setNewName('');
      setEditing(null);
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving menu');
    }
  };

  const del = async (id: number) => {
    if (confirm('Delete menu? All categories and items in this menu will be affected.')) {
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

  return (
    <div className="space-y-8">
      <div className="flex gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <input placeholder="Menu Name (e.g. Main Menu)" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <button onClick={add} className="bg-emerald-500 text-white px-8 rounded-xl font-bold flex items-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
      </div>
      <div className="space-y-2">
        {menus.map((m: any) => (
          <div key={m.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <span className="font-bold">{m.name}</span>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(m); setNewName(m.name); }} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
              <button onClick={() => del(m.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminInfo({ info, refresh, t }: any) {
  const [newItem, setNewItem] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState<any>(null);

  const add = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('info').update(newItem).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('info').insert(newItem);
        if (error) throw error;
      }
      setNewItem({ title: '', content: '' });
      setEditing(null);
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving info');
    }
  };

  const del = async (id: number) => {
    if (confirm('Delete info section?')) {
      try {
        const { error } = await supabase.from('info').delete().eq('id', id);
        if (error) throw error;
        refresh();
      } catch (e) {
        console.error(e);
        alert('Error deleting info');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <input placeholder="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <textarea placeholder="Content" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm h-24 resize-none" />
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
      </div>
      <div className="space-y-2">
        {info.map((i: any) => (
          <div key={i.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <span className="font-bold">{i.title}</span>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(i); setNewItem(i); }} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
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
      setNewPhone({ name: '', number: '' });
      setEditing(null);
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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <input placeholder={t.phoneName} value={newPhone.name} onChange={e => setNewPhone({...newPhone, name: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <input placeholder={t.phoneNumber} value={newPhone.number} onChange={e => setNewPhone({...newPhone, number: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
        <button onClick={add} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={20} /> {editing ? 'Update' : t.add}</button>
      </div>
      <div className="space-y-2">
        {phones.map((p: any) => (
          <div key={p.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/5">
            <div>
              <span className="font-bold mr-4">{p.name}</span>
              <span className="text-emerald-500 font-black tracking-tighter">{p.number}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(p); setNewPhone(p); }} className="text-zinc-400 hover:text-emerald-500 transition-colors">Edit</button>
              <button onClick={() => del(p.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
