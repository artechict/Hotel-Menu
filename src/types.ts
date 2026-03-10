export interface Category {
  id: number;
  type: 'restaurant' | 'cafe' | 'laundry';
  name_fa: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  name_ku: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name_fa: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  name_ku: string;
  description_fa: string;
  description_en: string;
  description_ar: string;
  description_tr: string;
  description_ku: string;
  price: string;
  image_url: string;
}

export interface HotelInfo {
  id: number;
  key: string;
  label_fa: string;
  label_en: string;
  label_ar: string;
  label_tr: string;
  label_ku: string;
  value_fa: string;
  value_en: string;
  value_ar: string;
  value_tr: string;
  value_ku: string;
}

export interface PhoneNumber {
  id: number;
  name_fa: string;
  name_en: string;
  name_ar: string;
  name_tr: string;
  name_ku: string;
  number: string;
}

export interface AppData {
  categories: Category[];
  items: MenuItem[];
  info: HotelInfo[];
  phones: PhoneNumber[];
}
