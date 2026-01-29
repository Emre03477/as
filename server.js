const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const config = require('./config.json');

const app = express();
const db = new Database('shop.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    minecraft_username TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    type TEXT NOT NULL,
    command TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Insert sample products if table is empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name, description, price, type, command) VALUES (?, ?, ?, ?, ?)');
  insertProduct.run('VIP Rank', 'VIP rank with special permissions', 9.99, 'rank', 'lp user {username} parent set vip');
  insertProduct.run('MVP Rank', 'MVP rank with premium features', 19.99, 'rank', 'lp user {username} parent set mvp');
  insertProduct.run('Diamond Sword', 'Sharp V Diamond Sword', 4.99, 'item', 'give {username} diamond_sword{Enchantments:[{id:sharpness,lvl:5}]} 1');
  insertProduct.run('Starter Kit', 'Full iron armor and tools', 2.99, 'kit', 'give {username} iron_helmet 1; give {username} iron_chestplate 1; give {username} iron_leggings 1; give {username} iron_boots 1');
}

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: config.server.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY price ASC').all();
  res.render('index', { 
    user: req.session.userId ? db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId) : null,
    products: products,
    config: config.minecraft
  });
});

app.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, email, password, minecraft_username } = req.body;
  
  if (!username || !email || !password || !minecraft_username) {
    return res.render('register', { error: 'Tüm alanlar zorunludur' });
  }

  // Validate Minecraft username (3-16 chars, alphanumeric and underscores)
  if (!/^[a-zA-Z0-9_]{3,16}$/.test(minecraft_username)) {
    return res.render('register', { error: 'Geçersiz Minecraft kullanıcı adı (3-16 karakter, sadece harf, rakam ve _)' });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.render('register', { error: 'Geçersiz e-posta adresi' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password, minecraft_username) VALUES (?, ?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword, minecraft_username);
    req.session.userId = result.lastInsertRowid;
    res.redirect('/');
  } catch (error) {
    res.render('register', { error: 'Kayıt başarısız. Lütfen farklı bilgiler deneyin.' });
  }
});

app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login', { error: 'Invalid username or password' });
  }
  
  req.session.userId = user.id;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/shop', requireAuth, (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY price ASC').all();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  res.render('shop', { user, products });
});

app.post('/purchase', requireAuth, async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.userId;
  
  // Validate productId
  if (!productId || isNaN(parseInt(productId))) {
    return res.json({ success: false, message: 'Geçersiz ürün' });
  }
  
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(parseInt(productId));
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  
  if (!product) {
    return res.json({ success: false, message: 'Ürün bulunamadı' });
  }
  
  // Insert purchase record with pending status
  const stmt = db.prepare('INSERT INTO purchases (user_id, product_id, status) VALUES (?, ?, ?)');
  const purchase = stmt.run(userId, productId, 'pending');
  
  // Execute WebSender command(s)
  const websenderService = require('./websender');
  const command = product.command.replace(/{username}/g, user.minecraft_username);
  
  try {
    // Handle multiple commands separated by semicolons
    if (command.includes(';')) {
      const commands = command.split(';').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
      await websenderService.executeCommands(commands);
    } else {
      await websenderService.executeCommand(command);
    }
    
    // Update purchase status to delivered
    db.prepare('UPDATE purchases SET status = ? WHERE id = ?').run('delivered', purchase.lastInsertRowid);
    
    res.json({ 
      success: true, 
      message: `${product.name} ${user.minecraft_username} adlı oyuncuya teslim edildi!` 
    });
  } catch (error) {
    console.error('WebSender error:', error);
    // Update status to failed
    db.prepare('UPDATE purchases SET status = ? WHERE id = ?').run('failed', purchase.lastInsertRowid);
    res.json({ 
      success: false, 
      message: 'Teslimat başarısız oldu. Lütfen yöneticiyle iletişime geçin.' 
    });
  }
});

app.get('/profile', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  const purchases = db.prepare(`
    SELECT p.*, pr.name, pr.description, pr.price 
    FROM purchases p 
    JOIN products pr ON p.product_id = pr.id 
    WHERE p.user_id = ? 
    ORDER BY p.created_at DESC
  `).all(req.session.userId);
  res.render('profile', { user, purchases });
});

const PORT = config.server.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
