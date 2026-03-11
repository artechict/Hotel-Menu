import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { translateText } from '../services/geminiService';
import { ImageUploader } from './ImageUploader';
import { getTranslated } from '../utils/translation';

export function AdminCat({ categories, menus, refresh, t, defaultType }: any) {
  const [newCat, setNewCat] = useState<any>({ menu_id: menus[0]?.id || '', type: defaultType || 'restaurant', name: '', name_ar: '', name_tr: '', name_ku: '', image_url: '' });
  const [editing, setEditing] = useState<any>(null);
  const [translating, setTranslating] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    if (defaultType) {
      setNewCat((prev: any) => ({ ...prev, type: defaultType }));
    }
  }, [defaultType]);

  const add = async () => {
    setTranslating(true);
    try {
      let catToSave = { ...newCat };
      if (catToSave.name && (!catToSave.name_ar || !catToSave.name_tr || !catToSave.name_ku)) {
        const trans = await translateText(catToSave.name);
        catToSave.name_ar = catToSave.name_ar || trans.ar;
        catToSave.name_tr = catToSave.name_tr || trans.tr;
        catToSave.name_ku = catToSave.name_ku || trans.ku;
      }

      if (editing) {
        const { error } = await supabase.from('categories').update(catToSave).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(catToSave);
        if (error) throw error;
      }
      setEditing(null);
      setNewCat({ menu_id: menus[0]?.id || '', type: defaultType || 'restaurant', name: '', name_ar: '', name_tr: '', name_ku: '', image_url: '' });
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving category');
    } finally {
      setTranslating(false);
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

  const translateAll = async () => {
    if (!confirm('Translate all categories? This might take a while.')) return;
    setTranslating(true);
    try {
      for (const cat of categories) {
        if (!cat.name_ar || !cat.name_tr || !cat.name_ku) {
          const trans = await translateText(cat.name);
          await supabase.from('categories').update({
            name_ar: cat.name_ar || trans.ar,
            name_tr: cat.name_tr || trans.tr,
            name_ku: cat.name_ku || trans.ku
          }).eq('id', cat.id);
        }
      }
      refresh();
      alert('All categories translated!');
    } catch (e) {
      console.error(e);
      alert('Error translating categories');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={translateAll} disabled={translating} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center gap-2">
          {translating ? <Clock size={20} className="animate-spin" /> : <Plus size={20} />}
          Translate All Categories
        </button>
      </div>
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
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">English Name</label>
              <input placeholder="Name" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
            </div>
            
            <button onClick={() => setShowTranslations(!showTranslations)} className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1 hover:underline">
              {showTranslations ? 'Hide Translations' : 'Show Translations (Auto-filled)'}
            </button>

            {showTranslations && (
              <div className="space-y-4 p-4 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Arabic Name</label>
                  <input dir="rtl" placeholder="الاسم بالعربية" value={newCat.name_ar} onChange={e => setNewCat({...newCat, name_ar: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Turkish Name</label>
                  <input placeholder="Türkçe İsim" value={newCat.name_tr} onChange={e => setNewCat({...newCat, name_tr: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Kurdish Sorani Name</label>
                  <input dir="rtl" placeholder="ناوی کوردی" value={newCat.name_ku} onChange={e => setNewCat({...newCat, name_ku: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <ImageUploader label="Category Image" value={newCat.image_url} onChange={(val: string) => setNewCat({...newCat, image_url: val})} />
          </div>
        </div>
        <button onClick={add} disabled={translating} className={`bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 ${translating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'}`}>
          {translating ? <Clock size={20} className="animate-spin" /> : <Plus size={20} />} 
          {translating ? 'Translating & Saving...' : (editing ? 'Update' : t.add)}
        </button>
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

export function AdminItem({ items, categories, refresh, t }: any) {
  const [newItem, setNewItem] = useState<any>({ category_id: '', name: '', name_ar: '', name_tr: '', name_ku: '', description: '', description_ar: '', description_tr: '', description_ku: '', price: '', image_url: '' });
  const [editing, setEditing] = useState<any>(null);
  const [translating, setTranslating] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  const add = async () => {
    setTranslating(true);
    try {
      let itemToSave = { ...newItem };
      
      if (itemToSave.name && (!itemToSave.name_ar || !itemToSave.name_tr || !itemToSave.name_ku)) {
        const trans = await translateText(itemToSave.name);
        itemToSave.name_ar = itemToSave.name_ar || trans.ar;
        itemToSave.name_tr = itemToSave.name_tr || trans.tr;
        itemToSave.name_ku = itemToSave.name_ku || trans.ku;
      }

      if (itemToSave.description && (!itemToSave.description_ar || !itemToSave.description_tr || !itemToSave.description_ku)) {
        const trans = await translateText(itemToSave.description);
        itemToSave.description_ar = itemToSave.description_ar || trans.ar;
        itemToSave.description_tr = itemToSave.description_tr || trans.tr;
        itemToSave.description_ku = itemToSave.description_ku || trans.ku;
      }

      if (editing) {
        const { error } = await supabase.from('items').update(itemToSave).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('items').insert(itemToSave);
        if (error) throw error;
      }
      
      setNewItem({ category_id: '', name: '', name_ar: '', name_tr: '', name_ku: '', description: '', description_ar: '', description_tr: '', description_ku: '', price: '', image_url: '' });
      setEditing(null);
      refresh();
    } catch (e) {
      console.error(e);
      alert('Error saving item');
    } finally {
      setTranslating(false);
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

  const translateAll = async () => {
    if (!confirm('Translate all items? This might take a while.')) return;
    setTranslating(true);
    try {
      for (const item of items) {
        if (!item.name_ar || !item.name_tr || !item.name_ku) {
          const trans = await translateText(item.name);
          await supabase.from('items').update({
            name_ar: item.name_ar || trans.ar,
            name_tr: item.name_tr || trans.tr,
            name_ku: item.name_ku || trans.ku
          }).eq('id', item.id);
        }
      }
      refresh();
      alert('All items translated!');
    } catch (e) {
      console.error(e);
      alert('Error translating items');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={translateAll} disabled={translating} className="bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center gap-2">
          {translating ? <Clock size={20} className="animate-spin" /> : <Plus size={20} />}
          Translate All Items
        </button>
      </div>
      <div className="grid gap-6 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <select value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl">
              <option value="">{t.selectCat}</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{getTranslated(c, 'name', 'en')} ({c.type})</option>)}
            </select>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">English Name</label>
              <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">English Description</label>
              <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm h-24 resize-none" />
            </div>
            
            <button onClick={() => setShowTranslations(!showTranslations)} className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1 hover:underline">
              {showTranslations ? 'Hide Translations' : 'Show Translations (Auto-filled)'}
            </button>

            {showTranslations && (
              <div className="space-y-6 p-4 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-white/5">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-200 dark:border-white/5 pb-1">Arabic</h5>
                  <input dir="rtl" placeholder="الاسم بالعربية" value={newItem.name_ar} onChange={e => setNewItem({...newItem, name_ar: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm" />
                  <textarea dir="rtl" placeholder="الوصف بالعربية" value={newItem.description_ar} onChange={e => setNewItem({...newItem, description_ar: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm h-20 resize-none" />
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-200 dark:border-white/5 pb-1">Turkish</h5>
                  <input placeholder="Türkçe İsim" value={newItem.name_tr} onChange={e => setNewItem({...newItem, name_tr: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm" />
                  <textarea placeholder="Türkçe Açıklama" value={newItem.description_tr} onChange={e => setNewItem({...newItem, description_tr: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm h-20 resize-none" />
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-200 dark:border-white/5 pb-1">Kurdish Sorani</h5>
                  <input dir="rtl" placeholder="ناوی کوردی" value={newItem.name_ku} onChange={e => setNewItem({...newItem, name_ku: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm" />
                  <textarea dir="rtl" placeholder="وەسفی کوردی" value={newItem.description_ku} onChange={e => setNewItem({...newItem, description_ku: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-sm h-20 resize-none" />
                </div>
              </div>
            )}
            
            <input placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl text-sm" />
          </div>
          <div className="space-y-4">
            <ImageUploader label="Item Image" value={newItem.image_url} onChange={(val: string) => setNewItem({...newItem, image_url: val})} />
          </div>
        </div>
        <button onClick={add} disabled={translating} className={`bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 ${translating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20'}`}>
          {translating ? <Clock size={20} className="animate-spin" /> : <Plus size={20} />} 
          {translating ? 'Translating & Saving...' : (editing ? 'Update Item' : t.add)}
        </button>
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
