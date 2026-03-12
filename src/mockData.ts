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
    { id: 1, category_id: 1, name: 'Jajik', description: '', price: '', image_url: '' },
    { id: 2, category_id: 1, name: 'Hummus', description: '', price: '', image_url: '' },
    { id: 3, category_id: 1, name: 'Oriental Salad', description: '', price: '', image_url: '' },
    { id: 4, category_id: 1, name: 'Fattoush Salad', description: '', price: '', image_url: '' },
    { id: 5, category_id: 1, name: 'Olives', description: '', price: '', image_url: '' },
    { id: 6, category_id: 1, name: 'Dates', description: '', price: '', image_url: '' },
    { id: 7, category_id: 1, name: 'Lentil Soup', description: '', price: '', image_url: '' },
    { id: 8, category_id: 1, name: 'Bean Stew', description: '', price: '', image_url: '' },
    { id: 9, category_id: 1, name: 'White Rice', description: '', price: '', image_url: '' },
    { id: 10, category_id: 1, name: 'Lamb Kebab', description: '', price: '', image_url: '' },
    { id: 11, category_id: 1, name: 'Chicken Tikka', description: '', price: '', image_url: '' },
    { id: 12, category_id: 1, name: 'Lamb Kofte', description: '', price: '', image_url: '' },
    { id: 13, category_id: 1, name: 'Lamb Tikka', description: '', price: '', image_url: '' },
    { id: 14, category_id: 1, name: 'Chicken Thigh', description: '', price: '', image_url: '' },
    { id: 15, category_id: 1, name: 'Roasted Tomato + Onion + Pepper', description: '', price: '', image_url: '' },
    { id: 16, category_id: 1, name: 'Tea', description: '', price: '', image_url: '' },
    { id: 17, category_id: 1, name: 'Ayran', description: '', price: '', image_url: '' },
    { id: 18, category_id: 1, name: 'Orange Juice', description: '', price: '', image_url: '' },
    { id: 19, category_id: 1, name: 'Grapes', description: '', price: '', image_url: '' },
    { id: 20, category_id: 1, name: 'Apples', description: '', price: '', image_url: '' },
    { id: 21, category_id: 1, name: 'Oranges', description: '', price: '', image_url: '' },
    { id: 22, category_id: 1, name: 'Bananas', description: '', price: '', image_url: '' },
    { id: 23, category_id: 2, name: 'Espresso', description: 'Rich and intense single shot of our premium dark roast coffee beans.', price: '$3.00', image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80' },
    { id: 24, category_id: 2, name: 'Latte', description: 'Smooth espresso balanced with silky steamed milk and a light layer of foam.', price: '$4.50', image_url: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=600&q=80' },
    { id: 25, category_id: 2, name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and thick milk foam for a classic experience.', price: '$4.50', image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80' },
    { id: 26, category_id: 2, name: 'Hot Chocolate', description: 'Decadent melted Belgian chocolate whisked with hot milk and topped with cream.', price: '$5.00', image_url: 'https://images.unsplash.com/photo-1544787210-2281403b2f5f?auto=format&fit=crop&w=600&q=80' },
    { id: 27, category_id: 2, name: 'Green Tea', description: 'Organic Japanese sencha green tea with subtle grassy notes and a clean finish.', price: '$3.50', image_url: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80' },
    { id: 28, category_id: 3, name: 'Shirt Washing', description: 'Gentle washing, starching if requested, and professional steam pressing.', price: '$5.00', image_url: 'https://images.unsplash.com/photo-1521639512631-08de26f48521?auto=format&fit=crop&w=600&q=80' },
    { id: 29, category_id: 3, name: 'Suit Dry Cleaning', description: 'Full two-piece suit dry cleaning with hand finishing and protective packaging.', price: '$15.00', image_url: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&w=600&q=80' },
    { id: 30, category_id: 3, name: 'Dress Cleaning', description: 'Specialized cleaning for delicate fabrics, including silk and evening gowns.', price: '$12.00', image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80' },
    { id: 31, category_id: 3, name: 'Pants Ironing', description: 'Precise crease ironing for trousers and casual pants to keep you looking sharp.', price: '$3.00', image_url: 'https://images.unsplash.com/photo-1489007365045-e93007e286a2?auto=format&fit=crop&w=600&q=80' }
  ]
};
