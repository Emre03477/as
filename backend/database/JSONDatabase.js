const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * JSON File-Based Database with atomic writes and file locking
 * Production-ready with error recovery and daily backups
 */
class JSONDatabase {
  constructor(dbPath = './backend/database') {
    this.dbPath = dbPath;
    this.lockPath = path.join(dbPath, '.locks');
    this.backupPath = './backend/backups';
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dbPath, { recursive: true });
      await fs.mkdir(this.lockPath, { recursive: true });
      await fs.mkdir(this.backupPath, { recursive: true });
      
      // Initialize database files if they don't exist
      await this.initFile('users.json', []);
      await this.initFile('products.json', this.getDefaultProducts());
      await this.initFile('orders.json', []);
      await this.initFile('logs.json', []);
      await this.initFile('settings.json', this.getDefaultSettings());
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async initFile(filename, defaultData) {
    const filePath = path.join(this.dbPath, filename);
    try {
      await fs.access(filePath);
    } catch {
      await this.write(filename, defaultData);
    }
  }

  getDefaultProducts() {
    return [
      {
        id: crypto.randomUUID(),
        name: 'VIP Rank',
        description: 'VIP rank with exclusive permissions and chat colors',
        price: 9.99,
        type: 'rank',
        command: 'lp user {player} parent add vip',
        duration: 30,
        featured: true,
        discount: 0,
        stock: -1,
        image: '/assets/vip-rank.png',
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'MVP Rank',
        description: 'MVP rank with premium features and priority access',
        price: 19.99,
        type: 'rank',
        command: 'lp user {player} parent add mvp',
        duration: 30,
        featured: true,
        discount: 10,
        stock: -1,
        image: '/assets/mvp-rank.png',
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'Diamond Sword',
        description: 'Sharpness V Diamond Sword with Unbreaking III',
        price: 4.99,
        type: 'item',
        command: 'give {player} diamond_sword{Enchantments:[{id:sharpness,lvl:5},{id:unbreaking,lvl:3}]} 1',
        duration: 0,
        featured: false,
        discount: 0,
        stock: 100,
        image: '/assets/diamond-sword.png',
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'Starter Kit',
        description: 'Full iron armor set with tools',
        price: 2.99,
        type: 'kit',
        command: 'give {player} iron_helmet 1; give {player} iron_chestplate 1; give {player} iron_leggings 1; give {player} iron_boots 1; give {player} iron_sword 1',
        duration: 0,
        featured: false,
        discount: 15,
        stock: -1,
        image: '/assets/starter-kit.png',
        createdAt: new Date().toISOString()
      }
    ];
  }

  getDefaultSettings() {
    return {
      siteName: 'Minecraft Server',
      serverIp: 'play.yourserver.com',
      discordWebhook: '',
      websenderUrl: 'http://localhost:4567',
      websenderSecret: '',
      maintenanceMode: false,
      registrationEnabled: true,
      purchaseEnabled: true,
      theme: {
        primaryColor: '#10b981',
        accentColor: '#34d399'
      }
    };
  }

  async acquireLock(filename) {
    const lockFile = path.join(this.lockPath, `${filename}.lock`);
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      try {
        await fs.writeFile(lockFile, process.pid.toString(), { flag: 'wx' });
        return lockFile;
      } catch (error) {
        if (error.code === 'EEXIST') {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to acquire lock for ${filename}`);
  }

  async releaseLock(lockFile) {
    try {
      await fs.unlink(lockFile);
    } catch (error) {
      console.error('Error releasing lock:', error);
    }
  }

  async read(filename) {
    const filePath = path.join(this.dbPath, filename);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return null;
    }
  }

  async write(filename, data) {
    const filePath = path.join(this.dbPath, filename);
    const tmpPath = `${filePath}.tmp`;
    
    let lockFile;
    try {
      lockFile = await this.acquireLock(filename);
      
      // Atomic write: write to temp file then rename
      await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
      await fs.rename(tmpPath, filePath);
      
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      // Clean up temp file if it exists
      try {
        await fs.unlink(tmpPath);
      } catch {}
      return false;
    } finally {
      if (lockFile) {
        await this.releaseLock(lockFile);
      }
    }
  }

  async backup(filename) {
    const filePath = path.join(this.dbPath, filename);
    const date = new Date().toISOString().split('T')[0];
    const backupFile = path.join(this.backupPath, `${date}-${filename}`);
    
    try {
      await fs.copyFile(filePath, backupFile);
      return true;
    } catch (error) {
      console.error(`Backup error for ${filename}:`, error);
      return false;
    }
  }

  async dailyBackup() {
    const files = ['users.json', 'products.json', 'orders.json', 'logs.json'];
    for (const file of files) {
      await this.backup(file);
    }
  }

  // User operations
  async getUsers() {
    return await this.read('users.json') || [];
  }

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(u => u.id === id);
  }

  async getUserByEmail(email) {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  }

  async getUserByUsername(username) {
    const users = await this.getUsers();
    return users.find(u => u.username === username);
  }

  async createUser(userData) {
    const users = await this.getUsers();
    const newUser = {
      id: crypto.randomUUID(),
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await this.write('users.json', users);
    return newUser;
  }

  async updateUser(id, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      await this.write('users.json', users);
      return users[index];
    }
    return null;
  }

  // Product operations
  async getProducts() {
    return await this.read('products.json') || [];
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async createProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: crypto.randomUUID(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    await this.write('products.json', products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      await this.write('products.json', products);
      return products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await this.write('products.json', filtered);
    return filtered.length < products.length;
  }

  // Order operations
  async getOrders() {
    return await this.read('orders.json') || [];
  }

  async getOrdersByUserId(userId) {
    const orders = await this.getOrders();
    return orders.filter(o => o.userId === userId);
  }

  async createOrder(orderData) {
    const orders = await this.getOrders();
    const newOrder = {
      id: crypto.randomUUID(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await this.write('orders.json', orders);
    return newOrder;
  }

  async updateOrder(id, updates) {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      await this.write('orders.json', orders);
      return orders[index];
    }
    return null;
  }

  // Log operations
  async addLog(logData) {
    const logs = await this.read('logs.json') || [];
    const newLog = {
      id: crypto.randomUUID(),
      ...logData,
      timestamp: new Date().toISOString()
    };
    logs.push(newLog);
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    await this.write('logs.json', logs);
    return newLog;
  }

  async getLogs(limit = 100) {
    const logs = await this.read('logs.json') || [];
    return logs.slice(-limit).reverse();
  }

  // Settings operations
  async getSettings() {
    return await this.read('settings.json') || this.getDefaultSettings();
  }

  async updateSettings(updates) {
    const settings = await this.getSettings();
    const newSettings = { ...settings, ...updates };
    await this.write('settings.json', newSettings);
    return newSettings;
  }
}

module.exports = JSONDatabase;
