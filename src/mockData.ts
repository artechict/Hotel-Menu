export const initialMockData = {
  settings: {
    hotel_name: 'Royal Grand Hotel',
    logo_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80',
    tile_images: {
      info: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      restaurant: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      laundry: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80',
      phones: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=800&q=80'
    }
  },
  info: [
    { key: 'checkin', label: 'Check-in', value: '14:00' },
    { key: 'checkout', label: 'Check-out', value: '12:00' },
    { key: 'wifi', label: 'Wi-Fi Password', value: 'Royal123' },
    { key: 'breakfast', label: 'Breakfast', value: '07:00 - 10:30' },
    { key: 'pool', label: 'Pool Hours', value: '09:00 - 20:00' }
  ],
  phones: [
    { id: 1, name: 'Reception', number: '100' },
    { id: 2, name: 'Restaurant', number: '101' },
    { id: 3, name: 'Housekeeping', number: '102' },
    { id: 4, name: 'Spa', number: '103' },
    { id: 5, name: 'Gym', number: '104' }
  ],
  menus: [
    { id: 1, name: 'Main Menu' }
  ],
  categories: [
    { id: 1, menu_id: 1, name: 'Restaurant', type: 'restaurant', image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=200&q=80' },
    { id: 2, menu_id: 1, name: 'Cafe', type: 'cafe', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80' },
    { id: 3, menu_id: 1, name: 'Laundry Services', type: 'laundry', image_url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=200&q=80' }
  ],
  items: [
    { id: 1, category_id: 1, name: 'Grilled Steak', description: 'Premium beef steak served with roasted seasonal vegetables and red wine reduction.', price: '$25.00', image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80' },
    { id: 2, category_id: 1, name: 'Cheeseburger', description: 'Classic gourmet burger with aged cheddar, fresh lettuce, and our secret house sauce.', price: '$15.00', image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80' },
    { id: 3, category_id: 1, name: 'Pasta Carbonara', description: 'Authentic Italian pasta with crispy pancetta, egg yolk, and pecorino romano.', price: '$18.00', image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80' },
    { id: 4, category_id: 1, name: 'Caesar Salad', description: 'Crisp romaine lettuce, herb croutons, and parmesan shavings with grilled chicken breast.', price: '$12.00', image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80' },
    { id: 5, category_id: 1, name: 'Tomato Soup', description: 'Creamy roasted tomato soup served with a side of toasted sourdough bread.', price: '$8.00', image_url: 'https://images.unsplash.com/photo-1547592110-803653f54358?auto=format&fit=crop&w=600&q=80' },
    { id: 6, category_id: 2, name: 'Espresso', description: 'Rich and intense single shot of our premium dark roast coffee beans.', price: '$3.00', image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80' },
    { id: 7, category_id: 2, name: 'Latte', description: 'Smooth espresso balanced with silky steamed milk and a light layer of foam.', price: '$4.50', image_url: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=600&q=80' },
    { id: 8, category_id: 2, name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and thick milk foam for a classic experience.', price: '$4.50', image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80' },
    { id: 9, category_id: 2, name: 'Hot Chocolate', description: 'Decadent melted Belgian chocolate whisked with hot milk and topped with cream.', price: '$5.00', image_url: 'https://images.unsplash.com/photo-1544787210-2281403b2f5f?auto=format&fit=crop&w=600&q=80' },
    { id: 10, category_id: 2, name: 'Green Tea', description: 'Organic Japanese sencha green tea with subtle grassy notes and a clean finish.', price: '$3.50', image_url: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80' },
    { id: 11, category_id: 3, name: 'Shirt Washing', description: 'Gentle washing, starching if requested, and professional steam pressing.', price: '$5.00', image_url: 'https://images.unsplash.com/photo-1521639512631-08de26f48521?auto=format&fit=crop&w=600&q=80' },
    { id: 12, category_id: 3, name: 'Suit Dry Cleaning', description: 'Full two-piece suit dry cleaning with hand finishing and protective packaging.', price: '$15.00', image_url: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&w=600&q=80' },
    { id: 13, category_id: 3, name: 'Dress Cleaning', description: 'Specialized cleaning for delicate fabrics, including silk and evening gowns.', price: '$12.00', image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80' },
    { id: 14, category_id: 3, name: 'Pants Ironing', description: 'Precise crease ironing for trousers and casual pants to keep you looking sharp.', price: '$3.00', image_url: 'https://images.unsplash.com/photo-1489007365045-e93007e286a2?auto=format&fit=crop&w=600&q=80' }
  ]
};
