export const initialMockData = {
  settings: {
    hotel_name: 'Royal Grand Hotel',
    logo_url: 'https://picsum.photos/seed/hotel/200/200'
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
  categories: [
    { id: 1, type: 'restaurant', name: 'Restaurant' },
    { id: 2, type: 'cafe', name: 'Cafe' }
  ],
  items: [
    // Restaurant (Category 1)
    { id: 1, category_id: 1, name: 'Grilled Steak', description: 'Juicy beef steak with vegetables', price: '$25.00', image_url: 'https://picsum.photos/seed/steak/400/400' },
    { id: 2, category_id: 1, name: 'Cheeseburger', description: 'Classic burger with cheese', price: '$15.00', image_url: 'https://picsum.photos/seed/burger/400/400' },
    { id: 3, category_id: 1, name: 'Pasta Carbonara', description: 'Creamy pasta with bacon', price: '$18.00', image_url: 'https://picsum.photos/seed/pasta/400/400' },
    { id: 4, category_id: 1, name: 'Caesar Salad', description: 'Fresh salad with chicken', price: '$12.00', image_url: 'https://picsum.photos/seed/salad/400/400' },
    { id: 5, category_id: 1, name: 'Tomato Soup', description: 'Warm tomato soup', price: '$8.00', image_url: 'https://picsum.photos/seed/soup/400/400' },
    // Cafe (Category 2)
    { id: 6, category_id: 2, name: 'Espresso', description: 'Strong shot of coffee', price: '$3.00', image_url: 'https://picsum.photos/seed/espresso/400/400' },
    { id: 7, category_id: 2, name: 'Latte', description: 'Coffee with steamed milk', price: '$4.50', image_url: 'https://picsum.photos/seed/latte/400/400' },
    { id: 8, category_id: 2, name: 'Cappuccino', description: 'Coffee with foam', price: '$4.50', image_url: 'https://picsum.photos/seed/cappuccino/400/400' },
    { id: 9, category_id: 2, name: 'Hot Chocolate', description: 'Rich cocoa drink', price: '$5.00', image_url: 'https://picsum.photos/seed/chocolate/400/400' },
    { id: 10, category_id: 2, name: 'Green Tea', description: 'Healthy green tea', price: '$3.50', image_url: 'https://picsum.photos/seed/tea/400/400' }
  ]
};
