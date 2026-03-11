-- Create tables for the Hotel App

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  hotel_name TEXT NOT NULL,
  logo_url TEXT,
  tile_images JSONB DEFAULT '{"info": "", "restaurant": "", "cafe": "", "laundry": "", "phones": ""}'::jsonb
);

-- Info table
CREATE TABLE IF NOT EXISTS info (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL
);

-- Phones table
CREATE TABLE IF NOT EXISTS phones (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  number TEXT NOT NULL
);

-- Menus table
CREATE TABLE IF NOT EXISTS menus (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  menu_id BIGINT REFERENCES menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'restaurant',
  image_url TEXT
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT
);

-- Enable Row Level Security (RLS)
-- For this demo, we'll allow public read and authenticated write
-- In a production app, you'd want more granular control

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE info ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read access for info" ON info FOR SELECT USING (true);
CREATE POLICY "Public read access for phones" ON phones FOR SELECT USING (true);
CREATE POLICY "Public read access for menus" ON menus FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for items" ON items FOR SELECT USING (true);

-- Authenticated write access (for admin)
-- Note: In this simple setup, we'll just allow all authenticated users to write
-- or even public if you don't have auth set up yet.
-- For now, let's allow public write for simplicity in the demo, 
-- but warn the user to secure it later.

CREATE POLICY "Public write access for settings" ON settings FOR ALL USING (true);
CREATE POLICY "Public write access for info" ON info FOR ALL USING (true);
CREATE POLICY "Public write access for phones" ON phones FOR ALL USING (true);
CREATE POLICY "Public write access for menus" ON menus FOR ALL USING (true);
CREATE POLICY "Public write access for categories" ON categories FOR ALL USING (true);
CREATE POLICY "Public write access for items" ON items FOR ALL USING (true);
