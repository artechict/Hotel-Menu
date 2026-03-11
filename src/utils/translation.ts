export type Language = 'en' | 'ar' | 'tr' | 'ku';

export const UI_STRINGS = {
  en: {
    hotelName: 'Royal Hotel', welcome: 'Welcome', info: 'Info', restaurant: 'Restaurant', cafe: 'Cafe', laundry: 'Laundry', contact: 'Contact', admin: 'Admin', home: 'Home',
    login: 'Admin Login', password: 'Password', enter: 'Login', logout: 'Logout', workingHours: 'Working Hours & Info', internalPhones: 'Internal Phones',
    noItems: 'No items to display.', callInstruction: 'To call from your room, dial the numbers above.',
    adminTitle: 'Professional Admin Panel', hotelSettings: 'Hotel Settings', catMgmt: 'Category Management', itemMgmt: 'Menu Management', phoneMgmt: 'Contact Management',
    add: 'Add', delete: 'Delete', save: 'Save', name: 'Name', desc: 'Description', price: 'Price', imageUrl: 'Image URL', type: 'Type',
    catName: 'Category Name', itemName: 'Item Name', phoneName: 'Section Name', phoneNumber: 'Number', selectCat: 'Select Category...',
  },
  ar: {
    hotelName: 'فندق رويال', welcome: 'أهلاً بك', info: 'معلومات', restaurant: 'مطعم', cafe: 'مقهى', laundry: 'مغسلة', contact: 'اتصل بنا', admin: 'مدير', home: 'الرئيسية',
    login: 'تسجيل دخول المدير', password: 'كلمة المرور', enter: 'دخول', logout: 'خروج', workingHours: 'ساعات العمل ومعلومات', internalPhones: 'هواتف داخلية',
    noItems: 'لا توجد عناصر لعرضها.', callInstruction: 'للاتصال من غرفتك، اطلب الأرقام أعلاه.',
    adminTitle: 'لوحة تحكم المدير', hotelSettings: 'إعدادات الفندق', catMgmt: 'إدارة الفئات', itemMgmt: 'إدارة القائمة', phoneMgmt: 'إدارة جهات الاتصال',
    add: 'إضافة', delete: 'حذف', save: 'حفظ', name: 'الاسم', desc: 'الوصف', price: 'السعر', imageUrl: 'رابط الصورة', type: 'النوع',
    catName: 'اسم الفئة', itemName: 'اسم العنصر', phoneName: 'اسم القسم', phoneNumber: 'الرقم', selectCat: 'اختر فئة...',
  },
  tr: {
    hotelName: 'Royal Otel', welcome: 'Hoş Geldiniz', info: 'Bilgi', restaurant: 'Restoran', cafe: 'Kafe', laundry: 'Çamaşırhane', contact: 'İletişim', admin: 'Yönetici', home: 'Ana Sayfa',
    login: 'Yönetici Girişi', password: 'Şifre', enter: 'Giriş', logout: 'Çıkış', workingHours: 'Çalışما Saatleri & Bilgi', internalPhones: 'Dahili Telefonlar',
    noItems: 'Görüntülenecek öğe yok.', callInstruction: 'Odanızdan aramak için yukarıdaki numaraları tuşlayın.',
    adminTitle: 'Profesyonel Yönetici Paneli', hotelSettings: 'Otel Ayarları', catMgmt: 'Kategori Yönetimi', itemMgmt: 'Menü Yönetimi', phoneMgmt: 'İletişim Yönetimi',
    add: 'Ekle', delete: 'Sil', save: 'Kaydet', name: 'İsim', desc: 'Açıklama', price: 'Fiyat', imageUrl: 'Resim URL', type: 'Tür',
    catName: 'Kategori Adı', itemName: 'Öğe Adı', phoneName: 'Bölüm Adı', phoneNumber: 'Numara', selectCat: 'Kategori Seç...',
  },
  ku: {
    hotelName: 'فۆتێلی ڕۆیاڵ', welcome: 'بەخێربێیت', info: 'زانیاری', restaurant: 'چێشتخانە', cafe: 'کافێ', laundry: 'جلشۆر', contact: 'پەیوەندی', admin: 'بەڕێوەبەر', home: 'سەرەکی',
    login: 'چوونەژوورەوەی بەڕێوەبەر', password: 'وشەی نهێنی', enter: 'چوونەژوورەوە', logout: 'چوونەدەرەوە', workingHours: 'کاتەکانی کارکردن و زانیاری', internalPhones: 'تەلەفۆنە ناوخۆییەکان',
    noItems: 'هیچ بڕگەیەک نییە بۆ پیشاندان.', callInstruction: 'بۆ پەیوەندیکردن لە ژوورەکەتەوە، ژمارەکانی سەرەوە لێبدە.',
    adminTitle: 'پانێڵی بەڕێوەبردنی پێشەیی', hotelSettings: 'ڕێکخستنەکانی هۆتێل', catMgmt: 'بەڕێوەبردنی جۆرەکان', itemMgmt: 'بەڕێوەبردنی لیست', phoneMgmt: 'بەڕێوەبردنی پەیوەندییەکان',
    add: 'زیادکردن', delete: 'سڕینەوە', save: 'پاشکەوتکردن', name: 'ناو', desc: 'وەسف', price: 'نرخ', imageUrl: 'بەستەری وێنە', type: 'جۆر',
    catName: 'ناوی جۆر', itemName: 'ناوی بڕگە', phoneName: 'ناوی بەش', phoneNumber: 'ژمارە', selectCat: 'جۆرێک هەڵبژێرە...',
  }
};

export const getTranslated = (obj: any, field: string, lang: string) => {
  if (!obj) return '';
  if (lang === 'en') return obj[field] || '';
  const translated = obj[`${field}_${lang}`];
  return translated || obj[field] || '';
};
