export interface Menu {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  menu_id: number;
  name: string;
  type: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
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

export interface AppData {
  menus: Menu[];
  categories: Category[];
  items: MenuItem[];
  info: HotelInfo[];
  phones: PhoneNumber[];
}
