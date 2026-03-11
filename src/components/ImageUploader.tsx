import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          onChange(dataUrl);
          setUploading(false);
        };
        img.src = event.target?.result as string;
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
