export interface Category {
  id: number;
  type: string;
  name: string;
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
  id: number;
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
  categories: Category[];
  items: MenuItem[];
  info: HotelInfo[];
  phones: PhoneNumber[];
}
