import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hotel.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name_fa TEXT,
    name_en TEXT,
    name_ar TEXT,
    name_tr TEXT,
    name_ku TEXT
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name_fa TEXT,
    name_en TEXT,
    name_ar TEXT,
    name_tr TEXT,
    name_ku TEXT,
    description_fa TEXT,
    description_en TEXT,
    description_ar TEXT,
    description_tr TEXT,
    description_ku TEXT,
    price TEXT,
    image_url TEXT,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS hotel_info (
    key TEXT PRIMARY KEY,
    label_fa TEXT,
    label_en TEXT,
    label_ar TEXT,
    label_tr TEXT,
    label_ku TEXT,
    value_fa TEXT,
    value_en TEXT,
    value_ar TEXT,
    value_tr TEXT,
    value_ku TEXT
  );

  CREATE TABLE IF NOT EXISTS phone_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_fa TEXT,
    name_en TEXT,
    name_ar TEXT,
    name_tr TEXT,
    name_ku TEXT,
    number TEXT NOT NULL
  );
`);

// Seed initial data if empty
const categoryCount = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCat = db.prepare("INSERT INTO categories (type, name_fa, name_en, name_ar, name_tr, name_ku) VALUES (?, ?, ?, ?, ?, ?)");
  const restId = insertCat.run("restaurant", "غذاهای اصلی", "Main Courses", "الأطباق الرئيسية", "Ana Yemekler", "ژەمە سەرەکییەکان").lastInsertRowid;
  const cafeId = insertCat.run("cafe", "نوشیدنی‌های گرم", "Hot Drinks", "مشروبات ساخنة", "Sıcak İçecekler", "خواردنەوە گەرمەکان").lastInsertRowid;
  const laundryId = insertCat.run("laundry", "شستشو و اتو", "Laundry & Ironing", "غسيل وكي", "Yıkama ve Üتü", "شوشتن و ئوتوکردن").lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO menu_items (
      category_id, name_fa, name_en, name_ar, name_tr, name_ku, 
      description_fa, description_en, description_ar, description_tr, description_ku, 
      price, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Restaurant Items
  insertItem.run(restId, "چلو کباب سلطانی", "Soltani Kebab", "کباب سلطاني", "Soltani Kebap", "کەبابی سوڵتانی", "گوشت تازه گوسفندی به همراه برنج ایرانی", "Fresh lamb meat with Iranian rice", "لحم ضأن طازج مع أرز إيراني", "İran pirinci ile taze kuzu eti", "گۆشتی بەرخی تازە لەگەڵ برنجی ئێرانی", "۴۵۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80");
  insertItem.run(restId, "جوجه کباب زعفرانی", "Saffron Chicken Kebab", "کباب دجاج بالزعفران", "Safranlı Tavuk Kebap", "کەبابی مریشکی زەعفەرانی", "سینه مرغ مرینیت شده با زعفران درجه یک", "Chicken breast marinated with premium saffron", "صدر دجاج متبل بالزعفران الفاخر", "Birinci sınıf safran ile marine edilmiş tavuk göğsü", "سنگی مریشک کە بە زەعفەرانی نایاب مارینیت کراوە", "۳۲۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80");
  insertItem.run(restId, "قورمه سبزی", "Ghormeh Sabzi", "قورمة سبزي", "Ghormeh Sabzi", "قورمە سەبزی", "خورشت سنتی ایرانی با سبزیجات تازه و گوشت", "Traditional Iranian stew with fresh herbs and meat", "مرق إيراني تقليدي بالأعشاب الطازجة واللحم", "Taze otlar ve et ile geleneksel İran yahnisi", "شۆربای تەقلیدی ئێرانی بە سەوزەی تازە و گۆشت", "۲۸۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80");
  insertItem.run(restId, "زرشک پلو با مرغ", "Zereshk Polo with Chicken", "أرز بالزرشك مع الدجاج", "Zereshk Polo Tavuklu", "زەرشک پڵاو بە مریشک", "ران مرغ سرخ شده به همراه برنج و زرشک نایاب", "Fried chicken leg with rice and premium barberries", "فخذ دجاج مقلي مع أرز وزرشك فاخر", "Pirinç ve birinci sınıf kızamık ile kızarmış tavuk budu", "ڕانی مریشکی سوورکراوە لەگەڵ برنج و زەرشکی نایاب", "۳۱۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80");
  insertItem.run(restId, "ماهی قزل‌آلا", "Grilled Trout", "سمك السلمون المرقط المشوي", "Izgara Alabalık", "ماسی قزڵاڵای برژاو", "ماهی قزل‌آلا کبابی با دورچین سبزیجات", "Grilled trout with vegetable side dish", "سلمون مرقط مشوي مع خضروات جانبية", "Sebze garnitürü ile ızgara alabalık", "ماسی قزڵاڵای برژاو لەگەڵ سەوزەوات", "۳۹۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80");

  // Cafe Items
  insertItem.run(cafeId, "اسپرسو", "Espresso", "إسبريسو", "Espresso", "ئێسپێرێسۆ", "۱۰۰٪ عربیکا", "100% Arabica", "١٠٠٪ أرابيكا", "%100 Arabica", "١٠٠٪ عەرەبیکا", "۸۵,۰۰۰ تومان", "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80");
  insertItem.run(cafeId, "کاپوچینو", "Cappuccino", "كابتشينو", "Cappuccino", "کاپوچینۆ", "ترکیب اسپرسو و شیر فوم گرفته شده", "Combination of espresso and foamed milk", "مزيج من الإسبريسو والحليب الرغوي", "Espresso ve köpürtülmüş süt karışımı", "تێکەڵەی ئێسپێرێسۆ و شیری کەفدار", "۱۱۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80");
  insertItem.run(cafeId, "لاته آرت", "Latte Art", "لاتيه آرت", "Latte Art", "لاتێ ئارت", "شیر گرم و اسپرسو با طرح‌های هنری", "Hot milk and espresso with artistic designs", "حليب ساخن وإسبريسو بتصامیم فنية", "Sanatsal tasarımlarla sıcak süt ve espresso", "شیری گەرم و ئێسپێرێسۆ بە دیزاینی هونەری", "۱۱۵,۰۰۰ تومان", "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=400&q=80");
  insertItem.run(cafeId, "چای ایرانی", "Persian Tea", "شاي إيراني", "İran Çayı", "چای ئێرانی", "چای دم‌کشیده لاهیجان به همراه نبات", "Brewed Lahijan tea with rock candy", "شاي لاهيجان المخمر مع نبات السكر", "Kaya şekeri ile demlenmiş Lahijan çayı", "چای لاهیجانی لێنراو لەگەڵ نەبات", "۶۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80");
  insertItem.run(cafeId, "کیک شکلاتی", "Chocolate Cake", "كعكة الشوكولاتة", "Çikolatalı Pasta", "کێکی شوکولاتە", "کیک خانگی با شکلات بلژیکی", "Homemade cake with Belgian chocolate", "كعكة منزلية بالشوكولاتة البلجيكية", "Belçika çikolatalı ev yapımı pasta", "کێکی ماڵەوە بە شوکولاتەی بەلجیکی", "۱۴۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80");

  // Laundry Items
  insertItem.run(laundryId, "کت و شلوار", "Suit", "بدلة", "Takım Elbise", "قات و پانتۆڵ", "شستشو و اتو بخار", "Washing and steam ironing", "غسيل وكي بالبخار", "Yıkama ve buharlı ütüleme", "شوشتن و ئوتوکردنی هەڵمی", "۱۸۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1594932224456-8069973ddee6?auto=format&fit=crop&w=400&q=80");
  insertItem.run(laundryId, "پیراهن", "Shirt", "قميص", "Gömlek", "کراس", "شستشو و اتو", "Washing and ironing", "غسيل وكي", "Yıkama ve ütüleme", "شوشتن و ئوتوکردن", "۷۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=400&q=80");
  insertItem.run(laundryId, "لباس مجلسی", "Evening Dress", "فستان سهرة", "Abiye Elbise", "جلوبەرگی بۆنەکان", "خشک‌شویی تخصصی", "Professional dry cleaning", "تنظيف جاف متخصص", "Profesyonel kuru temizleme", "وشککردنەوەی پسپۆڕانە", "۲۵۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80");
  insertItem.run(laundryId, "شلوار جین", "Jeans", "بنطلون جينز", "Kot Pantolon", "پانتۆڵی جینز", "شستشو و نرم‌کننده", "Washing and softener", "غسيل ومنعم", "Yıkama ve yumuşatıcı", "شوشتن و نەرمکەرەوە", "۸۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80");
  insertItem.run(laundryId, "پالتو", "Overcoat", "معطف", "Palto", "پاڵتۆ", "شستشو و ضدعفونی", "Washing and disinfection", "غسيل وتعقيم", "Yıkama ve dezenfeksiyon", "شوشتن و پاکژکردنەوە", "۲۲۰,۰۰۰ تومان", "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80");

  const insertInfo = db.prepare(`
    INSERT INTO hotel_info (key, label_fa, label_en, label_ar, label_tr, label_ku, value_fa, value_en, value_ar, value_tr, value_ku) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertInfo.run("check_in", "ساعت ورود", "Check-in Time", "وقت تسجيل الوصول", "Giriş Saati", "کاتی چوونە ژوورەوە", "۱۴:۰۰", "14:00", "١٤:٠٠", "14:00", "١٤:٠٠");
  insertInfo.run("check_out", "ساعت خروج", "Check-out Time", "وقت تسجيل الخروج", "Çıkış Saati", "کاتی چوونەدەرەوە", "۱۲:۰۰", "12:00", "١٢:٠٠", "12:00", "١٢:٠٠");
  insertInfo.run("breakfast", "ساعت صبحانه", "Breakfast Time", "وقت الإفطار", "Kahvaltı Saati", "کاتی نانی بەیانی", "۰۷:۳۰ تا ۱۰:۳۰", "07:30 to 10:30", "٠٧:٣٠ إلى ١٠:٣٠", "07:30 - 10:30", "٠٧:٣٠ بۆ ١٠:٣٠");
  insertInfo.run("lunch", "ساعت ناهار", "Lunch Time", "وقت الغداء", "Öğle Yemeği Saati", "کاتی نانی نیوەڕۆ", "۱۳:۰۰ تا ۱۵:۳۰", "13:00 to 15:30", "١٣:٠٠ إلى ١٥:٣٠", "13:00 - 15:30", "١٣:٠٠ بۆ ١٥:٣٠");
  insertInfo.run("dinner", "ساعت شام", "Dinner Time", "وقت الغداء", "Dinner Time", "کاتی نانی ئێوارە", "۱۹:۳۰ تا ۲۲:۳۰", "19:30 to 22:30", "١٩:٣٠ إلى ٢٢:٣٠", "19:30 - 22:30", "١٩:٣٠ بۆ ٢٢:٣٠");

  const insertPhone = db.prepare("INSERT INTO phone_numbers (name_fa, name_en, name_ar, name_tr, name_ku, number) VALUES (?, ?, ?, ?, ?, ?)");
  insertPhone.run("پذیرش", "Reception", "الاستقبال", "Resepsiyon", "پێشوازی", "100");
  insertPhone.run("روم سرویس", "Room Service", "خدمة الغرف", "Oda Servisi", "خزمەتگوزاری ژوور", "105");
  insertPhone.run("خانه‌داری", "Housekeeping", "التدبير المنزلي", "Kat Hizmetleri", "ماڵداری", "110");
  insertPhone.run("لاندری", "Laundry", "المغسلة", "Çamaşırhane", "لاندری", "115");
  insertPhone.run("نگهبانی", "Security", "الأمن", "Güvenlik", "ئاسایش", "120");

  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("hotel_name", "Royal Hotel");
  insertSetting.run("logo_url", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/data", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    const items = db.prepare("SELECT * FROM menu_items").all();
    const info = db.prepare("SELECT * FROM hotel_info").all();
    const phones = db.prepare("SELECT * FROM phone_numbers").all();
    const settings = db.prepare("SELECT * FROM settings").all();
    res.json({ categories, items, info, phones, settings });
  });

  // Admin API
  app.put("/api/settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(value, key);
    res.json({ success: true });
  });

  app.put("/api/categories/:id", (req, res) => {
    const { name_fa, name_en, name_ar, name_tr, name_ku } = req.body;
    db.prepare("UPDATE categories SET name_fa = ?, name_en = ?, name_ar = ?, name_tr = ?, name_ku = ? WHERE id = ?").run(name_fa, name_en, name_ar, name_tr, name_ku, req.params.id);
    res.json({ success: true });
  });

  app.put("/api/items/:id", (req, res) => {
    const { name_fa, name_en, name_ar, name_tr, name_ku, description_fa, description_en, description_ar, description_tr, description_ku, price, image_url } = req.body;
    db.prepare(`UPDATE menu_items SET name_fa = ?, name_en = ?, name_ar = ?, name_tr = ?, name_ku = ?, description_fa = ?, description_en = ?, description_ar = ?, description_tr = ?, description_ku = ?, price = ?, image_url = ? WHERE id = ?`).run(name_fa, name_en, name_ar, name_tr, name_ku, description_fa, description_en, description_ar, description_tr, description_ku, price, image_url, req.params.id);
    res.json({ success: true });
  });

  app.put("/api/phones/:id", (req, res) => {
    const { name_fa, name_en, name_ar, name_tr, name_ku, number } = req.body;
    db.prepare("UPDATE phone_numbers SET name_fa = ?, name_en = ?, name_ar = ?, name_tr = ?, name_ku = ?, number = ? WHERE id = ?").run(name_fa, name_en, name_ar, name_tr, name_ku, number, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/categories", (req, res) => {
    const { type, name_fa, name_en, name_ar, name_tr, name_ku } = req.body;
    const result = db.prepare("INSERT INTO categories (type, name_fa, name_en, name_ar, name_tr, name_ku) VALUES (?, ?, ?, ?, ?, ?)").run(type, name_fa, name_en, name_ar, name_tr, name_ku);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/categories/:id", (req, res) => {
    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/items", (req, res) => {
    const { category_id, name_fa, name_en, name_ar, name_tr, name_ku, description_fa, description_en, description_ar, description_tr, description_ku, price, image_url } = req.body;
    const result = db.prepare(`
      INSERT INTO menu_items (category_id, name_fa, name_en, name_ar, name_tr, name_ku, description_fa, description_en, description_ar, description_tr, description_ku, price, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(category_id, name_fa, name_en, name_ar, name_tr, name_ku, description_fa, description_en, description_ar, description_tr, description_ku, price, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/items/:id", (req, res) => {
    db.prepare("DELETE FROM menu_items WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/info", (req, res) => {
    const { key, value_fa, value_en, value_ar, value_tr, value_ku } = req.body;
    db.prepare("UPDATE hotel_info SET value_fa = ?, value_en = ?, value_ar = ?, value_tr = ?, value_ku = ? WHERE key = ?").run(value_fa, value_en, value_ar, value_tr, value_ku, key);
    res.json({ success: true });
  });

  app.post("/api/phones", (req, res) => {
    const { name_fa, name_en, name_ar, name_tr, name_ku, number } = req.body;
    const result = db.prepare("INSERT INTO phone_numbers (name_fa, name_en, name_ar, name_tr, name_ku, number) VALUES (?, ?, ?, ?, ?, ?)").run(name_fa, name_en, name_ar, name_tr, name_ku, number);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/phones/:id", (req, res) => {
    db.prepare("DELETE FROM phone_numbers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
