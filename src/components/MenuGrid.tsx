import React from 'react';
import { MenuItem } from '../types';

export const MenuGrid = ({ items }: { items: MenuItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
          <div className="p-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            <p className="text-emerald-600 font-bold mt-2">{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
