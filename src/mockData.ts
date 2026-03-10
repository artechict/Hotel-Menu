export const initialMockData = {
  settings: {
    hotel_name: 'هتل بزرگ پارسیان',
    logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'
  },
  info: [
    { key: 'checkin', label: 'ساعت ورود', value: '۱۴:۰۰' },
    { key: 'checkout', label: 'ساعت خروج', value: '۱۲:۰۰' },
    { key: 'wifi', label: 'رمز وای‌فای', value: 'Parsian123' }
  ],
  phones: [
    { id: 1, name: 'پذیرش', number: '۱۰۰' },
    { id: 2, name: 'رستوران', number: '۱۰۱' }
  ],
  categories: [
    { id: 1, type: 'restaurant', name: 'غذاهای ایرانی' },
    { id: 2, type: 'cafe', name: 'نوشیدنی‌های گرم' }
  ],
  items: [
    { id: 1, category_id: 1, name: 'چلو کباب کوبیده', description: 'دو سیخ کباب کوبیده', price: '۲۵۰,۰۰۰ تومان', image_url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=400&q=80' }
  ]
};
