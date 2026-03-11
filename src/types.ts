export interface Menu {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  menu_id: number;
  name: string;
  name_ar?: string;
  name_tr?: string;
  name_ku?: string;
  type: string;
  image_url?: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  name_ar?: string;
  name_tr?: string;
  name_ku?: string;
  description: string;
  description_ar?: string;
  description_tr?: string;
  description_ku?: string;
  price: string;
  image_url: string;
}

export interface HotelInfo {
  key: string;
  label: string;
  value: string;
}

export interface PhoneNumber {
  id: number;
  name: string;
  number: string;
}

export interface HotelSettings {
  hotel_name: string;
  logo_url: string;
  tile_images: {
    info: string;
    restaurant: string;
    cafe: string;
    laundry: string;
    phones: string;
  };
}

export interface AppData {
  menus: Menu[];
  categories: Category[];
  items: MenuItem[];
  info: HotelInfo[];
  phones: PhoneNumber[];
  settings: HotelSettings;
}
