import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'store.json');

// Middleware for parsing JSON with generous limit for media uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to load database store
function loadStore() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { products: [], categories: [], reviews: [], stories: [], settings: {}, orders: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading store.json:', err);
    return { products: [], categories: [], reviews: [], stories: [], settings: {}, orders: [] };
  }
}

// Helper to save database store atomically
function saveStore(data: any) {
  try {
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
    return true;
  } catch (err) {
    console.error('Error saving store.json:', err);
    return false;
  }
}

// API Routes

// 1. Get products (with filtering, search, sorting)
app.get('/api/products', (req, res) => {
  const store = loadStore();
  let list = [...(store.products || [])];
  const { category, search, sort, featured, newArrival, bestSeller } = req.query;

  if (category && category !== 'all') {
    const catStr = String(category).toLowerCase();
    list = list.filter((p: any) => 
      p.category?.toLowerCase() === catStr ||
      p.category?.toLowerCase().includes(catStr) ||
      p.subCategory?.toLowerCase().includes(catStr)
    );
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter((p: any) => 
      p.name?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.stones?.toLowerCase().includes(q)
    );
  }

  if (featured === 'true') {
    list = list.filter((p: any) => p.isFeatured);
  }

  if (newArrival === 'true') {
    list = list.filter((p: any) => p.isNewArrival);
  }

  if (bestSeller === 'true') {
    list = list.filter((p: any) => p.isBestSeller);
  }

  if (sort === 'price-low') {
    list.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a: any, b: any) => b.price - a.price);
  } else if (sort === 'code') {
    list.sort((a: any, b: any) => a.code.localeCompare(b.code));
  }

  res.json({ success: true, count: list.length, products: list });
});

// 2. Get single product by id, code or slug
app.get('/api/products/:id', (req, res) => {
  const store = loadStore();
  const idOrSlug = req.params.id.toLowerCase();
  const product = (store.products || []).find((p: any) => 
    p.id.toLowerCase() === idOrSlug || 
    p.slug.toLowerCase() === idOrSlug ||
    p.code.toLowerCase() === idOrSlug
  );

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Also include 4 related products from same or adjacent category
  const related = (store.products || [])
    .filter((p: any) => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
    .slice(0, 4);

  res.json({ success: true, product, related });
});

// 3. Add product (Admin)
app.post('/api/products', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  const store = loadStore();
  const newProduct = req.body;

  if (!newProduct.name || !newProduct.price) {
    return res.status(400).json({ success: false, message: 'Name and price are required' });
  }

  const count = (store.products || []).length + 1;
  const code = newProduct.code || `AJ-${String(count).padStart(2, '0')}`;
  const id = newProduct.id || code.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const created = {
    ...newProduct,
    id,
    code,
    slug,
    price: Number(newProduct.price),
    originalPrice: Number(newProduct.originalPrice || Math.round(Number(newProduct.price) * 1.25)),
    discountPercentage: 20,
    inStock: newProduct.inStock !== false,
    isNewArrival: !!newProduct.isNewArrival,
    isFeatured: !!newProduct.isFeatured,
    isBestSeller: !!newProduct.isBestSeller,
    image: newProduct.image || '/assets/aistudio/IMG-20261105-WA0019_f5ddb6ed.jpg',
    additionalImages: newProduct.additionalImages || [newProduct.image || '/assets/aistudio/IMG-20261105-WA0019_f5ddb6ed.jpg']
  };

  store.products = [created, ...(store.products || [])];
  saveStore(store);

  res.status(201).json({ success: true, product: created });
});

// 4. Update product (Admin)
app.put('/api/products/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  const store = loadStore();
  const targetId = req.params.id.toLowerCase();
  const index = (store.products || []).findIndex((p: any) => p.id.toLowerCase() === targetId || p.code.toLowerCase() === targetId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const updated = {
    ...store.products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : store.products[index].price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : store.products[index].originalPrice
  };

  store.products[index] = updated;
  saveStore(store);

  res.json({ success: true, product: updated });
});

// 5. Delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  const store = loadStore();
  const targetId = req.params.id.toLowerCase();
  const initialLen = (store.products || []).length;
  store.products = (store.products || []).filter((p: any) => p.id.toLowerCase() !== targetId && p.code.toLowerCase() !== targetId);

  if (store.products.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  saveStore(store);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 6. Get categories
app.get('/api/categories', (req, res) => {
  const store = loadStore();
  res.json({ success: true, categories: store.categories || [] });
});

// 7. Get store settings & policies
app.get('/api/settings', (req, res) => {
  const store = loadStore();
  res.json({ success: true, settings: store.settings || {} });
});

// 8. Update store settings (Admin)
app.put('/api/settings', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  const store = loadStore();
  store.settings = { ...store.settings, ...req.body };
  saveStore(store);
  res.json({ success: true, settings: store.settings });
});

// 9. Get customer reviews
app.get('/api/reviews', (req, res) => {
  const store = loadStore();
  res.json({ success: true, reviews: store.reviews || [] });
});

// 10. Record an order enquiry (WhatsApp checkout or email checkout)
app.post('/api/orders', (req, res) => {
  const store = loadStore();
  const { customerName, customerPhone, customerEmail, items, totalAmount, channel, notes } = req.body;

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `AJ-${new Date().getFullYear()}-${randomSuffix}`;

  const newOrder = {
    id: orderId,
    customerName: customerName || 'Valued Client',
    customerPhone: customerPhone || '',
    customerEmail: customerEmail || '',
    items: items || [],
    totalAmount: Number(totalAmount || 0),
    channel: channel || 'WhatsApp',
    notes: notes || '',
    status: 'Enquiry Received',
    createdAt: new Date().toISOString()
  };

  store.orders = [newOrder, ...(store.orders || [])];
  saveStore(store);

  res.status(201).json({ success: true, order: newOrder });
});

// 11. Get all orders (Admin)
app.get('/api/orders', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  const store = loadStore();
  res.json({ success: true, orders: store.orders || [] });
});

// 12. Update order status (Admin)
app.put('/api/orders/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  const store = loadStore();
  const orderId = req.params.id;
  const index = (store.orders || []).findIndex((o: any) => o.id === orderId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  store.orders[index] = {
    ...store.orders[index],
    status: req.body.status || store.orders[index].status,
    notes: req.body.notes !== undefined ? req.body.notes : store.orders[index].notes
  };

  saveStore(store);
  res.json({ success: true, order: store.orders[index] });
});

// 13. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // Default owner passcode is 'anjali2026' or configured
  if (password === 'anjali2026' || password === 'admin123') {
    return res.json({
      success: true,
      token: 'anjali-admin-token-authenticated-secret-2026',
      user: { name: 'Anjali Jewels Boutique Admin', email: 'maliyan04@icloud.com' }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// 14. Media upload (Base64 file upload)
app.post('/api/upload', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('anjali-admin-token')) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }

  try {
    const { filename, base64Data, contentType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'No file data provided' });
    }

    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(filename || 'image.jpg') || '.jpg';
    const cleanName = `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
    const targetFile = path.join(uploadsDir, cleanName);

    const base64Clean = base64Data.replace(/^data:.*?;base64,/, '');
    fs.writeFileSync(targetFile, Buffer.from(base64Clean, 'base64'));

    res.json({
      success: true,
      url: `/uploads/${cleanName}`,
      filename: cleanName
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve static public assets
app.use(express.static(path.join(__dirname, 'public')));

// Mount Vite or serve built SPA
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Anjali Jewels] Server running at http://localhost:${PORT}`);
  });
}

startServer();
