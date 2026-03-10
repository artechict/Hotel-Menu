export const initialMockData = {
  settings: {
    hotel_name: 'Royal Grand Hotel',
    logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },
  info: [
    { key: 'checkin', label: 'Check-in', value: '14:00' },
    { key: 'checkout', label: 'Check-out', value: '12:00' },
    { key: 'wifi', label: 'Wi-Fi Password', value: 'Royal123' }
  ],
  phones: [
    { id: 1, name: 'Reception', number: '100' },
    { id: 2, name: 'Restaurant', number: '101' }
  ],
  categories: [
    { id: 1, type: 'restaurant', name: 'Main Courses' },
    { id: 2, type: 'cafe', name: 'Hot Drinks' }
  ],
  items: [
    { id: 1, category_id: 1, name: 'Grilled Kebab', description: 'Two skewers of grilled kebab', price: '250,000 Toman', image_url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=400&q=80' }
  ]
};
